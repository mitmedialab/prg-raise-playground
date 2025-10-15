"use strict";

/**
 * @interface
 * @intdocs
 */
const TrackPolicyListener = function () {};

/**
 * Will be called when the TrackPolicy starts a track
 */
TrackPolicyListener.prototype.notifyTrackStarted = function(){

};

/**
 * Will be called when the TrackPolicy stops tracking
 */
TrackPolicyListener.prototype.notifyTrackStopped = function(){

};

/**
 * Called each time a TrackPolicy updates, passes in current mode
 * @param {TrackMode} trackMode
 */
TrackPolicyListener.prototype.notifyTrackMode = function(trackMode){ // eslint-disable-line no-unused-vars

};

export default TrackPolicyListener;
