import { AxisCommandMode } from "./BodyData.js";
import BodyOutput from "./BodyOutput.js";
import PVController from "../ifr-motion/feedback/PVController.js";

/**
 * Timeline output connecting to the body service.
 * Creates a local set of position-velocity feedback controllers wrapping
 * the (remote) velocity control mode on the body boards.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const BodyVelocityOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken)
{
	BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);

	/** @type {PVController[]} */
	this.feedbackControllers = [];
	for (let i=0; i<this.dofNames.length; i++)
	{
		this.feedbackControllers.push(new PVController());
	}
};

BodyVelocityOutput.prototype = Object.create(BodyOutput.prototype);
BodyVelocityOutput.prototype.constructor = BodyOutput;

BodyVelocityOutput.prototype.update = function()
{
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));

	if (targets !== null && this.motionInterface.isConnected() && !this.isPaused())
	{
		for (let i=0; i<this.dofNames.length; i++)
		{
			this.feedbackControllers[i].setTarget(currentTime, targets[i].position, targets[i].velocity);
			this.feedbackControllers[i].calculateForTime(currentTime);

			const commandVelocity = this.feedbackControllers[i].getCommandVelocity();
			const commandAcceleration = this.feedbackControllers[i].getCommandAcceleration();
			const commandMode = this.enabledArray[i] ? AxisCommandMode.VELOCITY : AxisCommandMode.BRAKE;

			this.motionInterface.setCommand(this.dofNames[i], commandMode, commandVelocity, null, commandAcceleration, null);

			const state = this.motionInterface.getState(this.dofNames[i]);
			this.feedbackControllers[i].acceptFeedback(currentTime, state.pos, state.vel, state.ref);

			if (this.infoListeners.length > 0)
			{
				const info = {
					dofName: this.dofNames[i],
					timestamp: currentTime,
					observedPosition: state.pos,
					targetPosition: targets[i].position,
					observedVelocity: state.vel,
					commandVelocity: commandVelocity
				};
				for (let c=0; c<this.infoListeners.length; c++)
				{
					this.infoListeners[c](info);
				}
			}
		}

		this.motionInterface.sendCommand();
	}
};

export default BodyVelocityOutput;
