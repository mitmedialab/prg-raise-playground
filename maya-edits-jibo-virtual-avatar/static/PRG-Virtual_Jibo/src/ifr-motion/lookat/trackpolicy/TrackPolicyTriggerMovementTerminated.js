"use strict";

import TrackPolicyTrigger from "./TrackPolicyTrigger.js";

/**
 * @param {number} deadZone
 * @param {number} deadTime;
 * @param {number} deadVelocity;
 * @constructor
 * @extends TrackPolicyTrigger
 */
const TrackPolicyTriggerMovementTerminated = function(deadZone, deadTime, deadVelocity){
	TrackPolicyTrigger.call(this);
	/**@type {number}
	 * @private */
	this._deadZone = deadZone;

	/**@type {number}
	 * @private */
	this._deadTime = deadTime;

	/**@type {number}
	 * @private */
	this._deadVelocity = deadVelocity;

	/**@type {number}
	 * @private */
	this._deadTimeAccumulated = 0;
};

TrackPolicyTriggerMovementTerminated.prototype = Object.create(TrackPolicyTrigger.prototype);
TrackPolicyTriggerMovementTerminated.prototype.constructor = TrackPolicyTriggerMovementTerminated;

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {?boolean}
 */
TrackPolicyTriggerMovementTerminated.prototype.shouldStopTracking = function(lookatNodeDistanceReport, timeDelta){
	var distance = lookatNodeDistanceReport.highestDistanceOptimalToFiltered;
	var velocity = lookatNodeDistanceReport.highestVelocityFiltered;

	if(distance <= this._deadZone && velocity <= this._deadVelocity){
		this._deadTimeAccumulated += timeDelta;
	}else{
		this._deadTimeAccumulated = 0;
	}

	return this._deadTimeAccumulated > this._deadTime;
};

/**
 * Called to notify trigger to reset state
 */
TrackPolicyTriggerMovementTerminated.prototype.reset = function(){
	this._deadTimeAccumulated = 0;
};

export default TrackPolicyTriggerMovementTerminated;


