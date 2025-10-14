"use strict";


const LookatWindupPolicy = function(targetDeltaToTriggerNewWindup,
									maxAllowedTriggerSpeed, minAllowedTriggerDistance, maxAllowedTriggerDistance,
									windupDistanceRatio, windupMinDistance, windupMaxDistance,
									overshootDistanceRatio, overshootMinDistance, overshootMaxDistance){
	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._lastTarget = null;

	/**
	 * @type {number}
	 * @private
	 */
	this._targetChangedWindupThreshold = targetDeltaToTriggerNewWindup;

	/**
	 * @type {WindupOvershootParams}
	 * @private
	 */
	this._trajectoryParams = {
		maxAllowedTriggerSpeed,
		minAllowedTriggerDistance,
		maxAllowedTriggerDistance,
		windupDistanceRatio,
		windupMinDistance,
		windupMaxDistance,
		overshootDistanceRatio,
		overshootMinDistance,
		overshootMaxDistance
	};
};

/**
 * @param {PoseOffsetFilterWindup} offsetFilter
 */
LookatWindupPolicy.prototype.configureFilter = function(offsetFilter){
	offsetFilter.configure(this._trajectoryParams);
};

/**
 * Determine whether its an appropriate time to begin a windup type trajectory
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport - distance report
 * @param {TrackMode} trackMode - current tracking mode
 * @param {Time} currentTime - time
 * @param {THREE.Vector3} target - new target
 * @return {boolean} true to begin a windup type trajectory
 */
LookatWindupPolicy.prototype.shouldWindup = function(lookatNodeDistanceReport, trackMode, currentTime, target){
	var trigger = false;
	if(this._lastTarget === null || this._lastTarget.distanceTo(target) > this._targetChangedWindupThreshold){
		trigger = true;
		//console.log("LookatWindupPolicy: triggering windup due to "+(this._lastTarget === null?"last target being null":"target change of "+this._lastTarget.distanceTo(target)));
	}
	if(this._lastTarget === null){
		this._lastTarget = target.clone();
	}else{
		this._lastTarget.copy(target);
	}
	return trigger;
};

export default LookatWindupPolicy;