"use strict";

import slog from "../../ifr-core/SLog.js";
import Pose from "../base/Pose.js";
import PoseOffsetFilter from "./PoseOffsetFilter.js";

const channel = "LOOKAT";

/**
 * Enum Values for windup state.
 *
 * Windup state broken into 4 parts
 *  - Accel from initial position away from target (gaining "away" velocity and position) (WINDING_ACCEL)
 *  - Accel towards target, zeroing out our "away" velocity, still gaining "away" position (WINDING_DECEL)
 *  - Accel towards target, gaining "towards" velocity and reducing our "away" position (WINDING_RESTORING)
 *  - Once our "away" position is zero'd, we're back at initial position, clear of windup and in the NONE state
 *
 *  If accel used during initial windup (WINDING_ACCEL period) were equal to accel used afterwards heading to target,
 *  these would all be exact.  However the eventual accel may be different, as it is constantly re-planned
 *  and can change (especially if target changes).  Thus these stages are only approximate, but should be usable
 *  for rough scheduling.
 *
 * @enum {number}
 */
const WindupState = {
	/**
	 * We are in a windup-free trajectory, or a trajectory with windup after the effects have been
	 * applied (e.g., we have already wound up and come back to the right side of the initial position)
	 */
	NONE:4,
	/**
	 * We are accelerating away from the target (Windup up)
	 */
	WINDING_ACCEL:1,
	/**
	 * We are accelerating toward the target, but have not yet cancelled the velocity
	 * added by our acceleration away from the target (moving away from target and initial position)
	 */
	WINDING_DECEL:2,
	/**
	 * We are accelerating towards the target and moving towards the target
	 * (after having cancelled our velocity added during windup), but have not yet
	 * cancelled the positional error accrued (have not yet gotten back to initial position after
	 * our windup period)
	 */
	WINDING_RESTORING:3
};

/**
 *
 * @param {string[]} dofNames
 * @constructor
 * @extends PoseOffsetFilter
 */
const PoseOffsetFilterWindup = function(dofNames) {
	PoseOffsetFilter.call(this, dofNames);

	/**
	 * @type {boolean}
	 */
	this._shouldStartWindup = false;

	/**
	 * @type {number}
	 */
	this._windupTimeRemaining = 0;

	/**
	 * Used for reporting windup state; calculated to be the time from windup start until we're back to zero velocity
	 * This will be 2x initial _windupTimeRemaining, as once we start towards target, it will take approximately the same time
	 * to get back to zero V as we spent accelerating away (approximate because the accel may be slightly different
	 * when we make our new plan, but it should be very close)
	 *
	 * @type {number}
	 * @private
	 */
	this._windupTimeToZeroVRemaining = 0;

	/**
	 * Used for reporting windup state; calculated to be the time from windup start until we're back to the initial
	 * starting position.  This will be sqrt(2) * "initial _windupTimeRemaining" + _windupTimeToZeroVRemaining:
	 * k = initial _windupTimeRemaining
	 * Distance_During_k = a * (k^2) / 2
	 * TotalBackwardsDistance = a * (k^2)
	 * Solve for return time r:  a * (k^2) = a * (r^2) / 2
	 * r = sqrt(2)*k //and add _windupTimeToZeroVRemaining since we want "out time" + "return time"
	 *
	 * @type {number}
	 * @private
	 */
	this._windupTimeToZeroPRemaining = 0;

	/**
	 * This pose will actually hold the accelerations to be used in the current windup (in the 0th slot)
	 * Windup will consist of accelerating at these accelerations for windupTimeRemaining
	 * @type {Pose}
	 * @private
	 */
	this._windupAccel = new Pose("windup accel", dofNames);

	/**
	 * This pose will actually hold the distances to be used in the current target overshoot (in the 0th slot)
	 * Every tick, these values will be added to the actual target until we invalidate the windup by
	 * passing the real target.
	 * @type {Pose}
	 * @private
	 */
	this._targetOvershootDelta = new Pose("target overshoot delta", dofNames);

	/**
	 * Temp pose to hold target+overshoot
	 * @type {Pose}
	 * @private
	 */
	this._overshootModifiedTarget = new Pose("target for overshoot", dofNames);

	/**
	 * @type {boolean}
	 * @private
	 */
	this._weAreOvershooting = false;

	//config params: see WindupOvershootParams typedef for descriptions
	/**
	 * @type {number}
	 * @private
	 */

	this._maxAllowedTriggerSpeed = 0.005;
	this._minAllowedTriggerDistance = 0.01;
	this._maxAllowedTriggerDistance = Infinity;

	/**
	 * @type {number}
	 * @private
	 */
	this._windupDistanceRatio = 0.05;
	this._windupMaxDistance = 0.002;
	this._windupMinDistance = 0.001;

	/**
	 * @type {number}
	 * @private
	 */
	this._overshootDistanceRatio = 0.05;
	this._overshootMaxDistance = 0.002;
	this._overshootMinDistance = 0.001;


};

PoseOffsetFilterWindup.prototype = Object.create(PoseOffsetFilter.prototype);
PoseOffsetFilterWindup.prototype.constructor = PoseOffsetFilterWindup;

PoseOffsetFilterWindup.WindupState  = WindupState;

/**
 * Params to setup windup/overshoot.
 * @typedef {Object} WindupOvershootParams
 *
 * @property {?number} maxAllowedTriggerSpeed - maximum speed (for any particular dof) allowable for starting a new windup/overshoot trajectory
 * @property {?number} minAllowedTriggerDistance - minimum current-to-target distance allowable for starting a new windup/overshoot trajectory
 * @property {?number} maxAllowedTriggerDistance - maximum current-to-target distance allowable for starting a new windup/overshoot trajectory
 *
 * @property {?number} windupDistanceRatio - fraction of current-to-target distance which defines the windup distance
 * @property {?number} windupMinDistance - clamp windup distance to this minimum (windups will be no smaller)
 * @property {?number} windupMaxDistance - clamp windup distance to this maximum (windups will be no larger)
 *
 * @property {?number} overshootDistanceRatio - fraction of current-to-target distance which defines the overshoot distance
 * @property {?number} overshootMinDistance - clamp overshoot distance to this minimum (overshoots will be no smaller)
 * @property {?number} overshootMaxDistance - clamp overshoot distance to this maximum (overshoot will be no larger)
 * @intdocs
 */


/**
 * @param {WindupOvershootParams} params
 */
PoseOffsetFilterWindup.prototype.configure = function(params){
	if(this._windupTimeRemaining > 0 || this._weAreOvershooting){
		slog(channel, "PoseOffsetFilterWindup: cancelling running windup/overshoot because we are being reconfigured during execution");
		this._windupTimeRemaining = 0;
		this._windupTimeToZeroPRemaining = 0;
		this._windupTimeToZeroVRemaining = 0;
		this._weAreOvershooting = false;
	}

	if(params.maxAllowedTriggerSpeed != null){ //null or undefined (eqnull)
		this._maxAllowedTriggerSpeed = params.maxAllowedTriggerSpeed;
	}
	if(params.minAllowedTriggerDistance != null){
		this._minAllowedTriggerDistance = params.minAllowedTriggerDistance;
	}
	if(params.maxAllowedTriggerDistance != null){
		this._maxAllowedTriggerDistance = params.maxAllowedTriggerDistance;
	}
	if(params.windupDistanceRatio != null){
		this._windupDistanceRatio = params.windupDistanceRatio;
	}
	if(params.windupMinDistance != null){
		this._windupMinDistance = params.windupMinDistance;
	}
	if(params.windupMaxDistance != null){
		this._windupMaxDistance = params.windupMaxDistance;
	}
	if(params.overshootDistanceRatio != null){
		this._overshootDistanceRatio = params.overshootDistanceRatio;
	}
	if(params.overshootMinDistance != null){
		this._overshootMinDistance = params.overshootMinDistance;
	}
	if(params.overshootMaxDistance != null){
		this._overshootMaxDistance = params.overshootMaxDistance;
	}
};


/**
 * Indicate that a windup trajectory should be started right now if possible.
 * It will either be started next update or not at all; it will only start if the status criteria
 * are met. (see checkTrajectoryStartCriteria)
 */
PoseOffsetFilterWindup.prototype.startWindupIfPossible = function(){
	if(this._windupDistanceRatio !== 0 || this._overshootDistanceRatio !== 0){
		//enable only if we have any windup/overshoot configured
		this._shouldStartWindup = true;
	}
};

/**
 * Check to see if it is a valid time to start a windup/overshoot trajectory, based on distance
 * to target and current speed.
 *
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {number[]} dofIndices
 * @param {number} maxAllowedTriggerSpeed
 * @param {number} minAllowedTriggerDistance
 * @param {number} maxAllowedTriggerDistance
 * @return {boolean} - true if it is an acceptible time to start a new trajectory
 */
const checkTrajectoryStartCriteria = function(targetPose, filteredPose, dofIndices,
											maxAllowedTriggerSpeed, minAllowedTriggerDistance, maxAllowedTriggerDistance){
	var maxDOFVelocity = 0;
	var maxDOFDistance = 0;

	//get current velocity and distance to target
	for(var i = 0; i < dofIndices.length; i++) {
		var index = dofIndices[i];
		var currentVelAbs = Math.abs(filteredPose.getByIndex(index, 1));
		var dofDistance = Math.abs(filteredPose.getByIndex(index, 0) - targetPose.getByIndex(index,0));

		if(currentVelAbs > maxDOFVelocity){
			maxDOFVelocity = currentVelAbs;
		}
		if(dofDistance > maxDOFDistance) {
			maxDOFDistance = dofDistance;
		}
	}

	return (maxDOFVelocity <= maxAllowedTriggerSpeed &&
			maxDOFDistance >= minAllowedTriggerDistance && maxDOFDistance <= maxAllowedTriggerDistance);
};

/**
 * Given the windupAccelerations, compute how long we should accelerate to achieve a windup of the correct
 * distance
 *
 * @param {Pose} windupAccelerations - the accelerations to use during the windup
 * @param {number} totalDistance - the total distance to target (used to compute windup amount)
 * @param {number} windupDistanceRatio - this fraction of total distance is how much ground our windup should cover
 * @param {number} windupMinDistance - clamp any windup to this minimum
 * @param {number} windupMaxDistance - clamp any windup to this maximum
 * @param {number[]} dofIndices - dof indices for easier iterating
 * @returns {number} time to accelerate away from target to achieve windup
 */
const computeWindupTime = function(windupAccelerations, totalDistance, windupDistanceRatio, windupMinDistance, windupMaxDistance, dofIndices){
	/** @type {number} */
	var index;
	/** @type {number} */
	var i;

	var totalAccel = 0;

	for(i = 0; i < dofIndices.length; i++) {
		index = dofIndices[i];
		var thisDOFAccel = windupAccelerations.getByIndex(index, 0);
		totalAccel += Math.pow(thisDOFAccel, 2);
	}

	totalAccel = Math.sqrt(totalAccel);

	var desiredDistance = totalDistance * windupDistanceRatio;
	desiredDistance = Math.max(windupMinDistance, Math.min(windupMaxDistance, desiredDistance));

	//compute how long we need to travel at totalAccel to move 1/2 desiredDistance (1/2 to account for deccel period)
	//desiredDistance/2 = (initialVelocity * time + (acceleration * time^2) / 2);
	//let's use initialVelocity of zero
	//2 * desiredDistance / 2 / acceleration = time^2

	var windupTime = Math.sqrt(desiredDistance/totalAccel);

	return windupTime;
};


/**
 * Compute the distance to target (treating the dofs as orthogonal axes).  Also compute
 * the distance for each dof seperately, and store in inplaceDOFDistances
 *
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {Pose} inplacePerDOFDistances - store the per-dof differences here
 * @param {number[]} dofIndices
 * @param {number} epsilon
 * @return {number} the distance (straight line assuming nd space)
 */
const computeTotalDistanceToTarget = function(targetPose, filteredPose, inplacePerDOFDistances, dofIndices, epsilon){
	/** @type {number} */
	var totalDistance = 0;

	for(var i = 0; i < dofIndices.length; i++){
		var index = dofIndices[i];

		var currentPos = filteredPose.getByIndex(index, 0);
		var target = targetPose.getByIndex(index, 0);

		var delta = target - currentPos;

		if(Math.abs(delta) < epsilon){
			delta = 0;
		}

		//compute overshoot delta
		//these will be later scaled to account for desired distance
		inplacePerDOFDistances.setByIndex(index, delta, 0);
		if(delta !== 0){
			totalDistance += Math.pow(delta,2);
		}
	}

	return Math.sqrt(totalDistance);
};

/**
 * Computed the accelerations to be used by each dof during windup, proportioned to go in the correct 2d direction.
 *
 * @param {number} totalTransitTime - time for the total transition if it was performed normally (used to find our accelerations)
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {AccelPlanner} accelPlanner
 * @param {Pose} inplaceWindupAccelerations - store the per-dof accelerations used by the normal trajectory here to use for windup
 * @param {number[]} dofIndices
 * @param {number} epsilon
 */
const computeWindupAccelerations = function(totalTransitTime,
											targetPose, filteredPose, accelPlanner,
											inplaceWindupAccelerations, dofIndices, epsilon){
	/** @type {number} */
	var index;
	/** @type {number} */
	var i;

	//compute accel for all dofs, we'll lock this in for the whole windup period
	//
	//we'll use the acceleration each dof would have if we were to perform a normal transition to the target
	//the intention is
	//	a) use similar accel they will use once they regular transition kicks in
	//		(this is not exact, since they will start from a new situation after the windup, but close)
	//	b) use accelerations proportional to their motions
	// 		This is to get 2d direction of motion is inline with the eventual path (instead of always 45°!)
	//	c) vales are signed, so each dof winds up in the correct direction

	for(i = 0; i < dofIndices.length; i++){
		index = dofIndices[i];

		//in this loop, we will set up the windup accelerations
		//they will be zero for all dofs if our total plan time is insufficient
		// (we should not be called in this case however)
		if(totalTransitTime > epsilon) {
			var currentPos = filteredPose.getByIndex(index, 0);
			var currentVel = filteredPose.getByIndex(index, 1);
			var target = targetPose.getByIndex(index, 0);

			var myPlan = accelPlanner.computeWithFixedTime(currentVel, 0, target - currentPos, totalTransitTime);
			if(myPlan && myPlan.isConsistent()){
				//we're reaching into the plan here; what we want is the initial acceleration of the plan
				var myInitialAccel = myPlan._acceleration;
				inplaceWindupAccelerations.setByIndex(index, -myInitialAccel, 0);

			}else{
				slog(channel, "PoseOffsetFilter(cwa) for "+filteredPose.getDOFNameForIndex(index)+" got invalid plan, dof will have no windup! (currentVel:"+currentVel+", target:"+target+", currentPos:"+currentPos+", totalTransitTime:"+totalTransitTime+")");
				//should never happen, but still need to act...  skip windup on this dof.
				inplaceWindupAccelerations.setByIndex(index, 0, 0);
			}
		}else{
			//we won't try to compute a near zero length path; we'll do no windup
			inplaceWindupAccelerations.setByIndex(index, 0, 0);
		}
	}
};

/**
 * This function takes the per-dof delta to target (in inplaceOvershootDeltas) and scales them down
 * to an appropriate delta to apply as a target overshoot, based on the totalDistanceToTarget,
 * the overshootDistanceRation, and the various limits.
 *
 * @param {Pose} inplaceOvershootDeltas - should start as the delta from current to target for each dof.  will end as the overshoot offset per dof.
 * @param {number} totalDistanceToTarget - total distance from current to target
 * @param {number[]} dofIndices
 * @param {number} overshootDistanceRatio - this fraction of total distance is how much ground our overshoot should cover
 * @param {number} overshootMinDistance - clamp overshoot to this max distance
 * @param {number} overshootMaxDistance - clamp overshoot to this min distance
 * @param {number} epsilon
 */
const scaleOvershootDelta = function(inplaceOvershootDeltas, totalDistanceToTarget,
									dofIndices,
									overshootDistanceRatio,
									overshootMinDistance, overshootMaxDistance,
									epsilon){

	/** @type {number} */
	var index;
	/** @type {number} */
	var i;

	//rescale the windup overshoot so total distance is correct
	//we should scale the total overshoot magnitude to be within min/max (per-dof scaling ruins angle)
	if(totalDistanceToTarget > epsilon && overshootDistanceRatio !== 0){  //if total overshoot is trivial or zero, don't scale

		var overshootScale = overshootDistanceRatio;
		if(totalDistanceToTarget * overshootScale < overshootMinDistance){
			overshootScale = 1/totalDistanceToTarget * overshootMinDistance;
		}else if(totalDistanceToTarget * overshootScale > overshootMaxDistance){
			overshootScale = 1/totalDistanceToTarget * overshootMaxDistance;
		}
		for (i = 0; i < dofIndices.length; i++) {
			index = dofIndices[i];
			inplaceOvershootDeltas.setByIndex(index, inplaceOvershootDeltas.getByIndex(index, 0) * overshootScale, 0);
		}
	}else{
		//distance is zero or close; zero out overshoot for good measure
		for (i = 0; i < dofIndices.length; i++) {
			index = dofIndices[i];
			inplaceOvershootDeltas.setByIndex(index, 0, 0);
		}
	}
};



/**
 * @param {number} advanceSeconds - advance by this many seconds
 * @param {number} totalTransitTime - target this time as the total transit time
 * @param {Pose} targetPose
 * @param {Pose} filteredPose
 * @param {AccelPlanner} accelPlanner
 * @param {Pose} windupAccel
 *
 * @protected
 */
PoseOffsetFilterWindup.prototype._advanceFixedTimeModeWindup = function(advanceSeconds, totalTransitTime, targetPose, filteredPose, accelPlanner, windupAccel, dofIndices){

	/** @type {number} */
	var index;
	/** @type {number} */
	var i = 0;
	/** @type {number} */
	var currentPos = 0;

	if(this._windupTimeToZeroPRemaining > 0){ //P will be greater than V, so this will be sufficient to make sure get both to zero
		this._windupTimeToZeroVRemaining = Math.max(0, this._windupTimeToZeroVRemaining - advanceSeconds);
		this._windupTimeToZeroPRemaining = Math.max(0, this._windupTimeToZeroPRemaining - advanceSeconds);
	}

	//if we are winding up, keep winding, otherwise go to target as usual
	if(this._windupTimeRemaining > 0){
		//console.log("Doing windups, windup remaining time:"+this._windupTimeRemaining+" total time"+totalTransitTime);
		var doWindupTimeNow = Math.min(advanceSeconds, this._windupTimeRemaining);
		this._windupTimeRemaining = Math.max(0, this._windupTimeRemaining - advanceSeconds); //will eventually be === 0 despite any fp error
		advanceSeconds -= doWindupTimeNow; //could end up negative from fp error, but ok, only used to check if greater than epsilon
		//console.log("\tTime remaining this update for regular path:"+advanceSeconds);

		//update filtered pose with wound up position
		for(i = 0; i < dofIndices.length; i++){
			index = dofIndices[i];
			currentPos = filteredPose.getByIndex(index, 0);
			var currentVel = filteredPose.getByIndex(index, 1);
			var useAccel = windupAccel.getByIndex(index, 0);

			var myPlan = accelPlanner.createPlanWithFixedAccelForever(currentVel, useAccel);
			var windupDisplacement = myPlan.displacementAtTime(doWindupTimeNow);
			var windupNewVelocity = myPlan.velocityAtTime(doWindupTimeNow);

			filteredPose.setByIndex(index, [currentPos+windupDisplacement, windupNewVelocity]);
		}
	}

	if(advanceSeconds > this._epsilon){
		this._advanceFixedTimeMode(advanceSeconds, totalTransitTime, targetPose, filteredPose, accelPlanner, dofIndices);
	}
};

/**
 * Get the current windup state. See WindupState
 * @returns {WindupState}
 */
PoseOffsetFilterWindup.prototype.getWindupState = function(){
	if(this._windupTimeToZeroPRemaining > 0) {
		if (this._windupTimeRemaining > 0) {
			return WindupState.WINDING_ACCEL;
		} else if (this._windupTimeToZeroVRemaining > 0) {
			return WindupState.WINDING_DECEL;
		} else { //if (this._windupTimeToZeroPRemaining > 0) {
			return WindupState.WINDING_RESTORING;
		}
	}else{
		return WindupState.NONE;
	}
};

/**
 * @param {number} seconds
 * @override
 */
PoseOffsetFilterWindup.prototype.updateByTime = function(seconds){

	var dofIndices = this._dofIndices;
	var dofIndicesLength = this._dofIndices.length;
	var index;

	/**
	 * useTarget will either be the normal target, or an overshoot target computed from normal target modified
	 * and the overshootDelta
	 *
	 * @type {Pose}
	 */
	var useTarget = this._targetPose;

	if(this._shouldStartWindup && (this._weAreOvershooting || this._windupTimeRemaining > 0)){
		//we are asked to start a new windup/overshoot trajectory.
		//this will either be ignore (if we are moving too fast) or cause an actual windup/overshoot.
		//For now, we cancel any existing windup/overshoot state, although in some cases the old
		//windup/overshoot and new windup/overshoot could be integrated where they would overlap.
		this._weAreOvershooting = false;
		this._windupTimeRemaining = 0; //cancel the existing windup if asked for a new trajectory when currently winding
		this._windupTimeToZeroVRemaining = 0;
		this._windupTimeToZeroPRemaining = 0;
		slog(channel, "PoseOffsetFilterWindup: cancelling existing windup/overshoot plan, asked for a new one during execution");
	}

	if(this._weAreOvershooting){
		//modify our target if we are overshooting!
		var anyOvershootStillValid = false;
		//overshootModifiedTarget.setPose(targetPose);
		for(var i = 0; i < dofIndicesLength; i++){
			index = dofIndices[i];
			var overshootDelta = this._targetOvershootDelta.getByIndex(index,0);
			var unmodifiedTarget = this._targetPose.getByIndex(index,0);
			var currentPos = this._filteredPose.getByIndex(index, 0);
			var deltaToTarget = unmodifiedTarget - currentPos;
			if((deltaToTarget > 0 && overshootDelta > 0) || (deltaToTarget < 0 && overshootDelta < 0)){
				//same sign, still target an overshoot
				anyOvershootStillValid = true;
				this._overshootModifiedTarget.setByIndex(index, unmodifiedTarget + overshootDelta, 0);
			}else{
				this._overshootModifiedTarget.setByIndex(index, unmodifiedTarget, 0);
			}
		}
		if(!anyOvershootStillValid){
			this._weAreOvershooting = false;
			//console.log("dropping overshoot offset target now as we are past the target");
		}else{
			useTarget = this._overshootModifiedTarget;
		}
	}

	var transitionTime = this._timeForLongestDOF(useTarget, this._filteredPose, this._accelPlanner, this._accLimit, dofIndices);

	if(this._shouldStartWindup){
		//we will start now or not, based on current position/velocity and position-target relationship
		//whether we fire or not, we're cancelling the should-start, not delaying it for later.

		//times/distances used to define windup/overshoot magnitude are based on the "natural" current->target times,
		//as computed above, since overshoot will have been cancelled for this last planning session.

		//if we do trigger a windup/overshoot, for the first tick the above plans do not include overshoot target as
		//they should but that is not a concern because the difference in target position will not make much or any
		//difference on the first update

		this._shouldStartWindup = false;

		var okToStart = checkTrajectoryStartCriteria(this._targetPose, this._filteredPose, dofIndices,
			this._maxAllowedTriggerSpeed, this._minAllowedTriggerDistance, this._maxAllowedTriggerDistance);

		if(okToStart){
			var totalDistance = computeTotalDistanceToTarget(this._targetPose, this._filteredPose, this._targetOvershootDelta, dofIndices, this._epsilon);

			if(this._overshootDistanceRatio > 0) {
				scaleOvershootDelta(this._targetOvershootDelta, totalDistance, dofIndices,
					this._overshootDistanceRatio, this._overshootMinDistance, this._overshootMaxDistance, this._epsilon);
				this._weAreOvershooting = true;
			}

			if(this._windupDistanceRatio !== 0) {
				computeWindupAccelerations(transitionTime,
					this._targetPose, this._filteredPose, this._accelPlanner,
					this._windupAccel, dofIndices, this._epsilon);

				this._windupTimeRemaining = computeWindupTime(this._windupAccel, totalDistance,
					this._windupDistanceRatio, this._windupMinDistance, this._windupMaxDistance,
					dofIndices);
				this._windupTimeToZeroVRemaining = this._windupTimeRemaining * 2;
				this._windupTimeToZeroPRemaining = this._windupTimeRemaining * Math.sqrt(2) + this._windupTimeToZeroVRemaining;
			}

		}else{
			//console.log("rejecting start of windup trajectory");
			this._weAreOvershooting = false;
			this._windupTimeRemaining = 0;
			this._windupTimeToZeroVRemaining = 0;
			this._windupTimeToZeroPRemaining = 0;
		}
	}

	this._advanceFixedTimeModeWindup(seconds, transitionTime, useTarget, this._filteredPose, this._accelPlanner, this._windupAccel, dofIndices);
};



export default PoseOffsetFilterWindup;
