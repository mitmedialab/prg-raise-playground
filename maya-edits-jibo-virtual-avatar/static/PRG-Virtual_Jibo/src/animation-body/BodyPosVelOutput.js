import { AxisCommandMode, MotionLimiterMode } from "./BodyData.js";
import BodyOutput from "./BodyOutput.js";
import CyclicMath from "../ifr-motion/base/CyclicMath.js";
import slog from "../ifr-core/SLog.js";
import ErrorLogHelper from "./ErrorLogHelper.js";

const bodyChannel = "BODY_INTERFACE";

/**
 * Enum values for single axis status
 * @enum {number}
 */
const ControlState = {

	/**
	 * In this stage we are waiting for an opportunity to start controlling the motors.
	 * We will wait until we are connected, there is low motion, there is no timeout, there is no error.
	 * We will not exit this stage if we are paused.
	 * We enter this stage on startup, on setPause(false), or on auto-recovery after an error/lockout/timeout.
	 * We exit this stage to RESUMING when all the criteria of connected, low motion, no timeout, etc. are met
	 */
	ESTABLISHING: "ESTABLISHING",

	/**
	 * Once we are done ESTABLISHING, we enter RESUMING.  We are in control but not at the right positions, so this
	 * stage modifies the target commands to smoothly reduce the error from where we started, rather than
	 * commanding the actual target immediately, which would jerk the motor quickly to the target.
	 */
	RESUMING:  "RESUMING",

	/**
	 * We are in normal operating mode; pass through all commands to the motors.
	 */
	RUNNING:  "RUNNING"
};


/**
 * Timeline output connecting to the body service.
 * Communicates with the (remote) position-velocity control mode running on the body boards.
 * @param {Clock} clock - the timeline clock
 * @param {RobotInfo} robotInfo - robot info object
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {boolean} [startEnabled] - optional, if true, start up with motors enabled (defaults to false)
 * @param {number} [updateIntervalMillis] - if specified and non-zero, auto-update at the given interval
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const BodyPosVelOutput = function(clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken)
{
	BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);
	/** @type {Time} */
	this.startTime = null;
	/** @type {number[]} */
	this.initialDeltas = [];
	/** @type {boolean} */
	this.error = false;
	/** @type {boolean} */
	this.goLimpOnError = true;
	/** @type {boolean} */
	this.goLimpOnTimeout = true;
	/** @type {boolean} */
	this.goLimpOnDisconnect = true;
	/** @type {boolean} */
	this.goLimpOnUnIndexed = true;
	/** @type {boolean} */
	this.errorsAreSticky = false;
	/** @type {ControlState} */
	this.controlState = ControlState.ESTABLISHING;
	/** @type {number} */
	this.fadeSecondsMax = 8;
	/** @type {number} */
	this.fadeSeconds = 0;

	/** @type {Array.<function>} */
	this.unPauseCallbacks = [];


	/**
	 * The interval for logging about ongoing/continuous error conditions in seconds
	 * @type {number}
	 */
	this.errorComplaintInterval = 5;

	/** @type {MotionLimiterMode} */
	this.latestLimiterMode = MotionLimiterMode.OK;
	/** @type {Time} */
	this.limiterActivationTime = null;
	/** @type {number} */
	this.limiterActivationTolerance = 0.1;
	/** @type {boolean} */
	this.didLogLimiterWarning = false;

	/** @type {boolean} */
	this.everBeenIndexed = false;

	this.errorLogHelper = new ErrorLogHelper(this.clock, bodyChannel, this.errorComplaintInterval, this.errorComplaintInterval);
};

BodyPosVelOutput.prototype = Object.create(BodyOutput.prototype);
BodyPosVelOutput.prototype.constructor = BodyOutput;

/**
 *
 * @param {ControlState} controlState
 * @private
 */
BodyPosVelOutput.prototype._setControlState = function(controlState){
	if(this.controlState !== controlState){
		slog(bodyChannel, "state changed: "+this.controlState+" -> "+controlState);
		this.controlState = controlState;
	}
};

/**
 * Pauses or unpauses motor output.  No commands will be issued to the body service while paused.
 * @param {boolean} shouldPause - True if motor output should pause, false if it should resume.
 * @param {function} [callback] - called when operation completes.  called immediately for setPaused(true), called after we resume control for setPaused(false)
 * @override
 */
BodyPosVelOutput.prototype.setPaused = function(shouldPause, callback)
{
	slog(bodyChannel, "setPause:"+shouldPause+" has callback:"+(callback!=null));
	if(!shouldPause && this.isPaused()){ //we're resuming from a pause
		this._setControlState(ControlState.ESTABLISHING);
	}
	BodyOutput.prototype.setPaused.call(this, shouldPause, null); //don't pass callback to super, we will handle it
	if(callback!==null && callback!==undefined) {
		if (shouldPause) {
			//pausing, happens immediately
			slog(bodyChannel, " done setPause:true calling back");
			callback();
		} else {
			if(this.controlState === ControlState.RUNNING){
				//unpausing, but we are already unpaused
				slog(bodyChannel, " done setPause:false calling back (immediate)");
				callback();
			}else{
				this.unPauseCallbacks.push(callback);
			}
		}
	}
};

BodyPosVelOutput.prototype.update = function()
{
	let shouldCallUnPauseCallbacks = false;

	let i;
	/** @type {Time} */
	const currentTime = this.clock.currentTime();

	const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));


	if (this.motionInterface.hasLockout() || this.motionInterface.hasFault()) {
		this.error = true;
		if(this.goLimpOnError){
			if(this.controlState!==ControlState.ESTABLISHING){
				slog(bodyChannel, "disabling due to:"+
					(this.motionInterface.hasLockout()?" lockout("+this.motionInterface.getLockout()+"),":"")+
					(this.motionInterface.hasFault()?" fault("+this.motionInterface.getFaults()+"),":"")
				);
			}
			this._setControlState(ControlState.ESTABLISHING);
		}
	} else if (this.error && !this.errorsAreSticky) {
		//error is no longer being reported, but we have our error flag set from a recent report
		//AND, we have the setting that errors are NOT sticky, so we should clear the error flag.

		// clear error condition
		this.error = false;
	}

	let timeout = false;
	if(this.motionInterface.hasTimeout()){
		timeout = true;
		if(this.goLimpOnTimeout){
			if(this.controlState!==ControlState.ESTABLISHING){
				slog(bodyChannel, "disabling due to timeout");
			}
			this._setControlState(ControlState.ESTABLISHING);
		}
	}

	let connected = true;
	if(!this.motionInterface.isConnected()){
		connected = false;
		if(this.goLimpOnDisconnect){
			if(this.controlState!==ControlState.ESTABLISHING){
				slog(bodyChannel, "disabling due to not connected");
			}
			this._setControlState(ControlState.ESTABLISHING);
		}
	}

	let indexed;
	if(this.motionInterface.allIndexed()) {
		indexed = true;
		this.everBeenIndexed = true;
	}else {
		indexed = false;
		if(this.goLimpOnUnIndexed){
			if(this.controlState!==ControlState.ESTABLISHING){
				slog(bodyChannel, "disabling due to not indexed ("+this.motionInterface.getIndexStatuses()+")");
			}
			this._setControlState(ControlState.ESTABLISHING);
		}
	}


	const limiterMode = this.motionInterface.getLimiterMode();
	if(limiterMode!==null && limiterMode!==this.latestLimiterMode){
		this.limiterActivationTime = null;
		if(limiterMode===MotionLimiterMode.APPROACHING_LIMIT){
			//slog(bodyChannel, "motion approaching dynamic limits, motion limiting will be applied");
		}else if(limiterMode===MotionLimiterMode.EXCEEDING_LIMIT){
			//slog(bodyChannel, "motion exceeds dynamic limits, motion limiting is being applied");
			this.limiterActivationTime = currentTime;
		}else if(limiterMode===MotionLimiterMode.OK){
			if(this.didLogLimiterWarning){
				slog(bodyChannel, "motion is back within normal limits, no limiting is being applied");
				this.didLogLimiterWarning = false;
			}
		}else if(limiterMode===MotionLimiterMode.DISABLED){
			slog(bodyChannel, "warning: dynamic motion limiter is disabled");
		}else if(limiterMode===MotionLimiterMode.UNINDEXED){
			//slog(bodyChannel, "dynamic motion limiter is activating due to not indexed");
			//this.didLogLimiterWarning = true;
		}
		this.latestLimiterMode = limiterMode;
	}
	if(this.limiterActivationTime !== null && currentTime.subtract(this.limiterActivationTime) > this.limiterActivationTolerance){
		slog(bodyChannel, "motion exceeds dynamic limits, motion limiting is being applied");
		this.didLogLimiterWarning = true;
		this.limiterActivationTime = null;
	}

	if (!this.isPaused()){
		//first we see if we should update our ControlState out of establishing.
		//do this if there are no errors, and we're not moving, and the target is not moving
		if(this.controlState === ControlState.ESTABLISHING) {
			if (connected && !this.error && !timeout && indexed) {
				//we're clear on the various error conditions.

				let okToSoftStart = true;
				let currentState;

				//check if it is ok to soft start (no joint is moving fast)
				for (i = 0; i < this.dofNames.length; i++) {
					currentState = this.motionInterface.getState(this.dofNames[i]);
					const targetState = targets[i];
					const motionLimit = 0.2;
					if (Math.abs(currentState.vel) > motionLimit || Math.abs(targetState.velocity) > motionLimit) {
						okToSoftStart = false;

						this.errorLogHelper.noteMotionLockout(motionLimit, currentState, targetState);

						break;
					}
				}

				if (okToSoftStart) {
					this._setControlState(ControlState.RESUMING);

					//clear our error log print flags, we're operational
					this.errorLogHelper.operationResumed();

					//init the resume state
					this.startTime = currentTime;
					this.initialDeltas = [];
					let maxDelta = 0;
					for (i = 0; i < this.dofNames.length; i++) {
						currentState = this.motionInterface.getState(this.dofNames[i]);
						const currentTarget = CyclicMath.closestEquivalentRotation(targets[i].position, currentState.pos);
						const thisDelta = currentTarget - currentState.pos;
						this.initialDeltas.push(thisDelta);
						if (Math.abs(thisDelta) > maxDelta) {
							maxDelta = Math.abs(thisDelta);
						}
					}
					this.fadeSeconds = this.fadeSecondsMax * (maxDelta / Math.PI);
				}
			}else{

				this.errorLogHelper.noteError(connected, this.error, timeout, indexed, this.everBeenIndexed, this.errorsAreSticky, this.motionInterface);
			}
		}

		let fadeAlpha = 1;
		if(this.controlState === ControlState.RESUMING) {
			if(this.fadeSeconds < 0.01) {
				fadeAlpha = 1; //no time necessary. shouldn't compute for zero time cases (divide by zero)
			}else {
				fadeAlpha = currentTime.subtract(this.startTime) / this.fadeSeconds;
				fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
			}
			if (fadeAlpha >= 1) {
				this._setControlState(ControlState.RUNNING);
				shouldCallUnPauseCallbacks = true;
			}
		}

		for (i = 0; i < this.dofNames.length; i++) {
			/** @type {AxisCommandMode} */
			let commandMode = AxisCommandMode.BRAKE;
			if(this.enabledArray[i] &&
				(this.controlState === ControlState.RUNNING || this.controlState === ControlState.RESUMING)){
				commandMode = AxisCommandMode.POS_VEL;
			}
			const accelerationLimit = 50;
			let command;
			if (this.controlState === ControlState.RESUMING) { //we're resuming, need to add our catch-up
				const velocityCatchupContribution = this.initialDeltas[i] / this.fadeSeconds;

				//This check is to avoid adding miniscule catchup velocities;
				// motor controller is making an audible tone when this happens, which we want to avoid.
				if(Math.abs(velocityCatchupContribution) < 0.1){
					velocityCatchupContribution = 0;
				}
				command = [
					//targets[i].velocity * fadeAlpha, //option 1: fade velocity in? velocity won't quite match positions
					targets[i].velocity + velocityCatchupContribution,  //option 2: use exact velocity to match position fade (except when below threshold, above)
					targets[i].position - this.initialDeltas[i] * (1 - fadeAlpha)
				];
			}
			else {
				command = [targets[i].velocity, targets[i].position];
			}

			//bring position into -PI to PI
			command[1] = CyclicMath.closestEquivalentRotation(command[1], 0);

			//send only 1 value if we're in "limp" mode
			this.motionInterface.setCommand(this.dofNames[i], commandMode, commandMode === AxisCommandMode.POS_VEL ? command : 0, null, accelerationLimit, null);

			if (this.infoListeners.length > 0) {
				const state = this.motionInterface.getState(this.dofNames[i]);
				if(state != null) {
					const info = {
						dofName: this.dofNames[i],
						timestamp: currentTime,
						observedPosition: state.pos,
						targetPosition: command[1],
						observedVelocity: state.vel,
						commandVelocity: command[0],
						refVelocity: state.ref
					};
					for (let c = 0; c < this.infoListeners.length; c++) {
						this.infoListeners[c](info);
					}
				}
			}
		}

		this.motionInterface.sendCommand();

	}//end !paused

	if(shouldCallUnPauseCallbacks){
		slog(bodyChannel, " done enabling, notifying "+this.unPauseCallbacks.length+" \"setPause:false\" listeners");
		while(this.unPauseCallbacks.length > 0){
			this.unPauseCallbacks.shift()();
		}
	}

};

export default BodyPosVelOutput;
