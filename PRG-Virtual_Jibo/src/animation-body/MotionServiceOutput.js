import BodyOutput from "./BodyOutput.js";

/**
 * Timeline output connecting to the body service.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {string} motionServiceURL - URL for the position server
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const MotionServiceOutput = function(clock, robotInfo, bodyServiceURL, motionServiceURL, startEnabled, updateIntervalMillis, sessionToken)
{
	BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);

	this.commandSocket = new WebSocket(motionServiceURL);
};

MotionServiceOutput.prototype = Object.create(BodyOutput.prototype);
MotionServiceOutput.prototype.constructor = MotionServiceOutput;

MotionServiceOutput.prototype.update = function()
{
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));

	if (targets !== null && this.commandSocket.readyState === WebSocket.OPEN && !this.isPaused())
	{
		for (let i=0; i<this.dofNames.length; i++)
		{
			targets[i].enabled = this.enabledArray[i];
		}

		const cmd = JSON.stringify(targets);
		this.commandSocket.send(cmd);

		// update listeners
		if (this.infoListeners.length > 0 && this.motionInterface.isConnected())
		{
			for (let i=0; i<this.dofNames.length; i++)
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
	}
};

/**
 * @return {boolean}
 */
MotionServiceOutput.prototype.isConnected = function()
{
	return this.motionInterface.isConnected() && this.commandSocket.readyState === WebSocket.OPEN;
};

export default MotionServiceOutput;
