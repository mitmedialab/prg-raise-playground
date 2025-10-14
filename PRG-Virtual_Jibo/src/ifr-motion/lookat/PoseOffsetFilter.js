"use strict";

import slog from "../../ifr-core/SLog.js";
import AccelPlanner from "../base/AccelPlanner.js";
import Pose from "../base/Pose.js";

const channel = "LOOKAT";

/**
 *
 * @param {string[]} dofNames
 * @constructor
 */
const PoseOffsetFilter = function(dofNames) {

	/**
	 * @type {string[]}
	 * @protected
	 */
	this._dofNames = dofNames;

	/**
	 * @type {Pose}
	 * @protected
	 */
	this._targetPose = new Pose("POF Target", dofNames);

	/**
	 * @type {Pose}
	 * @protected
	 */
	this._filteredPose = new Pose("POF Filtered", dofNames);

	/**
	 * @type {AccelPlanner}
	 * @protected
	 */
	this._accelPlanner = new AccelPlanner();

	/**
	 * @type {number}
	 * @protected
	 */
	this._accLimit = 0.5;

	/**
	 * @type {number}
	 * @protected
	 */
	this._rejectionVelocityThreshold = 0;

	/**
	 * @type {number}
	 * @protected
	 */
	this._epsilon = 0.00001;


	/**
	 * @type {Array.<number>}
	 * @protected
	 */
	this._dofIndices = this._targetPose.getDOFIndices();
};

/**
 * Compute the time needed to make the trip to targetPose
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {AccelPlanner} accelPlanner
 * @param {number} accLimit
 * @param {Array.<number>} dofIndices
 * @return {number}
 * @protected
 */
PoseOffsetFilter.prototype._timeForLongestDOF = function(targetPose, filteredPose, accelPlanner, accLimit, dofIndices){
	/** @type {number} */
	var currentPos, currentVel;
	/** @type {number} */
	var target;
	/** @type {AccelPlan} */
	var myPlan;

	/** @type {number} */
	var index;

	var transitionTime = 0;
	for(var i = 0; i < dofIndices.length; i++){
		index = dofIndices[i];
		currentPos = filteredPose.getByIndex(index, 0);
		currentVel = filteredPose.getByIndex(index, 1);
		target = targetPose.getByIndex(index, 0);

		myPlan = accelPlanner.computeWithFixedAccel(currentVel, 0, target - currentPos, accLimit);
		var thisDOFTime;
		if(myPlan && myPlan.isConsistent()){
			thisDOFTime = myPlan.getTotalTime();
		}else{
			slog(channel, "PoseOffsetFilter(tt) for "+filteredPose.getDOFNameForIndex(index)+" got invalid plan, using backup time of 10! (currentVel:"+currentVel+", target:"+target+", currentPos:"+currentPos+", acceLimit:"+accLimit+")");
			thisDOFTime = 10; //should never happen, but still need to act...  choose large time.
		}
		if (thisDOFTime > transitionTime) {
			transitionTime = thisDOFTime;
		}
	}
	return transitionTime;
};

/**
 *
 * @param {number} advanceSeconds - advance by this many seconds
 * @param {number} totalTransitTime - target this time as the total transit time
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {AccelPlanner} accelPlanner
 * @param {Array.<number>} dofIndices
 *
 * @protected
 */
PoseOffsetFilter.prototype._advanceFixedTimeMode = function(advanceSeconds, totalTransitTime, targetPose, filteredPose, accelPlanner, dofIndices){
	/** @type {number} */
	var currentPos, currentVel;
	/** @type {number} */
	var target;
	/** @type {AccelPlan} */
	var myPlan;

	/** @type {number} */
	var index;

	if(totalTransitTime > this._epsilon) {
		for(var i = 0; i < dofIndices.length; i++){

			index = dofIndices[i];

			currentPos = filteredPose.getByIndex(index, 0);
			currentVel = filteredPose.getByIndex(index, 1);
			target = targetPose.getByIndex(index, 0);

			myPlan = accelPlanner.computeWithFixedTime(currentVel, 0, target - currentPos, totalTransitTime);
			if(myPlan && myPlan.isConsistent()){
				var displacement = myPlan.displacementAtTime(advanceSeconds);
				var newVelocity = myPlan.velocityAtTime(advanceSeconds);
				filteredPose.setByIndex(index, [currentPos+displacement, newVelocity]);
			}else{
				slog(channel, "PoseOffsetFilter(dp) for "+filteredPose.getDOFNameForIndex(index)+" got invalid plan, using backup filter! (currentVel:"+currentVel+", target:"+target+", currentPos:"+currentPos+", totalTransitTime:"+totalTransitTime+")");
				//should never happen, but still need to act...  filter towards target, deccelerate a bit.
				filteredPose.setByIndex(index, [currentPos*0.99+target*0.01, currentVel*0.96]);
			}
		}
	}// else if time is less than epsilon, simply don't change anything
};

/**
 * @param {number} seconds
 */
PoseOffsetFilter.prototype.updateByTime = function(seconds){
	var transitionTime = this._timeForLongestDOF(this._targetPose, this._filteredPose, this._accelPlanner, this._accLimit, this._dofIndices);
	this._advanceFixedTimeMode(seconds, transitionTime, this._targetPose, this._filteredPose, this._accelPlanner, this._dofIndices);
};

PoseOffsetFilter.prototype.resetToTarget = function(){
	this._filteredPose.setPose(this._targetPose);
};

/**
 * @param {Pose} newCurrentPose
 */
PoseOffsetFilter.prototype.resetToPose = function(newCurrentPose){
	this._filteredPose.setPose(newCurrentPose);
	this._targetPose.setPose(newCurrentPose);
};

/**
 * @param {Pose} newTargetPose
 */
PoseOffsetFilter.prototype.setTarget = function(newTargetPose){
	this._targetPose.setPose(newTargetPose);
};

/**
 * @param {Pose} inplacePose
 */
PoseOffsetFilter.prototype.getTarget = function(inplacePose){
	inplacePose.setPose(this._targetPose);
};

/**
 * Get the current value of the filtered pose.
 * Only positions are set in inplacePose.
 *
 * @param {Pose} inplacePose
 * @param {boolean} [includePreOffsetVelocities] - true to include the current pre-offset velocities.  false or omitted to get only position.
 */
PoseOffsetFilter.prototype.getValue = function(inplacePose, includePreOffsetVelocities){
	if(includePreOffsetVelocities){
		inplacePose.setPose(this._filteredPose);
	}else {
		//inplacePose.setPose(filteredPose);
		inplacePose.setPose0Only(this._filteredPose);
	}
};

/**
 * Get the velocities of this filter, not accounting for the
 * motion due to incoming offsets (e.g., the offsets move the positions,
 * but do not affect these separately maintained velocities)
 *
 * @param {Pose} inplacePose - replace velocities in inplacePose with our pre-offset velocities
 */
PoseOffsetFilter.prototype.getPreOffsetVelocities = function(inplacePose){
	var dofIndices = this._dofIndices;
	var filteredPose = this._filteredPose;
	var index;
	for(var i = 0; i < dofIndices.length; i++){
		index = dofIndices[i];
		inplacePose.setByIndex(index, filteredPose.getByIndex(index,1), 1);
	}
};


/**
 * Set the threshold for rejecting velocities passed into applyUnfilteredOffset.
 * Velocities larger than this threshold will be clamped.
 *
 * @param {number} rejectVelocitiesGreaterThan
 */
PoseOffsetFilter.prototype.setRejectVelocityThreshold = function(rejectVelocitiesGreaterThan){
	this._rejectionVelocityThreshold = rejectVelocitiesGreaterThan;
};

/**
 * Get the threshold for rejecting velocities passed into applyUnfilteredOffset.
 * Velocities larger than this threshold will be clamped.
 *
 * @return {number}
 */
PoseOffsetFilter.prototype.getRejectVelocityThreshold = function(){
	return this._rejectionVelocityThreshold;
};

PoseOffsetFilter.prototype.setAcceleration = function(accel){
	this._accLimit = accel;
};

/**
 * Apply deltaPose as a direct addition to existing filtered pose (position only).
 * Pose is applied directly without passing through any filtering. (except max velocity)
 *
 * @param {Pose} deltaPose
 * @param {number} deltaTime - used for applying rejection velocity
 */
PoseOffsetFilter.prototype.applyUnfilteredOffset = function(deltaPose, deltaTime){
	var dofIndices = this._dofIndices;
	var applyDeltaThreshold = this._rejectionVelocityThreshold !== 0;
	var rejectionDeltaThreshold = this._rejectionVelocityThreshold * deltaTime;
	var filteredPose = this._filteredPose;
	var index;
	for(var i = 0; i < dofIndices.length; i++){
		index = dofIndices[i];
		var dVal = deltaPose.getByIndex(index, 0);
		if(applyDeltaThreshold && Math.abs(dVal) > rejectionDeltaThreshold){
			slog.error("PoseOffsetFilter:Clamping application of unfiltered offset of "+dVal+" to "+filteredPose.getDOFNameForIndex(index)+" as it is greater than "+rejectionDeltaThreshold);
			if(dVal < 0){
				dVal = -rejectionDeltaThreshold;
			}else{
				dVal = rejectionDeltaThreshold;
			}
		}
		var fVal = filteredPose.getByIndex(index, 0);
		if(fVal!==null){ //it is also in the filtered pose
			fVal += dVal;
		}
		filteredPose.setByIndex(index, fVal, 0);
	}
};


export default PoseOffsetFilter;
