import MotionInterface from "./MotionInterface.js";
import TimerTools from "../ifr-core/TimerTools.js";

/**
 * Timeline output connecting to the body service.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const BodyOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken)
{
	/** @type {Clock} */
	this.clock = clock;
	/** @type {RobotInfo} */
	this.robotInfo = robotInfo;
	/** @type {Time} */
	this.outputTime = null;
	/** @type {Pose} */
	this.outputPose = null;

	/** @type {number} */
	this.reactionTime = 1/50;
	/** @type {number} */
	this.velocityCalcDelta = 1/50;

	/** @type {MotionInterface} */
	this.motionInterface = new MotionInterface(bodyServiceURL, sessionToken);
	/** @type {string[]} */
	this.dofNames = this.motionInterface.getMotionDOFNames();

	/** @type {boolean[]} */
	this.enabledArray = [];
	for (let i=0; i<this.dofNames.length; i++)
	{
		this.enabledArray.push(startEnabled !== undefined ? startEnabled : false);
	}

	/** @type {boolean} */
	this.paused = false;

	/** @type {Function[]} */
	this.infoListeners = [];

	this.updateHandle = null;
	if (updateIntervalMillis)
	{
		const self = this;
		this.updateHandle = TimerTools.setInterval(function()
		{
			self.update();
		}, updateIntervalMillis);
	}

	this.cachedTargets = null;
};

/**
 * @return {string[]}
 */
BodyOutput.prototype.getMotionDOFNames = function()
{
	return this.dofNames;
};

/**
 * @return {boolean}
 */
BodyOutput.prototype.isConnected = function()
{
	return this.motionInterface.isConnected();
};

/**
 * Sets whether or not motor output is enabled.
 * Can specify a single boolean (for all motion DOFs collectively) or an
 * array of booleans (for each individual motion DOF).
 * @param {boolean|boolean[]} enabled
 */
BodyOutput.prototype.setEnabled = function(enabled)
{
	for (let i=0; i<this.enabledArray.length; i++)
	{
		this.enabledArray[i] = (enabled instanceof Array) ? enabled[i] : enabled;
	}
};

/**
 * Pauses or unpauses motor output.  No commands will be issued to the body service while paused.
 * @param {boolean} shouldPause - True if motor output should pause, false if it should resume.
 * @param {function} [callback] - called when operation completes.
 */
BodyOutput.prototype.setPaused = function(shouldPause, callback)
{
	this.paused = shouldPause;
	if(callback!==null && callback!==undefined) {
		callback();
	}
};

/**
 * @return {boolean}
 */
BodyOutput.prototype.isPaused = function()
{
	return this.paused;
};

/**
 * @return {MotionInterface}
 */
BodyOutput.prototype.getMotionInterface = function()
{
	return this.motionInterface;
};

/**
 * Adds an info listener callback.
 * @param {Function} infoListener
 */
BodyOutput.prototype.addInfoListener = function(infoListener)
{
	this.infoListeners.push(infoListener);
};

/**
 * @param {Time} time
 * @param {Pose} pose
 * @param {Object} blackboard
 */
BodyOutput.prototype.handleOutput = function(time, pose, blackboard) // eslint-disable-line no-unused-vars
{
	this.outputTime = time;
	this.outputPose = pose;
	this.computeTargetsForTime(time, true);
};

BodyOutput.prototype.update = function()
{
	// override in subclass
};

/**
 * @param {Time} targetTime
 * @param {boolean} [recomputeTargets]
 * @return {Object[]}
 */
BodyOutput.prototype.computeTargetsForTime = function(targetTime, recomputeTargets)
{
	if (!recomputeTargets)
	{
		return this.cachedTargets;
	}

	if (this.outputPose !== null)
	{
		const targetPose = this.outputPose;

		const targets = [];
		for (let i=0; i<this.dofNames.length; i++)
		{
			const targetAngle = targetPose.get(this.dofNames[i], 0);
			const velocity = targetPose.get(this.dofNames[i], 1);
			if(Math.abs(velocity) < 0.01){
				velocity = 0;
			}

			targets.push({position: targetAngle, velocity: velocity});
		}

		this.cachedTargets = targets;
		return targets;
	}
	else
	{
		this.cachedTargets = null;
		return null;
	}
};

/**
 * Permanently disables this output and stops all associated computation.
 */
BodyOutput.prototype.dispose = function()
{
	this.motionInterface.close();
	if (this.updateHandle !== null)
	{
		TimerTools.clearInterval(this.updateHandle);
		this.updateHandle = null;
	}
	this.robotInfo = null;
	this.outputPose = null;
};

export default BodyOutput;
