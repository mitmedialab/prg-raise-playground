import slog from "../ifr-core/SLog.js";

/**
 *
 * @param {Clock} clock
 * @param {string} printChannel
 * @param {number} motionPrintoutInterval
 * @param {number} errorPrintoutInterval
 * @constructor
 */
const ErrorLogHelper = function (clock, printChannel, motionPrintoutInterval, errorPrintoutInterval) {
	/** @type {Clock} */
	this.clock = clock;
	this.channel = printChannel;
	this.motionInterval = motionPrintoutInterval;
	this.errorInterval = errorPrintoutInterval;

	//a time to use as the reset time, old enough to cause any message to refresh printing
	this.resetTime = this.clock.currentTime().add(-Math.max(this.motionInterval, this.errorInterval));

	this.lastMotionPrintTime = this.resetTime;
	this.lastErrorPrintTime = this.resetTime;

	this.lastErrorHadDisconnected = false;
	this.lastErrorHadFault = false;
	this.lastErrorHadLockout = false;
	this.lastErrorHadTimeout = false;
	this.lastErrorHadUnindexed = false;
};


/**
 *
 * @param {number} motionLimit
 * @param {{vel:number}} currentState
 * @param {{velocity:number}} targetState
 */
ErrorLogHelper.prototype.noteMotionLockout = function(motionLimit, currentState, targetState){
	const curTime = this.clock.currentTime();
	if(curTime.subtract(this.lastMotionPrintTime) > this.motionInterval){
		let message = "staying in ESTABLISHING due motion > "+motionLimit+",";
		if(Math.abs(currentState.vel) > motionLimit){
			message += " physical:"+Math.abs(currentState.vel);
		}
		if(Math.abs(targetState.velocity) > motionLimit){
			message += " target:"+Math.abs(targetState.velocity);
		}
		slog(this.channel, message);
		this.lastMotionPrintTime = curTime;
	}
};

/**
 *
 * @param {boolean} connected
 * @param {boolean} hasError
 * @param {boolean} hasTimeout
 * @param {boolean} isIndexed
 * @param {boolean} hasEverBeenIndexed
 * @param {boolean} errorsSticky
 * @param {MotionInterface} motionInterface
 */
ErrorLogHelper.prototype.noteError = function(connected, hasError, hasTimeout, isIndexed, hasEverBeenIndexed, errorsSticky, motionInterface){
	const curTime = this.clock.currentTime();
	if(curTime.subtract(this.lastErrorPrintTime) > this.errorInterval){

		//skip printout if only issue is that we are unindexed and have never been
		//actually, we don't need this check; if our only issue is unindexed, we'll print it once because
		//state will not be different next time
		//if(!connected || hasError || hasTimeout || (!isIndexed && hasEverBeenIndexed)) {

			//check if there is a different in error state
			let differentState = false;

			if ((!connected) !== this.lastErrorHadDisconnected) { // jshint ignore:line
				this.lastErrorHadDisconnected = !connected;
				differentState = true;
			}

			if (motionInterface.hasFault() !== this.lastErrorHadFault) {
				this.lastErrorHadFault = motionInterface.hasFault();
				differentState = true;
			}

			if (motionInterface.hasLockout() !== this.lastErrorHadLockout) {
				this.lastErrorHadLockout = motionInterface.hasLockout();
				differentState = true;
			}

			if (hasTimeout !== this.lastErrorHadTimeout) {
				this.lastErrorHadTimeout = hasTimeout;
				differentState = true;
			}

			if ((!isIndexed) !== this.lastErrorHadUnindexed) { //jshint ignore:line
				this.lastErrorHadUnindexed = !isIndexed;
				differentState = true;
			}

			if(differentState) {
				slog(this.channel, "staying in ESTABLISHING due to:" +
					((!connected) ? " disconnected," : "") +
					(motionInterface.hasFault() ? " fault(" + motionInterface.getFaults() + ")," : "") +
					(motionInterface.hasLockout() ? " lockout(" + motionInterface.getLockout() + ")," : "") +
					(hasTimeout ? " timeout," : "") +
					(!isIndexed ? " unindexed(" + motionInterface.getIndexStatuses() + ")," : "") +
					(errorsSticky&&hasError ? " errorsSticky("+errorsSticky+")," : "")
				);
				this.lastErrorPrintTime = curTime;
			}
		//}
	}
};


ErrorLogHelper.prototype.operationResumed = function(){
	this.lastMotionPrintTime = this.resetTime;
	this.lastErrorPrintTime = this.resetTime;

	this.lastErrorHadDisconnected = false;
	this.lastErrorHadFault = false;
	this.lastErrorHadLockout = false;
	this.lastErrorHadTimeout = false;
	this.lastErrorHadUnindexed = false;
};

export default ErrorLogHelper;
