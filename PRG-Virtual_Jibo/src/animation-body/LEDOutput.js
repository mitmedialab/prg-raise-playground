import LEDInterface from "./LEDInterface.js";
import TimerTools from "../ifr-core/TimerTools.js";

/**
 * Timeline output connecting to the LED service.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with LED output enabled (defaults to true)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const LEDOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken)
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
	/** @type {number} */
	this.rateLimit = 50;

	/** @type {LEDInterface} */
	this.ledInterface = new LEDInterface(bodyServiceURL, sessionToken);
	/** @type {string[]} */
	this.dofNames = this.robotInfo.getDOFSet("LED").getDOFs();

	/** @type {boolean} */
	this.enabled = startEnabled !== undefined ? startEnabled : true;

	this.updateHandle = null;
	if (updateIntervalMillis)
	{
		const self = this;
		this.updateHandle = TimerTools.setInterval(function()
		{
			self.update();
		}, updateIntervalMillis);
	}
};

/**
 * @return {boolean}
 */
LEDOutput.prototype.isConnected = function()
{
	return this.ledInterface.isConnected();
};

/**
 * Sets whether or not LED output is enabled.
 * @param {boolean} enabled
 */
LEDOutput.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * @param {Time} time
 * @param {Pose} pose
 * @param {Object} blackboard
 */
LEDOutput.prototype.handleOutput = function(time, pose, blackboard) // eslint-disable-line no-unused-vars
{
	this.outputTime = time;
	this.outputPose = pose;
};

LEDOutput.prototype.update = function()
{
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));

	if (targets !== null && this.enabled && this.ledInterface.isConnected())
	{
		const rgbValue = [];
		for (let i=0; i<this.dofNames.length; i++)
		{
			rgbValue.push(targets[i].position);
		}

		this.ledInterface.setCommand(rgbValue, this.rateLimit);
		this.ledInterface.sendCommand();
	}
};

/**
 * @param {Time} targetTime
 * @return {Object[]}
 */
LEDOutput.prototype.computeTargetsForTime = function(targetTime) // eslint-disable-line no-unused-vars
{
	if (this.outputPose !== null)
	{
		const targetPose = this.outputPose;

		const targets = [];
		for (let i=0; i<this.dofNames.length; i++)
		{
			const targetValue = targetPose.get(this.dofNames[i], 0);
			const velocity = targetPose.get(this.dofNames[i], 1);

			targets.push({position: targetValue, velocity: velocity});
		}

		return targets;
	}
	else
	{
		return null;
	}
};

/**
 * Permanently disables this output and stops all associated computation.
 */
LEDOutput.prototype.dispose = function()
{
	this.ledInterface.close();
	if (this.updateHandle !== null)
	{
		TimerTools.clearInterval(this.updateHandle);
		this.updateHandle = null;
	}
	this.robotInfo = null;
	this.outputPose = null;
};

export default LEDOutput;
