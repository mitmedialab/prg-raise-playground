"use strict";

/**
 * Enum Values for track mode, informs Lookat to go to target or delay motion.
 * @enum {string}
 */
const StartStatus = {
	/**
	 * Go to target
	 */
	YES: "YES",
	/**
	 * Do not go to target
	 */
	NO: "NO",
	/**
	 * Do not go to target, but hint that we are planning to trigger after a delay
	 */
	LATER: "LATER"
};

const TrackPolicyTrigger = function(){

};

TrackPolicyTrigger.StartStatus = StartStatus;

/* superclass definition:        */
/* eslint-disable no-unused-vars */

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {?StartStatus}
 */
TrackPolicyTrigger.prototype.shouldStartTracking = function(lookatNodeDistanceReport, timeDelta){
	return null;
};

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {?boolean}
 */
TrackPolicyTrigger.prototype.shouldStopTracking = function(lookatNodeDistanceReport, timeDelta){
	return null;
};

/**
 * Called to notify trigger to reset state (start/end of lookat)
 */
TrackPolicyTrigger.prototype.reset = function(){
};

export default TrackPolicyTrigger;