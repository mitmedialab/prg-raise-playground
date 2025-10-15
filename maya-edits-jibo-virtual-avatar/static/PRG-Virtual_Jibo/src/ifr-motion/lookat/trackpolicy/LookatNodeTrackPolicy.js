"use strict";

import TrackPolicyTrigger from "./TrackPolicyTrigger.js";

/**
 * Enum Values for track mode, informs Lookat to go to target or delay motion.
 * @enum {string}
 */
const TrackMode = {
	/**
	 * Go to target
	 */
	TRACK: "TRACK",
	/**
	 * Go to target, hint that target is a large motion away
	 */
	TRACK_SACCADE: "TRACK_SACCADE",
	/**
	 * Hold current position, no definite future motion planned
	 */
	HOLD: "HOLD",
	/**
	 * Hold current position, expecting to move in time
	 */
	DELAY: "DELAY"
};

/**
 * This class is responsible for computing the track state for a single lookat node based on the
 * policy for that particular node.  For example, one node may immediately track towards targets
 * that are sufficiently far away, but ignore small changes in the target position, while another node
 * might track towards any deviation no matter how small.
 *
 * Along with tracking vs holding, the policy can provide hints that help with events and other lookat behavior.
 * track can be TRACK or TRACK_SACCADE; both indicate that the node should track, but the latter indicates
 * a motion to new/distant target, and could be a good time to trigger additional behavior such as a blink.
 * Hold can be HOLD or DELAY; both indicate that the node should hold, but the latter indicates that the policy
 * is expecting to move and is waiting for time to pass first, so behaviors waiting for a lookat to fully
 * complete may want to consider this node as still "in progress" even though it is not yet moving.
 *
 * @param {TrackPolicyTrigger[]} checkers
 * @constructor
 */
const LookatNodeTrackPolicy = function(checkers){
	/** @type {TrackMode|string}
	 * @private */
	this._currentMode = TrackMode.HOLD;

	/** @type {TrackPolicyTrigger[]}
	 * @private */
	this._checkers = checkers;

	/** @type {Time}
	 * @private */
	this._lastTime = null;

	/**
	 *
	 * @type {TrackPolicyListener[]}
	 * @private
	 */
	this._trackPolicyListeners = null;
};

LookatNodeTrackPolicy.TrackMode = TrackMode;

/**
 *
 * @param {TrackPolicyListener} trackListener
 */
LookatNodeTrackPolicy.prototype.addListener = function(trackListener){
	if(this._trackPolicyListeners === null){
		this._trackPolicyListeners = [];
	}
	if(this._trackPolicyListeners.indexOf(trackListener) === -1){
		this._trackPolicyListeners.push(trackListener);
	}
};

/**
 *
 * @param {TrackPolicyListener} trackListener
 */
LookatNodeTrackPolicy.prototype.removeListener = function(trackListener){
	if(this._trackPolicyListeners!==null){
		var index = this._trackPolicyListeners.indexOf(trackListener);
		if(index !== -1) {
			this._trackPolicyListeners.splice(index, 1);
		}
		if(this._trackPolicyListeners.length === 0){
			this._trackPolicyListeners = null;
		}
	}
};

/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport distance report
 * @param {Time} time - time
 * @return {TrackMode}
 */
LookatNodeTrackPolicy.prototype.computeMode = function(lookatNodeDistanceReport, time){
	var startLaterIndicated = false;
	var i;

	var timeDelta = 0;

	if(this._lastTime !== null){
		timeDelta = time.subtract(this._lastTime);
	}

	this._lastTime = time;

	if(this._currentMode === TrackMode.HOLD){
		var shouldStart = false;
		for(i = 0; i < this._checkers.length; i++){
			var startChecker = this._checkers[i];
			var startStatus = startChecker.shouldStartTracking(lookatNodeDistanceReport, timeDelta);
			if(startStatus === TrackPolicyTrigger.StartStatus.YES){
				shouldStart = true;
			}
			if(startStatus === TrackPolicyTrigger.StartStatus.LATER){
				startLaterIndicated = true;
			}
		}
		if(shouldStart){
			this._start(time);
		}
	}else if(this._currentMode === TrackMode.TRACK){
		var anyWishToContinue = false;
		for(i = 0; i < this._checkers.length; i++){
			var stopChecker = this._checkers[i];
			var stopStatus = stopChecker.shouldStopTracking(lookatNodeDistanceReport, timeDelta);
			if(stopStatus === false) {
				anyWishToContinue = true;
			}
		}
		if(!anyWishToContinue){
			this._stop(time);
		}
	}

	var ret;
	if(this._currentMode === TrackMode.HOLD && startLaterIndicated){
		ret = TrackMode.DELAY;
	}else{
		ret = this._currentMode;
	}

	if(this._trackPolicyListeners !== null){
		for (i = 0; i < this._trackPolicyListeners.length; i++) {
			this._trackPolicyListeners[i].notifyTrackMode(ret);
		}
	}

	return ret;
};

//TODO: when do we reset??
LookatNodeTrackPolicy.prototype.reset = function(){
	for(var i = 0; i < this._checkers.length; i++){
		this._checkers[i].reset();
	}
	this._lastTime = null;
};

/**
 *
 * @returns {boolean} true if this policy has had a chance to update since its last reset
 */
LookatNodeTrackPolicy.prototype.hasBeenUpdatedSinceReset = function(){
	return this._lastTime !== null;
};

/**
 * @param time
 * @private
 */
LookatNodeTrackPolicy.prototype._start = function(time){ // eslint-disable-line no-unused-vars
	this._currentMode = TrackMode.TRACK;
	this.reset();
	if(this._trackPolicyListeners!==null){
		for (var i = 0; i < this._trackPolicyListeners.length; i++) {
			this._trackPolicyListeners[i].notifyTrackStarted();
		}
	}
};

/**
 * @param time
 * @private
 */
LookatNodeTrackPolicy.prototype._stop = function(time){ // eslint-disable-line no-unused-vars
	this._currentMode = TrackMode.HOLD;
	this.reset();
	if(this._trackPolicyListeners!==null){
		for (var i = 0; i < this._trackPolicyListeners.length; i++) {
			this._trackPolicyListeners[i].notifyTrackStopped();
		}
	}
};

export default LookatNodeTrackPolicy;