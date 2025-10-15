"use strict";

import TrackPolicyTrigger from "./TrackPolicyTrigger.js";

/**
 * @constructor
 * @extends TrackPolicyTrigger
 */
const TrackPolicyTriggerAlways = function(){
	TrackPolicyTrigger.call(this);
};

TrackPolicyTriggerAlways.prototype = Object.create(TrackPolicyTrigger.prototype);
TrackPolicyTriggerAlways.prototype.constructor = TrackPolicyTriggerAlways;

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {StartStatus}
 * @override
 */
TrackPolicyTriggerAlways.prototype.shouldStartTracking = function(lookatNodeDistanceReport, timeDelta){ // eslint-disable-line no-unused-vars

	return TrackPolicyTrigger.StartStatus.YES;
};

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {?boolean}
 */
TrackPolicyTriggerAlways.prototype.shouldStopTracking = function(lookatNodeDistanceReport, timeDelta){ // eslint-disable-line no-unused-vars
	return false;
};

export default TrackPolicyTriggerAlways;


