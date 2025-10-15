"use strict";

import LookatNode from "./LookatNode.js";
import Pose from "../base/Pose.js";
import slog from "../../ifr-core/SLog.js";

const channel = "LOOKAT";

//TODO: possibly consolidate with LookatNode
//Simplifications made assuming node will not be stabilized; need to implement suggestForwardTarget
// and update pointNodeReport if this changes

/**
 *
 * @param {string} name
 * @param {PlaneAlignmentWithRollLookatDOF} planeAlignmentDOF
 * @param {LookatDOF} rotationalDOF
 * @constructor
 */
class PlaneAlignmentWithRollLookatNode extends LookatNode {
	constructor(name, planeAlignmentDOF, rotationalDOF) {
		super(name, []);

		/**
		 * @type {PlaneAlignmentWithRollLookatDOF}
		 * @private
		 */
		this._planeAlignmentDOF = planeAlignmentDOF;

		/**
		 * @type {LookatDOF}
		 * @private
		 */
		this._rotationalDOF = rotationalDOF;

		/**
		 * @type {Array.<string>}
		 * @private
		 */
		this._planeAlignmentDOFNames = this._planeAlignmentDOF.getControlledDOFNames();

		/**
		 * @type {string}
		 * @private
		 */
		this._rotationalDOFName = this._rotationalDOF.getControlledDOFName();

		/**
		 * @type {Array.<string>}
		 * @private
		 */
		this._dofs = this._planeAlignmentDOFNames.slice();

		if(this._dofs.indexOf(this._rotationalDOFName)===-1){
			this._dofs.push(this._rotationalDOFName);
		}

		/**
		 * @type {Array.<string>}
		 * @private
		 */
		this._dofsNeededInKG = this._planeAlignmentDOF.getDOFsNeededInKG().slice();

		if(this._dofsNeededInKG.indexOf(this._rotationalDOFName)===-1){
			this._dofsNeededInKG.push(this._rotationalDOFName);
		}

		//need to redo this from superclass constructor because list of dofs isn't available there
		this._lastPose = new Pose(name+"'s last pose", this.getDOFs());

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._rotationalDOFLastValue = null;
	}


	/**
	 *
	 * @param {KinematicGroup} kinematicGroup
	 * @override
	 */
	connectToGroup(kinematicGroup){
		super.connectToGroup(kinematicGroup);

		this._planeAlignmentDOF.connectToGroup(kinematicGroup);
		this._rotationalDOF.connectToGroup(kinematicGroup);
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
	 * @override
	 */
	getPose(currentPose, inplaceOutput, target, defaultPose, pointNodeReport, lastProduced){ // eslint-disable-line no-unused-vars
		//not modifying pointNodeReport, node is not being stabilized

		// Do not need this here, we will set all values below.
		// And this would override data too early if lastProduced is same instance as inplaceOutput
		//if(inplaceOutput!==currentPose) {
		//	inplaceOutput.setPose(currentPose);
		//}

		if(defaultPose == null){ //null or undefined (eqnull)
			defaultPose = currentPose;
		}

		var anyFailures = false;

		this._kinematicGroup.setFromPose(currentPose);
		//this._kinematicGroup.getRoot().updateMatrixWorld(true);
		this._kinematicGroup.updateWorldCoordinateFrames();

		var pointDOFReport = null;

		var rotValue = this._rotationalDOF.valToPointAtTarget(target, pointDOFReport, currentPose);

		//don't need to recompute for base node, no ancestors will have moved
		//this._kinematicGroup.setFromPose(currentPose);
		////this._kinematicGroup.getRoot().updateMatrixWorld(true);
		//this._kinematicGroup.updateWorldCoordinateFrames();

		var planeAlignmentVals = this._planeAlignmentDOF.valsToPointAtTarget(target, pointDOFReport, currentPose, rotValue, lastProduced);

		if(planeAlignmentVals != null && rotValue != null) {

			inplaceOutput.set(this._planeAlignmentDOFNames[0], planeAlignmentVals[0], 0);
			inplaceOutput.set(this._planeAlignmentDOFNames[1], planeAlignmentVals[1], 0);

			inplaceOutput.set(this._rotationalDOFName, inplaceOutput.get(this._rotationalDOFName,0)+rotValue, 0);
			this._rotationalDOFLastValue = rotValue;

		}else{
			//give the default value if either computation is invalid; neither is much use without the other.

			slog(channel, "LookatNode "+this._name+" using last value due to uncomputable value for target ("+target.x+", "+target.y+", "+target.z+")");
			inplaceOutput.set(this._planeAlignmentDOFNames[0], defaultPose.get(this._planeAlignmentDOFNames[0],0),0);
			inplaceOutput.set(this._planeAlignmentDOFNames[1], defaultPose.get(this._planeAlignmentDOFNames[1],0),0);

			inplaceOutput.set(this._rotationalDOFName, defaultPose.get(this._rotationalDOFName,0),0);
			anyFailures = true;

		}


		this._lastPose.setPose(inplaceOutput);

		return !anyFailures;
	}


	/**
	 * Get all the dofs that are modified by this node
	 * @returns {Array.<string>}
	 * @override
	 */
	getDOFs(){
		return this._dofs;
	}

	/**
	 * Get all the dofs that are needed in the provided kinematic group
	 * (may include dofs that will not be modified by this node)
	 * @return {string[]}
	 * @override
	 */
	getDOFsNeededInKG(){
		return this._dofsNeededInKG;
	}


	/**
	 * Find the distance between 2 poses, only accounting for DOFs that are part of this LookatNode.
	 * The difference is calculated as a ratio (of error over dof range) rather than absolute value.
	 * This function is designed to give a metric lookat progress, e.g., pass in optimal and
	 * filtered/current to see how far the lookat still has to go.
	 *
	 * @param {Pose} pose1
	 * @param {Pose} pose2
	 * @return {number} greatest ratio (distance/totalDistance) of any of our lookat DOFs between pose1 to pose2
	 * @override
	 */
	distanceAsRatio(pose1, pose2){

		var p1v, p2v, ratio;
		var maxRatio = 0;

		p1v = pose1.get(this._rotationalDOFName, 0);
		p2v = pose2.get(this._rotationalDOFName, 0);

		ratio = this._rotationalDOF.errorRatio(p1v-p2v);

		if(ratio > maxRatio){
			maxRatio = ratio;
		}

		p1v = pose1.get(this._planeAlignmentDOFNames[0], 0);
		p2v = pose2.get(this._planeAlignmentDOFNames[0], 0);

		ratio = Math.abs((p1v-p2v)/(Math.PI*2));

		if(ratio > maxRatio){
			maxRatio = ratio;
		}

		p1v = pose1.get(this._planeAlignmentDOFNames[1], 0);
		p2v = pose2.get(this._planeAlignmentDOFNames[1], 0);

		ratio = Math.abs((p1v-p2v)/(Math.PI*2));

		if(ratio > maxRatio){
			maxRatio = ratio;
		}

		return maxRatio;
	}

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
	getIndividuallyForwardPose(inplacePose){
		//by default, assume all dofs are individually forward in normal operation
		inplacePose.setPose0Only(this._lastPose);

		//change the forward for the base rotation to be only the contribution of the rotation dof
		inplacePose.set(this._rotationalDOFName, this._rotationalDOFLastValue, 0);
	}


	/**
	 * See getIndividuallyForwardPose.  This function returns true if the individual forwards
	 * are the same as what is provided with getPose().  Override both this and getIndividuallyForwardPose
	 * together.
	 *
	 * @returns {boolean} true if the usual values (getPose()) indicate optimal forward indivdually
	 */
	valsAreIndividuallyForward(){
		//by default, assume all dofs are individually forward in normal operation
		return false;
	}


	/**
	 *
	 * @param {Pose} currentPose - use this current pose
	 * @param {THREE.Vector3} inplaceVec
	 * @return {THREE.Vector3} a suggestion for a target that is forward for this lookat (node is already looking at this point)
	 * @override
	 */
	suggestForwardTarget(currentPose, inplaceVec){ // eslint-disable-line no-unused-vars

		console.log("Suggest Forward Target not implemented here"); //not planning to use stabilization on this node, may need forward target if we do
		return null;

		//this._kinematicGroup.setFromPose(currentPose);
		////this._kinematicGroup.getRoot().updateMatrixWorld(true);
		//this._kinematicGroup.updateWorldCoordinateFrames();
		//return this._lookatDOFs[0].suggestForwardTarget(inplaceVec);
	}
}

export default PlaneAlignmentWithRollLookatNode;
