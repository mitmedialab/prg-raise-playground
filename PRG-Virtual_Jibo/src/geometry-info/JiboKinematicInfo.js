import KinematicsLoader from "../ifr-motion/loaders/KinematicsLoader.js";
import AnimationLoader from "../ifr-motion/loaders/AnimationLoader.js";
import LimitsLoader from "../ifr-motion/loaders/LimitsLoader.js";
import SkeletonLoader from "../ifr-geometry/loaders/SkeletonLoader.js";
import SceneInfo from "./SceneInfo.js";
import KinematicGroup from "../ifr-motion/dofs/KinematicGroup.js";
import InterpolatorSet from "../ifr-motion/base/InterpolatorSet.js";
import SeriesAlignedAxesTargetSelector from "../ifr-motion/base/SeriesAlignedAxesTargetSelector.js";
import ModelControlGroup from "../ifr-motion/dofs/ModelControlGroup.js";
import DOFGlobalAlignment from "../ifr-motion/base/DOFGlobalAlignment.js";
import EyeScreenInfo from "./EyeScreenInfo.js";
import Pose from "../ifr-motion/base/Pose.js";
import DOFSet from "./DOFSet.js";
import slog from "../ifr-core/SLog.js";

const channel = "MODEL_LOADING";

/**
 * @param {JiboConfig} jiboConfig
 * @constructor
 */
const JiboKinematicInfo = function(jiboConfig)
{
	/** @type {JiboConfig} */
	this._config = jiboConfig;

	/** @type {ModelControlGroup} */
	this._bodyControlGroup = null;
	/** @type {ModelControlGroup} */
	this._eyeControlGroup = null;
	/** @type {ModelControlGroup} */
	this._fullControlGroup = null;

	/** @type {string[]} */
	this._bodyDOFNames = [];
	/** @type {string[]} */
	this._eyeDOFNames = [];
	/** @type {string[]} */
	this._dofNames = [];

	/** @type {InterpolatorSet} */
	this._interpolatorSet = new InterpolatorSet();

	/** @type {KinematicGroup} */
	this._bodyKinematicGroup = null;
	/** @type {KinematicGroup} */
	this._fullKinematicGroup = null;

	/** @type {Motion} */
	this._defaultAnimation = null;
	/** @type {Pose} */
	this._defaultPose = null;

	/** @type {!boolean} */
	this.loadSucceeded = false;
	/** @type {string} */
	this.loadMessage = "";

	/** @type {EyeScreenInfo} */
	this._eyeScreenInfo = null;

	/** @type {Object.<string, DOFSet>} */
	this._dofSets = null;

	/** @type {DOFGlobalAlignment} */
	this._dofGlobalAlignment = null;
};

JiboKinematicInfo.prototype.load = function(callback)
{
	const self = this;

	const pending = [];

	let callbacksDone = null;

	let anyFailed = false;

	let bodySkeletonRoot = null;
	let fullSkeletonRoot = null;

	/** @type {Object.<string, Object>} */
	let dofLimits = null;

	//register that a callback is going to happen, so we can wait for it, and also note when it happens
	const getCallback = function(identifier, internalCallback){
		if(pending.indexOf(identifier) >= 0){
			throw new Error("JiboKinematicInfo:Cannot queue 2 loads with the same identifier ("+identifier+")");
		}
		pending.push(identifier);
		//slog(channel, "JiboKinematicInfo:Queuing load of "+identifier);
		return function(){
			const index = pending.indexOf(identifier);
			if(index === -1){
				slog(channel, "JiboKinematicInfo:Error, callback \""+identifier+"\" called but not currently pending.");
			}else{
				//slog(channel, "JiboKinematicInfo:Unqueuing load of "+identifier+" ("+pending.length+" remain)");
				pending.splice(index, 1);
			}
			if(internalCallback){
				internalCallback.apply(this, arguments);
			}
			if(pending.length === 0){
				//slog(channel, "JiboKinematicInfo:No more loads queued.  Calling final setup");
				callbacksDone();
			}
		};
	};

	//called when all pending callbacks have completed
	callbacksDone = function()
	{
		if(!anyFailed)
		{
			self.loadSucceeded = true;

			// concatenate the dof names
			self._dofNames = self._bodyDOFNames.concat(self._eyeDOFNames);

			//init pose's knowledge of total available dofs for array optimization
			if(Pose.hasOwnProperty("__globalSetup")) {
				Pose.__globalSetup(self._dofNames);
			}

			//set up the kinematic groups
			self._bodyKinematicGroup = new KinematicGroup(self._bodyControlGroup.getCopy(), bodySkeletonRoot);

			//new array combining the 2 lists, and corresponding controls/kinematic group
			const fullControlsList = self._eyeControlGroup.getControlList().concat(self._bodyControlGroup.getControlList());
			self._fullControlGroup = new ModelControlGroup();
			self._fullControlGroup.setControlList(fullControlsList);
			self._fullKinematicGroup = new KinematicGroup(self._fullControlGroup.getCopy(), fullSkeletonRoot);


			//set the default pose
			self._defaultPose = new Pose("default pose", self._dofNames);
			self._defaultAnimation.getPoseAtTime(self._defaultAnimation.getDuration()/2, self._interpolatorSet, self._defaultPose);
			for (let dofIndex=0; dofIndex<self._dofNames.length; dofIndex++)
			{
				if (self._defaultPose.get(self._dofNames[dofIndex], 0) === null)
				{
					self.loadMessage = "default animation has no value for DOF: "+self._dofNames[dofIndex];
					self.loadSucceeded = false;
					break;
				}
			}

			//TODO: load this info from file
			self._dofGlobalAlignment = new DOFGlobalAlignment(self._fullKinematicGroup, {
				middleSection_r:new SeriesAlignedAxesTargetSelector("middleSection_r", ["bottomSection_r"], [1]),
				topSection_r:new SeriesAlignedAxesTargetSelector("topSection_r", ["middleSection_r", "bottomSection_r"], [1,1])
			});

			//add the limits info
			const limitsDOFNames = Object.keys(dofLimits);
			for (let limitIndex=0; limitIndex<limitsDOFNames.length; limitIndex++)
			{
				const info = self._fullControlGroup.getDOFInfo(limitsDOFNames[limitIndex]);
				info.setLimitData(dofLimits[limitsDOFNames[limitIndex]]);
			}
		}
		else
		{
			self.loadSucceeded = false;
		}
		if(callback)
		{
			callback();
		}
	};

	const kinematicsLoader = new KinematicsLoader();

	//use an outstanding callback to ensure load cannot finish until all loads are queued
	const allQueuedCallback = getCallback("Ensure All Loads Queued", null);

	kinematicsLoader.load(self._config.getBodyKinematicsURL(), getCallback("Body Kinematics", function()
		{
			const kinematicsResult = kinematicsLoader.getResult();
			if (kinematicsResult.success)
			{
				self._bodyControlGroup = kinematicsResult.modelControlGroup;
				self._bodyDOFNames = self._bodyControlGroup.getDOFNames();
				self._interpolatorSet.addModelControlGroup(self._bodyControlGroup);
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "body kinematics load failed with message: "+kinematicsResult.message+", URL = "+kinematicsResult.url;
			}
		}
	));

	kinematicsLoader.load(self._config.getEyeKinematicsURL(), getCallback("Eye Kinematics", function()
		{
			const kinematicsResult = kinematicsLoader.getResult();
			if (kinematicsResult.success)
			{
				self._eyeControlGroup = kinematicsResult.modelControlGroup;
				self._eyeDOFNames = self._eyeControlGroup.getDOFNames();
				self._interpolatorSet.addModelControlGroup(self._eyeControlGroup);
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "eye kinematics load failed with message: "+kinematicsResult.message+", URL = "+kinematicsResult.url;
			}
		}
	));

	/** @type {SkeletonLoader} */
	const bodySkeletonLoader = new SkeletonLoader();
	bodySkeletonLoader.load(self._config.getBodySkeletonURL(), getCallback("Body Skeleton", function()
		{
			const bodySkeletonResult = bodySkeletonLoader.getResult();

			if(bodySkeletonResult.success)
			{
				bodySkeletonRoot = bodySkeletonResult.skeletonRoot;
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "body skeleton load failed with message: "+bodySkeletonResult.message+", URL = "+bodySkeletonResult.url;
			}
		}
	));

	/** @type {SkeletonLoader} */
	const fullSkeletonLoader = new SkeletonLoader();
	fullSkeletonLoader.load(self._config.getFullSkeletonURL(), getCallback("Full Skeleton", function()
		{
			const fullSkeletonResult = fullSkeletonLoader.getResult();

			if(fullSkeletonResult.success)
			{
				fullSkeletonRoot = fullSkeletonResult.skeletonRoot;
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "full skeleton load failed with message: "+fullSkeletonResult.message+", URL = "+fullSkeletonResult.url;
			}
		}
	));

	const animationLoader = new AnimationLoader();
	animationLoader.load(self._config.getRobotURL()+"jibo_default.anim", getCallback("Default Animation", function()
		{
			const animationResult = animationLoader.getResult();

			if (animationResult.success)
			{
				self._defaultAnimation = animationResult.motion;
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "default animation load failed with message: "+animationResult.message+", URL = "+animationResult.url;
			}
		}
	));

	const sceneInfo = new SceneInfo();
	sceneInfo.load(self._config.getSceneInfoURL(), getCallback("Scene Info", function()
		{
			if (sceneInfo.loadSucceeded)
			{
				self._eyeScreenInfo = new EyeScreenInfo(sceneInfo.faceScreenWidth, sceneInfo.faceScreenHeight, sceneInfo.faceScreenMeshName);
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "scene info failed with load message: "+sceneInfo.loadMessage+", URL = "+self._config.getSceneInfoURL();
			}
		}
	));

	DOFSet.load(self._config.getDOFGroupsURL(), getCallback("DOF Groups", function(allDOFSets, errorMessage)
		{
			if (allDOFSets != null) //check for null or undefined (eqnull)
			{
				self._dofSets = allDOFSets;
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "DOF Groups failed with load message: "+errorMessage+", URL = " + self._config.getDOFGroupsURL();
			}
		}
	));

	const limitsLoader = new LimitsLoader();
	limitsLoader.load(self._config.getLimitsURL(), getCallback("Limits", function()
		{
			const limitsResult = limitsLoader.getResult();

			if (limitsResult.success)
			{
				dofLimits = limitsResult.dofLimits;
			}
			else
			{
				anyFailed = true;
				self.loadMessage = "limits data load failed with message: "+limitsResult.message+", URL = "+limitsResult.url;
			}
		}
	));


	//This must be called after all loads queued
	allQueuedCallback();
};

/**
 * @return {ModelControlGroup}
 */
JiboKinematicInfo.prototype.getBodyControlGroup = function()
{
	return this._bodyControlGroup;
};

/**
 * @return {ModelControlGroup}
 */
JiboKinematicInfo.prototype.getEyeControlGroup = function()
{
	return this._eyeControlGroup;
};

/**
 * @return {ModelControlGroup}
 */
JiboKinematicInfo.prototype.getFullControlGroup = function()
{
	return this._fullControlGroup;
};

/**
 * @return {string[]}
 */
JiboKinematicInfo.prototype.getBodyDOFNames = function()
{
	return this._bodyDOFNames;
};

/**
 * @return {string[]}
 */
JiboKinematicInfo.prototype.getEyeDOFNames = function()
{
	return this._eyeDOFNames;
};

/**
 * @return {string[]}
 */
JiboKinematicInfo.prototype.getDOFNames = function()
{
	return this._dofNames;
};

/**
 * @return {KinematicGroup}
 */
JiboKinematicInfo.prototype.getFullKinematicGroup = function()
{
	return this._fullKinematicGroup;
};

/**
 * @return {KinematicGroup}
 */
JiboKinematicInfo.prototype.getBodyKinematicGroup = function()
{
	return this._bodyKinematicGroup;
};

/**
 * @return {InterpolatorSet}
 */
JiboKinematicInfo.prototype.getInterpolatorSet = function()
{
	return this._interpolatorSet;
};

/**
 * @return {Pose}
 */
JiboKinematicInfo.prototype.getDefaultPose = function()
{
	return this._defaultPose;
};

/**
 * @return {EyeScreenInfo}
 */
JiboKinematicInfo.prototype.getEyeScreenInfo = function()
{
	return this._eyeScreenInfo;
};

/**
 * @return {Object.<string,DOFSet>}
 */
JiboKinematicInfo.prototype.getDOFSets = function()
{
	return this._dofSets;
};

/**
 * @return {DOFGlobalAlignment}
 */
JiboKinematicInfo.prototype.getDOFGlobalAlignment = function()
{
	return this._dofGlobalAlignment;
};


export default JiboKinematicInfo;