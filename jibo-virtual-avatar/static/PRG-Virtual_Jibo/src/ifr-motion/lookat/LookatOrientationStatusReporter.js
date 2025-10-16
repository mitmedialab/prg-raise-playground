"use strict";

import Pose from "../base/Pose.js";

/**
 *
 * @param {string} generate the report on the update of this dof
 * @param {string[]} dofNamesForIndividualOrientation
 * @param {string[]} additionalStatusDOFs
 * @constructor
 */
const LookatOrientationStatusReporter = function (reportOnDOF, dofNamesForIndividualOrientation, additionalStatusDOFs) {
	this._orientationDOFs = dofNamesForIndividualOrientation;
	this._statusDOFs = additionalStatusDOFs;
	this._inplacePoseCurrent = new Pose("IndividualForwardsCurrent", this._orientationDOFs);
	this._inplacePoseTarget = new Pose("IndividualForwardsTarget", this._orientationDOFs);
	this._orientationDOFIndices = [];
	this._statusDOFIndices = [];
	this._reportOnIndex = this._inplacePoseCurrent.getDOFIndexForName(reportOnDOF);
	var i;
	for(i = 0; i < this._orientationDOFs.length; i++){
		this._orientationDOFIndices[i] = this._inplacePoseCurrent.getDOFIndexForName(this._orientationDOFs[i]);
	}
	for(i = 0; i < this._statusDOFs.length; i++){
		this._statusDOFIndices[i] = this._inplacePoseCurrent.getDOFIndexForName(this._statusDOFs[i]);
	}
};


/**
 * Generate the status of the look orientation forwards.  motionLookat MUST have already computed its
 * pose for all dofs in _orientationDOFs.
 *
 * @param {MotionLookat} motionLookat
 * @return {object}
 */
LookatOrientationStatusReporter.prototype.generateStatus = function(motionLookat){
	var status = {}, i, dof, di;

	motionLookat.getIndividuallyForwardPose(this._inplacePoseTarget, this._inplacePoseCurrent);

	for(i = 0; i < this._orientationDOFIndices.length; i++){
		dof = this._orientationDOFs[i];
		di = this._orientationDOFIndices[i];
		status[dof] = {
			iForwardCur:this._inplacePoseCurrent.getByIndex(di, 0),
			iForwardTarg:this._inplacePoseTarget.getByIndex(di, 0),
			AtTarget:motionLookat.getHoldReachedForDOFIndex(di),
			Tracking:motionLookat.getIsTrackingForDOFIndex(di)
		};
	}
	for(i = 0; i < this._statusDOFs.length; i++){
		dof = this._statusDOFs[i];
		di = this._statusDOFIndices[i];
		status[dof] = {
			AtTarget:motionLookat.getHoldReachedForDOFIndex(di),
			Tracking:motionLookat.getIsTrackingForDOFIndex(di)
		};
	}

	return status;
};

/**
 *
 * @param {number} dofIndex
 */
LookatOrientationStatusReporter.prototype.shouldReportOnIndex = function(dofIndex){
	return dofIndex === this._reportOnIndex;
};


export default LookatOrientationStatusReporter;
