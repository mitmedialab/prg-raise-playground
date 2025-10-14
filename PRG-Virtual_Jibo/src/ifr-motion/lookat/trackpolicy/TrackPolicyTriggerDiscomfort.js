"use strict";

import TrackPolicyTrigger from "./TrackPolicyTrigger.js";

/**
 * Track policy based on accumulating discomfort based on distance between current and optimal-position-for-target (delta).
 * Track is triggered when accumulation reaches 1.  Accumulation increases at a rate computed by linearly interpolating
 * from accumInner to accumOuter based on our delta's position between innerLimit and outerLimit.
 *
 * Track can be triggered immediately if "delta > outerLimit" and moveImmediatelyPastOuter is true.  (Otherwise accumulation
 * proceeds as if delta = outerLimit).  accumInner and accumOuter are in units/second.
 *
 *
 * @param {number} innerLimit - never move if delta < innerLimit.  innerLimit associates with accumInner for discomfort accumulation.
 * @param {number} outerLimit - outerLimit associates with accumOuter for discomfort accumulation.  Optionally move immediately if delta > outerLimit (see moveImmediatelyPastOuter)
 * @param {number} accumInner - accumulate discomfort at this rate when "delta = innerLimit"
 * @param {number} accumOuter - accumulate discomfort at this rate when "delta = outerLimit"
 * @param {boolean} moveImmediatelyPastOuter - if true, track immediately if "delta > outerLimit".  Otherwise accumulated discomfort as if delta = outerLimit.
 * @constructor
 * @extends TrackPolicyTrigger
 */
const TrackPolicyTriggerDiscomfort = function(innerLimit, outerLimit, accumInner, accumOuter, moveImmediatelyPastOuter){
	TrackPolicyTrigger.call(this);
	/** @type {number}
	 * @private */
	this._limitInner = innerLimit;

	/** @type {number}
	 * @private */
	this._limitOuter = outerLimit;

	/** @type {number}
	 * @private */
	this._accumValueInner = accumInner;

	/** @type {number}
	 * @private */
	this._accumValueOuter = accumOuter;

	/** @type {boolean}
	 * @private */
	this._moveImmediatelyPastOuter = moveImmediatelyPastOuter;

	/** @type {number}
	 * @private */
	this._accumValueCurrent = 0;

};

TrackPolicyTriggerDiscomfort.prototype = Object.create(TrackPolicyTrigger.prototype);
TrackPolicyTriggerDiscomfort.prototype.constructor = TrackPolicyTriggerDiscomfort;

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {StartStatus}
 * @override
 */
TrackPolicyTriggerDiscomfort.prototype.shouldStartTracking = function(lookatNodeDistanceReport, timeDelta){

	var status = null;

	var distance = lookatNodeDistanceReport.highestDistanceHoldToOptimal;
	if(distance < this._limitInner){
		this._accumValueCurrent = 0;
		status = TrackPolicyTrigger.StartStatus.NO;
	}else{
		if(distance >= this._limitOuter && this._moveImmediatelyPastOuter){
			this._accumValueCurrent = 1;
			status = TrackPolicyTrigger.StartStatus.YES;
		}else if (this._limitOuter > this._limitInner){ //if they are equal, this type of accum disabled
			//clamp
			distance = Math.max(this._limitInner, Math.min(this._limitOuter, distance));
			var alpha = (distance - this._limitInner) / (this._limitOuter - this._limitInner);
			var toAccum = (1-alpha)*this._accumValueInner + alpha*this._accumValueOuter;
			this._accumValueCurrent += (toAccum * timeDelta);
			if(this._accumValueCurrent > 1){
				status = TrackPolicyTrigger.StartStatus.YES;
			}else{
				status = TrackPolicyTrigger.StartStatus.LATER;
			}
		}
	}

	return status;
};

/**
 * Called to notify trigger to reset state
 */
TrackPolicyTriggerDiscomfort.prototype.reset = function(){
	this._accumValueCurrent = 0;
};

export default TrackPolicyTriggerDiscomfort;


