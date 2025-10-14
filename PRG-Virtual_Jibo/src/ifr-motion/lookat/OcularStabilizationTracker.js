"use strict";

import slog from "../../ifr-core/SLog.js";
import Pose from "../base/Pose.js";
import THREE from "@jibo/three";
import LookatNode from "./LookatNode.js";

/**
 *
 * @param {LookatNode} lookatNode
 * @param {DOFGlobalAlignment} dofAligner
 * @constructor
 */
const OcularStabilizationTracker = function(lookatNode, dofAligner){
	/** @type {boolean} */
	var initialized = false;

	/** @type {THREE.Vector3} */
	var lastTargetWorldSpace = new THREE.Vector3();

	/** @type {string[]} */
	var dofNamesInUse = lookatNode.getDOFs();

	/** @type {Pose} */
	var lastOptimalPoseForLastTarget = new Pose(lookatNode.getName()+" Last Optimal", dofNamesInUse);

	/** @type {Pose} */
	var newOptimalPoseForLastTarget = new Pose(lookatNode.getName()+" Stepped Pose", dofNamesInUse);

	/** @type {Pose} */
	var deltaPoseFromLastTime = new Pose(lookatNode.getName()+" OST Delta", dofNamesInUse);

	/** @type {Pose} */
	var decompLastPoseOptimal = new Pose(lookatNode.getName()+" Temp Last Pose Optimal", dofNamesInUse);

	/** @type {Pose} */
	var decompLastPose = null; //init with correct nodes when first used.

	/**
	 *
	 * @param {Pose} currentPose
	 * @param {Pose} optimalPoseForCurrentTarget
	 * @param {THREE.Vector3} currentTarget
	 * @returns {Pose}
	 */
	this.computeStabilizationDelta = function(currentPose, optimalPoseForCurrentTarget, currentTarget){

		if(initialized){
			var reusedOptimal = false;
			var report = null;
			if(lastTargetWorldSpace.equals(currentTarget)){ //if target has not changed, optimalPoseForCurrentTarget is the same as newOptimalForLastTarget
				newOptimalPoseForLastTarget.setPose(optimalPoseForCurrentTarget);
				reusedOptimal = true;
			}else{
				report = new LookatNode.PointNodeReport();
				lookatNode.getPose(currentPose, newOptimalPoseForLastTarget, lastTargetWorldSpace, null, report, lastOptimalPoseForLastTarget);
			}
			if(reusedOptimal || report._pointSucceeded){
				if(dofAligner!=null){
					dofAligner.refineToLocallyClosestTargetPose(lastOptimalPoseForLastTarget, newOptimalPoseForLastTarget);
				}
				Pose.subtract(newOptimalPoseForLastTarget, lastOptimalPoseForLastTarget, true, deltaPoseFromLastTime);
			}else{
				//can't do anything with newOptimal; we'll report zero delta
				var dofIndicesToZero = deltaPoseFromLastTime.getDOFIndices();
				for(var r = 0; r < dofIndicesToZero.length; r++){
					deltaPoseFromLastTime.setByIndex(dofIndicesToZero[r],0,0);
				}
			}
		}else{
			deltaPoseFromLastTime.clear();
			for(var f = 0; f < dofNamesInUse.length; f++){
				deltaPoseFromLastTime.set(dofNamesInUse[f], 0, 0); //start off with zero delta
			}
		}

		lastTargetWorldSpace.copy(currentTarget);
		if(optimalPoseForCurrentTarget == null){
			//if it is not provided, we must calculate it here.
			lookatNode.getPose(currentPose, lastOptimalPoseForLastTarget, currentTarget, null, null, initialized?lastOptimalPoseForLastTarget:null);
		}else{
			lastOptimalPoseForLastTarget.setPose(optimalPoseForCurrentTarget);
		}
		initialized = true;
		return deltaPoseFromLastTime;
	};

	/**
	 * This function computes the portion of each node's velocity that is used to stabilize it against
	 * parent motion (e.g., the portion that would be produced by computeStabilizationDelta).  It then subtracts
	 * that portion off, and returns the remainder which represents the post-stabilized (~world-space) motion of the node.
	 * These velocities are computed for each dof used by this node, and provided through the inplacePostStabilizationPose
	 * argument.
	 *
	 * @param {Pose} currentPose - current pose and velocities (can be same as inplacePostStabilizationPose)
	 * @param {Pose} inplacePostStabilizationPose - inplace argument to receive computed velocities (other values unchanged)
	 * @param {THREE.Vector3} target - stabilize with respect to this target
	 * @param {number} [rejectionVelocityThreshold=0] - limit the velocity component related to stabilization to this value (0 means no limit)
	 */
	this.decomposeVelocity = function(currentPose, inplacePostStabilizationPose, target, rejectionVelocityThreshold){

		if(rejectionVelocityThreshold == null){ //null or undefined (eqnull)
			rejectionVelocityThreshold = 0;
		}

		if(decompLastPose === null){
			decompLastPose = new Pose(lookatNode.getName()+" Decomp Last Pose");
		}

		Pose.advanceByTime(currentPose, true, decompLastPose, -1/50.0);

		lookatNode.getPose(currentPose, newOptimalPoseForLastTarget, target, null, null, null);
		lookatNode.getPose(decompLastPose, decompLastPoseOptimal, target, null, null, newOptimalPoseForLastTarget);

		if(dofAligner!=null){
			dofAligner.refineToLocallyClosestTargetPose(decompLastPoseOptimal, newOptimalPoseForLastTarget);
		}

		Pose.subtract(newOptimalPoseForLastTarget, decompLastPoseOptimal, true, deltaPoseFromLastTime);

		var dofIndices = deltaPoseFromLastTime.getDOFIndices();
		for(var i = 0; i < dofIndices.length; i++){
			var index = dofIndices[i];
			var originalVelocity = currentPose.getByIndex(index,1);
			var deltaComponent = deltaPoseFromLastTime.getByIndex(index, 0);

			var stabilizationVelocity = deltaComponent * 50;

			if(rejectionVelocityThreshold!==0 && Math.abs(stabilizationVelocity) > rejectionVelocityThreshold){
				slog.error("Clamping OST application of stabilization velocity of "+stabilizationVelocity+" to "+deltaPoseFromLastTime.getDOFNameForIndex(index)+" as it is greater than "+rejectionVelocityThreshold);
				if(stabilizationVelocity < 0){
					stabilizationVelocity = -rejectionVelocityThreshold;
				}else{
					stabilizationVelocity = rejectionVelocityThreshold;
				}
			}

			inplacePostStabilizationPose.setByIndex(index, originalVelocity-stabilizationVelocity, 1);
		}
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

export default OcularStabilizationTracker;