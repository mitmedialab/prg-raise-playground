"use strict";

import TrackPolicyTrigger from "./TrackPolicyTrigger.js";

/**
 *
 * @constructor
 * @extends TrackPolicyTrigger
 * @implements TrackPolicyListener
 */
const TrackPolicyTriggerOnOtherNode = function () {
	TrackPolicyTrigger.call(this);

	/**
	 * True whenever one or more other monitored nodes are tracking
	 * Assumes that other nodes are updated as often as this node, as
	 * state is cleared whenever we are queried.
	 *
	 * @type {boolean}
	 * @private
	 */
	this._otherNodeIsTracking = false;

	/**
	 * Enables/disables the functionality of this trigger
	 * @type {boolean}
	 * @private
	 */
	this._triggerThisNodeWhenOtherTracks = true;

};

TrackPolicyTriggerOnOtherNode.prototype = Object.create(TrackPolicyTrigger.prototype);
TrackPolicyTriggerOnOtherNode.prototype.constructor = TrackPolicyTriggerOnOtherNode;

/**
 * Enabled/disable this trigger
 * @param {boolean} trigger
 */
TrackPolicyTriggerOnOtherNode.prototype.setTriggerThisNodeOnOtherNode = function(trigger){
	this._triggerThisNodeWhenOtherTracks = trigger;
};

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
 * @param {number} timeDelta
 * @return {StartStatus}
 * @override
 */
TrackPolicyTriggerOnOtherNode.prototype.shouldStartTracking = function(lookatNodeDistanceReport, timeDelta){ // eslint-disable-line no-unused-vars
	var r = null;

	if(this._otherNodeIsTracking && this._triggerThisNodeWhenOtherTracks){
		r = TrackPolicyTrigger.StartStatus.YES;
	}else{
		r = TrackPolicyTrigger.StartStatus.NO;
	}

	this._otherNodeIsTracking = false;
	return r;
};

/**
 * Will be called when the TrackPolicy starts a track
 */
TrackPolicyTriggerOnOtherNode.prototype.notifyTrackStarted = function(){};

/**
 * Will be called when the TrackPolicy stops tracking
 */
TrackPolicyTriggerOnOtherNode.prototype.notifyTrackStopped = function(){};

/**
 * Called each time a TrackPolicy updates, passes in current mode
 * @param {TrackMode} trackMode
 */
TrackPolicyTriggerOnOtherNode.prototype.notifyTrackMode = function(trackMode){
	if(trackMode === "TRACK"){
		this._otherNodeIsTracking = true;
	}
};

export default TrackPolicyTriggerOnOtherNode;
