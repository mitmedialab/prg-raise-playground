"use strict";

import slog from "../../ifr-core/SLog.js";
import Pose from "../base/Pose.js";
import CyclicMath from "../base/CyclicMath.js";

/**
 *
 * @param {LookatNode} lookatNode
 * @param {DOFGlobalAlignment} dofAligner
 * @param {string[]} parentDiskDOFNames
 * @constructor
 */
const DiskStabilizationTracker = function(lookatNode, dofAligner, parentDiskDOFNames){
	/** @type {boolean} */
	var initialized = false;

	/** @type {string[]} */
	var dofNamesInUse = lookatNode.getDOFs();

	/** @type {string} */
	var dofName = null;

	if(dofNamesInUse.length !== 1){
		throw new Error("DiskStablizationTracker designed for simple 1 dof disk nodes only!");
	}else{
		dofName = dofNamesInUse[0];
	}

	///** @type {Pose} */
	var deltaPoseFromLastTime = new Pose(lookatNode.getName()+" DST Delta", dofNamesInUse);

	/** @type {number} */
	var lastGlobalValue = 0;

	/**
	 *
	 * @param {Pose} currentPose
	 * @param {Pose} optimalPoseForCurrentTarget
	 * @param {THREE.Vector3} currentTarget
	 * @returns {Pose}
	 */
	this.computeStabilizationDelta = function(currentPose, optimalPoseForCurrentTarget, currentTarget){ // eslint-disable-line no-unused-vars

		//keep ourselves from drifting away to large equivalent rotations
		lastGlobalValue = CyclicMath.closestEquivalentRotation(lastGlobalValue, 0);

		var currentGlobalValue = 0;
		for(var i = 0; i < parentDiskDOFNames.length; i++){
			currentGlobalValue += currentPose.get(parentDiskDOFNames[i], 0);
		}
		currentGlobalValue = CyclicMath.closestEquivalentRotation(currentGlobalValue, lastGlobalValue);

		if(initialized){
			var delta = currentGlobalValue - lastGlobalValue;
			deltaPoseFromLastTime.set(dofName, -delta, 0);
		}else{
			deltaPoseFromLastTime.clear();
			for(var f = 0; f < dofNamesInUse.length; f++){
				deltaPoseFromLastTime.set(dofNamesInUse[f], 0, 0); //start off with zero delta
			}
		}

		lastGlobalValue = currentGlobalValue;

		initialized = true;
		return deltaPoseFromLastTime;
	};

	/**
	 * This function computes the portion of each node's velocity that is used to stabilize it against
	 * parent motion (e.g., the portion that would be produced by computeStabilizationDelta).  It then subtracts
	 * that portion off, and returns the remainder which represents the post-stabilized motion of the node.  These
	 * velocities are computed for each dof used by this node, and provided through the inplacePostStabilizationPose
	 * argument.
	 *
	 * @param {Pose} currentPose - current pose and velocities (can be same as inplacePostStabilizationPose)
	 * @param {Pose} inplacePostStabilizationPose - inplace argument to receive computed velocities (other values unchanged)
	 * @param {THREE.Vector3} target - stabilize with respect to this target
	 * @param {number} [rejectionVelocityThreshold=0] - limit the delta component (represented as raw distance over 1/50s) related to stabilization to this value (0 means no limit)
	 */
	this.decomposeVelocity = function(currentPose, inplacePostStabilizationPose, target, rejectionVelocityThreshold){

		/** @type {number} */
		var i;

		if(rejectionVelocityThreshold == null){ //null or undefined (eqnull)
			rejectionVelocityThreshold = 0;
		}

		var currentParentVelocity = 0;
		for(i = 0; i < parentDiskDOFNames.length; i++){
			currentParentVelocity += currentPose.get(parentDiskDOFNames[i], 1);
		}

		if(rejectionVelocityThreshold!==0 && Math.abs(currentParentVelocity) > rejectionVelocityThreshold){
			slog.error("Clamping DST application of unfiltered offset (Velocity) of "+currentParentVelocity+" to "+dofName+" as it is greater than "+rejectionVelocityThreshold);
			if(currentParentVelocity < 0){
				currentParentVelocity = -rejectionVelocityThreshold;
			}else{
				currentParentVelocity = rejectionVelocityThreshold;
			}
		}

		//for(i = 0; i < dofNamesInUse.length; i++){
		//	let d = dofNamesInUse[i];
		//	inplacePostStabilizationPose.set(d, currentPose.get(d, 1) - currentParentVelocity, 1);
		//}
		//only have the one dof based on limits of this stabilizer, so don't need this loop:
		inplacePostStabilizationPose.set(dofName, currentPose.get(dofName, 1) + currentParentVelocity, 1);
	};

	/**
	 * Reset between tracking sessions, so the first frame of a new track isn't treated
	 * as part of the last tracking (with a large jump).  When computeStabilizationDelta is
	 * called multiple times in a row with no intervening reset, it is assumed to be part of
	 * a single stabilization session.
	 */
	this.reset = function(){
		initialized = false;
	};
};

export default DiskStabilizationTracker;