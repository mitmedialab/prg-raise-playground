import JiboConfig from "./JiboConfig.js";
import JiboKinematicInfo from "./JiboKinematicInfo.js";
import slog from "../ifr-core/SLog.js";

const channel = "MODEL_LOADING";

/**
 * Protected constructor for internal use only.
 *
 * RobotInfo provides robot configuration info used by the animate module,
 * including DOF names, default values, and other geometric info. Typically accessed
 * via the animate module's [getRobotInfo]{@link jibo.animate#getRobotInfo} method.
 *
 * @param {JiboConfig} jiboConfig - Protected constructor parameter.
 * @param {JiboKinematicInfo} kinematicInfo - Protected constructor parameter.
 * @class RobotInfo
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
const RobotInfo = function(jiboConfig, kinematicInfo){
	/** @type {JiboConfig} */
	/** @private */
	this._jiboConfig = jiboConfig;
	/** @type {JiboKinematicInfo} */
	/** @private */
	this._kinematicInfo = kinematicInfo;
};

/**
 * @callback RobotInfoCreated
 * @param {RobotInfo} robotInfo - Loaded robot info or null.
 * @private
 */

/**
 * Factory method to create a RobotInfo by loading data from the provided
 * jiboConfig. Callback will be called and will provide the loaded instance
 * as its first argument if loading is successful. Callback will be provided
 * null otherwise.
 *
 * @param {JiboConfig} jiboConfig - Configuration information to load.
 * @param {RobotInfoCreated} creationCompleteCallback - Callback to notify when loading is complete.
 * @private
 */
RobotInfo.createInfo = function(jiboConfig, creationCompleteCallback){
	if (jiboConfig === undefined || jiboConfig === null){
		jiboConfig = new JiboConfig();
	}
	const kinematicInfo = new JiboKinematicInfo(jiboConfig);
	kinematicInfo.load(function() {
		if (kinematicInfo.loadSucceeded) {
			creationCompleteCallback(new RobotInfo(jiboConfig, kinematicInfo));
		}else{
			slog(channel, "RobotInfo creation failed: "+kinematicInfo.loadMessage);
			creationCompleteCallback(null);
		}
	});
};

/**
 * @returns {JiboKinematicInfo}
 * @private
 */
RobotInfo.prototype.getKinematicInfo = function(){
	return this._kinematicInfo;
};

/**
 * @returns {JiboConfig}
 * @private
 */
RobotInfo.prototype.getConfig = function(){
	return this._jiboConfig;
};

/**
 * Returns the names of all of the DOFs in the robot's body.
 * @method jibo.animate.RobotInfo#getBodyDOFNames
 * @return {string[]}
 */
RobotInfo.prototype.getBodyDOFNames = function()
{
	return this._kinematicInfo.getBodyDOFNames();
};

/**
 * Returns the names of all of the DOFs in the robot's eye/face.
 * @method jibo.animate.RobotInfo#getEyeDOFNames
 * @return {string[]}
 */
RobotInfo.prototype.getEyeDOFNames = function()
{
	return this._kinematicInfo.getEyeDOFNames();
};

/**
 * Returns the full set of DOF names for the robot.
 * @method jibo.animate.RobotInfo#getDOFNames
 * @return {string[]}
 */
RobotInfo.prototype.getDOFNames = function()
{
	return this._kinematicInfo.getDOFNames();
};

/**
 * Returns info about the eye screen.
 * @return {EyeScreenInfo}
 * @private
 */
RobotInfo.prototype.getEyeScreenInfo = function()
{
	return this._kinematicInfo.getEyeScreenInfo();
};

/**
 * Returns a DOFInfo report for the specified DOF.
 * @method jibo.animate.RobotInfo#getDOFInfo
 * @param {string} dofName DOF to return a DOFInfo report for.
 * @return {jibo.animate.DOFInfo}
 */
RobotInfo.prototype.getDOFInfo = function(dofName)
{
	return this._kinematicInfo.getFullControlGroup().getDOFInfo(dofName);
};

/**
 * Returns a map with the default values for all of the robot's DOFs.
 * @method jibo.animate.RobotInfo#getDefaultDOFValues
 * @return {Object.<string, Object>}
 */
RobotInfo.prototype.getDefaultDOFValues = function()
{
	/** @type {Object.<string, Object>} */
	const dofValues = {};

	const defaultPose = this._kinematicInfo.getDefaultPose();
	const dofNames = this.getDOFNames();
	for (let dofIndex=0; dofIndex<dofNames.length; dofIndex++)
	{
		const dofName = dofNames[dofIndex];
		dofValues[dofName] = defaultPose.get(dofName, 0);
	}

	return dofValues;
};

/**
 * Returns the full set of DOFSet names for the robot.
 * @method jibo.animate.RobotInfo#getDOFSetNames
 * @return {string[]} Names of DOFSets.
 */
RobotInfo.prototype.getDOFSetNames = function()
{
	return Object.keys(this._kinematicInfo.getDOFSets());
};


/**
 * Returns the DOFSet specified by the given name.
 * @method jibo.animate.RobotInfo#getDOFSet
 * @param {string} dofSetName - Name of DOFSet to get.
 * @return {jibo.animate.DOFSet} DOFSet or null if not found.
 */
RobotInfo.prototype.getDOFSet = function(dofSetName)
{
	return this._kinematicInfo.getDOFSets()[dofSetName];
};

export default RobotInfo;
