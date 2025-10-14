"use strict";

import Pose from "../base/Pose.js";

/**
 *
 * @param {LookatNode[]} lookatNodes - assumed to be in order root to leaf
 * @param {KinematicGroup} kinematicGroupPrototype
 * @constructor
 */
const Lookat = function(lookatNodes, kinematicGroupPrototype){
	var allRequiredDOFs = [];

	/** @type {LookatNode[]} */
	this._lookatNodes = lookatNodes;
	for(var i = 0; i < this._lookatNodes.length; i++){
		var localGroup = kinematicGroupPrototype.getCopy(kinematicGroupPrototype.getModelControlGroup().getRequiredTransformNamesForDOFs(this._lookatNodes[i].getDOFsNeededInKG()), true);
		this._lookatNodes[i].connectToGroup(localGroup);

		//local group will include all required ancestor dofs
		var dofsForThisLook = localGroup.getDOFNames();
		for(var j = 0; j < dofsForThisLook.length; j++){
			if(allRequiredDOFs.indexOf(dofsForThisLook[j]) < 0){
				allRequiredDOFs.push(dofsForThisLook[j]);
			}
		}
	}

	/** @type {Pose} */
	this._internalPose = new Pose("LookPose", allRequiredDOFs);
};

/**
 *
 * @param {Pose} poseCurrentPose - should contain at least nodes of relevance to the computation, e.g. ancestor nodes
 * @param {Pose} poseInplaceOut - output values will be stored here
 * @param {THREE.Vector3} target - target in world space
 */
Lookat.prototype.generatePose = function(poseCurrentPose, poseInplaceOut, target){
	if(poseCurrentPose!==poseInplaceOut) {
		poseInplaceOut.setPose(poseCurrentPose);
	}

	this._internalPose.setPose(poseCurrentPose);

	for(var i = 0; i < this._lookatNodes.length; i++){
		this._lookatNodes[i].getPose(this._internalPose, this._internalPose, target);
	}
	poseInplaceOut.setPose(this._internalPose);
};

/**
 * @return {string[]} dof names that can be affected by this lookat
 */
Lookat.prototype.getDOFs = function(){
	var dofNames = [];
	for(var i = 0; i < this._lookatNodes.length; i++) {
		dofNames = dofNames.concat(this._lookatNodes[i].getDOFs());
	}
	return dofNames;
};

/**
 * @returns {Array.<string>} all dof names that this lookat affects, or that can affect this lookat (ancestors)
 */
Lookat.prototype.getStateDOFs = function(){
	return this._internalPose.getDOFNames();
};

export default Lookat;