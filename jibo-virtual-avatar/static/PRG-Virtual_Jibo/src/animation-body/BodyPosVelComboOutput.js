import { AxisCommandMode } from "./BodyData.js";
import BodyOutput from "./BodyOutput.js";
import Clock from "../ifr-core/Clock.js";

/**
 * Timeline output connecting to the body service.
 * Communicates with the (remote) position-velocity control mode running on the body boards.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @param {number} [idleModeSwitchTime=0.3] - switch to zero velocity idle after this many seconds of static position commands (0 to never switch to idle)
 * @constructor
 */
const BodyPosVelComboOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken, idleModeSwitchTime)
{
	BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);
	this.idleModeSwitchTime = 0.3;
	if(idleModeSwitchTime != null){
		this.idleModeSwitchTime = idleModeSwitchTime;
	}

	/** @type {Time} */
	this.startTime = null;
	/** @type {SingleAxisState[]} */
	this.initialStates = [];

	/** @type {Time[]} */
	this.lastMovingCommandTime = [];

	/** @type {number} */
	this.movingEpsilon = 0.0001;
};

BodyPosVelComboOutput.prototype = Object.create(BodyOutput.prototype);
BodyPosVelComboOutput.prototype.constructor = BodyOutput;

/**
 * Pauses or unpauses motor output.  No commands will be issued to the body service while paused.
 * @param {boolean} shouldPause - True if motor output should pause, false if it should resume.
 * @override
 */
BodyPosVelComboOutput.prototype.setPaused = function(shouldPause)
{
	BodyOutput.prototype.setPaused.call(this, shouldPause);
	if (shouldPause)
	{
		this.startTime = null;
		this.initialStates = [];
		this.lastMovingCommandTime = [];
	}
};

BodyPosVelComboOutput.prototype.update = function()
{
	let i;
	/** @type {Time} */
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));

	if (targets !== null && this.motionInterface.isConnected() && !this.isPaused())
	{
		if(this.startTime === null){
			//grab the initial states and start time after we are first connected for fade-in
			this.startTime = currentTime;
			for (i=0; i<this.dofNames.length; i++)
			{
				this.initialStates.push(this.motionInterface.getState(this.dofNames[i]));
			}

			//init motion-stopped idle trackers
			for (i=0; i<this.dofNames.length; i++)
			{
				this.lastMovingCommandTime.push(Clock.currentTime());
			}
		}

		let fadeAlpha = 1;
		const fadeSecondsMax = 8;
		if(currentTime.subtract(this.startTime) < fadeSecondsMax){
			let maxDistance = 0;
			for (i=0; i<this.dofNames.length; i++)
			{
				if(Math.abs(this.initialStates[i].pos) > maxDistance)
				{
					maxDistance = Math.abs(this.initialStates[i].pos);
				}
			}
			maxDistance = Math.max(0, Math.min(Math.PI, maxDistance));
			const fadeSeconds = fadeSecondsMax * (maxDistance/Math.PI);

			fadeAlpha = currentTime.subtract(this.startTime) / fadeSeconds;
			fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
		}

		for (i=0; i<this.dofNames.length; i++)
		{
			const accelerationLimit = 50;
			let command;
			if(fadeAlpha < 1){
				command = [
					targets[i].velocity * fadeAlpha,
					targets[i].position * fadeAlpha + this.initialStates[i].pos*(1-fadeAlpha)
				];
				this.lastMovingCommandTime[i] = Clock.currentTime();
			}else {
				command = [targets[i].velocity, targets[i].position];
			}

			if(Math.abs(command[0]) > this.movingEpsilon || fadeAlpha < 1){
				//prevent idle if starting up or moving more than epsilon speed
				this.lastMovingCommandTime[i] = Clock.currentTime();
			}

			let sendVelocity;
			let sendPosition;

			if(this.idleModeSwitchTime > 0 && Clock.currentTime().subtract(this.lastMovingCommandTime[i]) > this.idleModeSwitchTime){
				//idle mode (assumed to be at target position, no desired velocity)  send velocity mode 0, or limp if disabled.

				this.motionInterface.setCommand(this.dofNames[i], this.enabledArray[i]?AxisCommandMode.VELOCITY:AxisCommandMode.BRAKE, 0, null, accelerationLimit, null);
				sendVelocity = 0;
				sendPosition = 0.25; //undefined, not sent
			}else{
				//regular mode.  send posvel command, or limp if disabled.

				const commandMode = this.enabledArray[i] ? AxisCommandMode.POS_VEL : AxisCommandMode.BRAKE;
				//send only 1 value if we're in "limp" mode
				this.motionInterface.setCommand(this.dofNames[i], commandMode, commandMode===AxisCommandMode.POS_VEL?command:0, null, accelerationLimit, null);
				sendVelocity = command[0];
				sendPosition = command[1];
			}


			if (this.infoListeners.length > 0)
			{
				const state = this.motionInterface.getState(this.dofNames[i]);
				const info = {
					dofName: this.dofNames[i],
					timestamp: currentTime,
					observedPosition: state.pos,
					targetPosition: sendPosition,
					observedVelocity: state.vel,
					commandVelocity: sendVelocity,
					refVelocity: state.ref
				};
				for (let c=0; c<this.infoListeners.length; c++)
				{
					this.infoListeners[c](info);
				}
			}
		}

		this.motionInterface.sendCommand();
	}
	else
	{
		// reset initial states for soft resume
		this.startTime = null;
		this.initialStates = [];
		this.lastMovingCommandTime = [];
	}
};

export default BodyPosVelComboOutput;
