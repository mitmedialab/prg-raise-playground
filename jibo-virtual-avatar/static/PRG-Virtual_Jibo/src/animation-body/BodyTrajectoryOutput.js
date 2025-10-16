import { AxisCommandMode } from "./BodyData.js";
import BodyOutput from "./BodyOutput.js";

/**
 * Timeline output connecting to the body service.
 * Communicates with the (remote) trajectory control mode running on the body boards.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const BodyTrajectoryOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken)
{
	BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);
};

BodyTrajectoryOutput.prototype = Object.create(BodyOutput.prototype);
BodyTrajectoryOutput.prototype.constructor = BodyOutput;

BodyTrajectoryOutput.prototype.update = function()
{
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime) && !this.isPaused());

	if (targets !== null && this.motionInterface.isConnected())
	{
		for (let i=0; i<this.dofNames.length; i++)
		{
			const commandMode = this.enabledArray[i] ? AxisCommandMode.TRAJECTORY : AxisCommandMode.BRAKE;
			const interceptTime = 0.3;
			const accelerationLimit = 30;
			const command = [targets[i].velocity, targets[i].position, interceptTime, 0];

			//send only 1 value if we're in "limp" mode
			this.motionInterface.setCommand(this.dofNames[i], commandMode, commandMode===AxisCommandMode.TRAJECTORY?command:0, null, accelerationLimit, null);

			if (this.infoListeners.length > 0)
			{
				const state = this.motionInterface.getState(this.dofNames[i]);
				const info = {
					dofName: this.dofNames[i],
					timestamp: currentTime,
					observedPosition: state.pos,
					targetPosition: targets[i].position,
					observedVelocity: state.vel,
					commandVelocity: targets[i].velocity
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

export default BodyTrajectoryOutput;
