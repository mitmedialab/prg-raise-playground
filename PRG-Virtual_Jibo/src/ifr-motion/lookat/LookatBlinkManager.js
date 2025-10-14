"use strict";

import LookatNodeTrackPolicy from "./trackpolicy/LookatNodeTrackPolicy.js";

/**
 * @interface BlinkDelegate 
 * @intdocs
 */

/**
 * @function
 * @name BlinkDelegate#blink
 * @param {boolean} [interrupt]
 */

/**
 * Blink manager will trigger a blink if all the following conditions are met:
 * 	- we are in an active track mode (not HOLD or DELAY)
 * 	- enough time has passed since the last blink*
 * 	- enough delta is present from filtered ("current") position and target position
 *
 * 	 * there are 2 time thresholds,
 * 	 	- time between blinks on the same motion (we have not stopped moving between blinks)
 * 	    - time between blinks across trajectories (we have stopped in between blinks)
 * 	 a small value for the former could allow 2 blinks on the same motion
 *
 * @param {BlinkDelegate} blinkDelegate
 * @param {number} triggerAtDelta - delta angle to trigger a blink
 * @param {number} minRetriggerTimeSameTrajectory - require this amount of time between triggerings in cases where zero delta not achieved
 * @param {number} minRetriggerTimeAcrossTrajectories - require this amount of time between triggerings in case where zero delta achieved between triggers
 * @param {number} minDeltaToMarkTrajectoryOver - min distance to count as zeroing, ie, target achieved
 * @param {number} onlyAtOrAfterWindupPhase - delay blink trigger to at or after this windup phase.  null for no delay. (no delay if no windup on this node)
 * @constructor
 */
const LookatBlinkManager = function(blinkDelegate, triggerAtDelta,
								minRetriggerTimeSameTrajectory,
								minRetriggerTimeAcrossTrajectories,
								minDeltaToMarkTrajectoryOver,
								onlyAtOrAfterWindupPhase){
	/** @type {BlinkDelegate} */
	this.blinkDelegate = blinkDelegate;
	/** @type {number} */
	this.triggerAtDelta = triggerAtDelta;
	/** @type {number} */
	this.minRetriggerTimeSameTrajectory = minRetriggerTimeSameTrajectory;
	/** @type {number} */
	this.minRetriggerTimeAcrossTrajectories = minRetriggerTimeAcrossTrajectories;
	/** @type {number} */
	this.minDeltaToMarkTrajectoryOver = minDeltaToMarkTrajectoryOver;

	/**
	 * If windup is present, only trigger during the windup phase specified or at later phases.
	 * Ignored if no windup. Null for any phase.
	 * @type {?number}
	 */
	this.onlyAtOrAfterWindupPhase = onlyAtOrAfterWindupPhase;

	/** @type {Time} */
	this.lastTriggerTime = null;

	this.achievedZeroSinceLastBlink = false;
};


/**
 *
 * @param {LookatNodeDistanceReport} lookatNodeDistanceReport - distance report
 * @param {TrackMode} trackMode - current tracking mode
 * @param {?WindupState} windupState - progress through windup, or null if no windup is present on this node
 * @param {Time} currentTime - time
 */
LookatBlinkManager.prototype.update = function(lookatNodeDistanceReport, trackMode, windupState, currentTime){
	if(trackMode !== LookatNodeTrackPolicy.TrackMode.DELAY && trackMode !== LookatNodeTrackPolicy.TrackMode.HOLD){
		//active track mode, ok to blink
		if(this.lastTriggerTime === null ||
			(this.achievedZeroSinceLastBlink && currentTime.subtract(this.lastTriggerTime) >= this.minRetriggerTimeAcrossTrajectories) ||
			(!this.achievedZeroSinceLastBlink && currentTime.subtract(this.lastTriggerTime) >= this.minRetriggerTimeSameTrajectory)){
			//it has been long enough, ok to blink
			if(lookatNodeDistanceReport.highestDistanceOptimalToFiltered >= this.triggerAtDelta){
				if(this.onlyAtOrAfterWindupPhase === null || windupState === null || windupState >= this.onlyAtOrAfterWindupPhase) {
					//only restrict to windup phase if we are configured to restrict, and the windup state is non-null (windup present/exists)

					//blink!
					this.blinkDelegate.blink();
					this.lastTriggerTime = currentTime;
					this.achievedZeroSinceLastBlink = false;
				}
			}
		}
		if(!this.achievedZeroSinceLastBlink && lookatNodeDistanceReport.highestDistanceOptimalToFiltered < this.minDeltaToMarkTrajectoryOver) {
			//console.log("Marking blink as having paused due to close distance");
			this.achievedZeroSinceLastBlink = true;
		}
	}else{
		//console.log("Marking blink as having paused due to HOLD/DELAY");
		this.achievedZeroSinceLastBlink = true;
	}
};



export default LookatBlinkManager;
