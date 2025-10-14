"use strict";

import PointADOF from "./PointADOF.js";
import Pose from "../base/Pose.js";
import slog from "../../ifr-core/SLog.js";

const channel = "LOOKAT";

const PointNodeReport = function(){
	/**
	 * 0 for unstable target, 1 for very stable
	 * @type {?number} */
	this._targetStability = null;
	this._pointSucceeded = true;
};


/**
 *
 * @param {string} name
 * @param {LookatDOF[]} lookatDOFs - assumed to be in order root to leaf
 * @param {KinematicGroup} myKinematicGroup
 * @constructor
 */
const LookatNode = function(name, lookatDOFs){
	/** @type {string} */
	this._name = name;
	/** @type {LookatDOF[]} */
	this._lookatDOFs = lookatDOFs;
	/** @type {KinematicGroup} */
	this._kinematicGroup = null;

	/** @type {Pose} */
	this._lastPose = new Pose(name+"'s last pose", this.getDOFs());
};

LookatNode.PointNodeReport = PointNodeReport;

/**
 * @param {KinematicGroup} kinematicGroup
 */
LookatNode.prototype.connectToGroup = function(kinematicGroup){
	this._kinematicGroup = kinematicGroup;

	for(var i = 0; i < this._lookatDOFs.length; i++){
		this._lookatDOFs[i].connectToGroup(this._kinematicGroup);
	}
};

/**
 *
 * @param {PointReport} newDOFReport
 * @param {PointNodeReport} nodeReportInplace
 */
function updateReport(newDOFReport, nodeReportInplace, pointSucceeded){
	var angleValue = newDOFReport._angleToAxis / (Math.PI/2);
	var distanceValue = Math.min(newDOFReport._distanceToTarget * 5, 1); //1 for >20cm, linear score down to 0 from there.
	if(nodeReportInplace._targetStability === null){
		nodeReportInplace._targetStability = angleValue * distanceValue;
	}else{
		nodeReportInplace._targetStability *= (angleValue * distanceValue);
	}
	if(!pointSucceeded){
		nodeReportInplace._pointSucceeded = false;
	}
	//if(nodeReportInplace._targetStability > 1.001){
	//	console.log("stability = "+nodeReportInplace._targetStability+", "+newDOFReport._angleToAxis+", "+newDOFReport._distanceToTarget);
	//}
}

/**
 *
 * @param {Pose} currentPose
 * @param {Pose} inplaceOutput
 * @param {THREE.Vector3} target
 * @param {Pose} [defaultPose] - use this pose's values in place of values that cannot be currently computed. (currentPose used if ommitted)
 * @param {PointNodeReport} [pointNodeReport] - inplace arg to return metadata about combined computation
 * @param {Pose} [lastProduced] - the pose we last produced (used for consistency if this node must choose from multiple options.  null if this is a new track.  ok to be same as inplaceOutput)
 * @return {boolean} true if all nodes computed a value; false if one or more was uncomputable and had to utilize defaultPose.
 */
LookatNode.prototype.getPose = function(currentPose, inplaceOutput, target, defaultPose, pointNodeReport, lastProduced){ // eslint-disable-line no-unused-vars
	if(inplaceOutput!==currentPose) { //no need if they are the same instance..
		inplaceOutput.setPose(currentPose);
	}

	if(defaultPose == null){ //null or undefined (eqnull)
		defaultPose = currentPose;
	}

	var anyFailures = false;

	this._kinematicGroup.setFromPose(currentPose);
	//this._kinematicGroup.getRoot().updateMatrixWorld(true);
	this._kinematicGroup.updateWorldCoordinateFrames();

	var pointDOFReport = null;

	for(var i = 0; i < this._lookatDOFs.length; i++){
		if(pointNodeReport){
			pointDOFReport = new PointADOF.PointReport();
		}

		var value = this._lookatDOFs[i].valToPointAtTarget(target, pointDOFReport, currentPose);

		if(pointDOFReport){
			updateReport(pointDOFReport, pointNodeReport, value != null);
			//if(pointDOFReport.solution1!=undefined){
			//	pointNodeReport.solution1 = pointDOFReport.solution1;
			//	pointNodeReport.solution2 = pointDOFReport.solution2;
			//}
		}

		if(value != null){
			inplaceOutput.set(this._lookatDOFs[i].getControlledDOFName(), value, 0);
		}else{
			slog(channel, "LookatNode "+this._name+" using last value due to uncomputable value for target ("+target.x+", "+target.y+", "+target.z+")");
			inplaceOutput.set(this._lookatDOFs[i].getControlledDOFName(), defaultPose.get(this._lookatDOFs[i].getControlledDOFName(),0),0);
			anyFailures = true;
		}
		if(i < this._lookatDOFs.length-1){ //more updating to do
			this._kinematicGroup.setFromPose(inplaceOutput);
			//this._kinematicGroup.getRoot().updateMatrixWorld(true);
			this._kinematicGroup.updateWorldCoordinateFrames();
		}
	}

	this._lastPose.setPose(inplaceOutput);

	return !anyFailures;
};


/**
 * The output of a node may have each individual dof pointing differently from its own forward for
 * a collective goal; provide the individual forwards here from the last getPose computation.
 * (useful in some cases to restore configuration to same perceived orientation but with less dofs)
 *
 * Override both this and valsAreIndividuallyForward together.  A DOF will be cleared out if data
 * is unavailable
 *
 * @param {Pose} inplacePose
 */
LookatNode.prototype.getIndividuallyForwardPose = function(inplacePose){
	//by default, assume all dofs are individually forward in normal operation
	inplacePose.setPose0Only(this._lastPose);
};


/**
 * See getIndividuallyForwardPose.  This function returns true if the individual forwards
 * are the same as what is provided with getPose().  Override both this and getIndividuallyForwardPose
 * together.
 *
 * @returns {boolean} true if the usual values (getPose()) indicate optimal forward indivdually
 */
LookatNode.prototype.valsAreIndividuallyForward = function(){
	//by default, assume all dofs are individually forward in normal operation
	return true;
};



/**
 * Get all the dofs that are modified by this node
 * @return {string[]}
 */
LookatNode.prototype.getDOFs = function(){
	var allDOFs = [];
	for(var i = 0; i < this._lookatDOFs.length; i++){
		allDOFs.push(this._lookatDOFs[i].getControlledDOFName());
	}
	return allDOFs;
};

/**
 * Get all the dofs that are needed in the provided kinematic group
 * (may include dofs that will not be modified by this node)
 * @return {string[]}
 */
LookatNode.prototype.getDOFsNeededInKG = function(){
	return this.getDOFs();
};


/**
 * Find the distance between 2 poses, only accounting for DOFs that are part of this LookatNode.
 * The difference is calculated as a ratio (of error over dof range) rather than absolute value.
 * This function is designed to give a metric lookat progress, e.g., pass in optimal and
 * filtered/current to see how far the lookat still has to go.
 *
 * @param {Pose} pose1
 * @param {Pose} pose2
 * @return {number} greatest ratio (distance/totalDistance) of any of our lookat DOFs between pose1 to pose2
 */
LookatNode.prototype.distanceAsRatio = function(pose1, pose2){
	var maxRatio = 0;
	for(var i = 0; i < this._lookatDOFs.length; i++) {
		var lookatDOF = this._lookatDOFs[i];
		var dofName = lookatDOF.getControlledDOFName();
		var p1v = pose1.get(dofName, 0);
		var p2v = pose2.get(dofName, 0);
		var ratio = lookatDOF.errorRatio(p1v-p2v);
		if(ratio > maxRatio){
			maxRatio = ratio;
		}
	}
	return maxRatio;
};

/**
 * @returns {string}
 */
LookatNode.prototype.getName = function(){
	return this._name;
};

/**
 *
 * @param {Pose} currentPose - use this current pose
 * @param {THREE.Vector3} inplaceVec
 * @return {THREE.Vector3} a suggestion for a target that is forward for this lookat (node is already looking at this point)
 */
LookatNode.prototype.suggestForwardTarget = function(currentPose, inplaceVec){
	this._kinematicGroup.setFromPose(currentPose);
	//this._kinematicGroup.getRoot().updateMatrixWorld(true);
	this._kinematicGroup.updateWorldCoordinateFrames();
	return this._lookatDOFs[0].suggestForwardTarget(inplaceVec);
};



export default LookatNode;