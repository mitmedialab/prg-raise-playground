"use strict";

import PointADOF from "./PointADOF.js";
import LookatDOF from "./LookatDOF.js";

/**
 *
 * @param {string} name
 * @param {string} controlledDOFName - should be a single translation dof
 * @param {string} centralTransformName - transform to use as anchor for angle computations
 * @param {THREE.Vector3} forwardDirection - forward from centralTransform
 * @param {THREE.Vector3} planeNormal - normal to restrict targets to plane (so motion is along single axis, e.g., left/right, up/down)
 * @param {number} internalDistance - distance behind (along -forward) centralTransform to be calculating angles from
 * @param {number} dofMin - value will be clamped to min, and max-min will be used for error ratio
 * @param {number} dofMax - value will be clamped to max, and max-min will be used for error ratio
 * @extends LookatDOF
 * @constructor
 */
const PlaneDisplacementLookatDOF = function(name, controlledDOFName, centralTransformName,
											forwardDirection, planeNormal, internalDistance,
											dofMin, dofMax){
	LookatDOF.call(this, name, controlledDOFName);

	/** @type {TranslationControl} */
	this._control = null;

	/**	@type {THREE.Vector3} */
	this._forwardDir = forwardDirection;

	/**	@type {string} */
	this._centralTransformName = centralTransformName;

	/**	@type number */
	this._internalDistance = internalDistance;


	/** @type {THREE.Vector3} */
	this._planeNormal = planeNormal;

	/** @type {THREE.Object3D} */
	this._controlledTransform = null;

	/** @type {THREE.Object3D} */
	this._centralTransform = null;

	/** @type {number} */
	this._dofMin = dofMin;

	/** @type {number} */
	this._dofMax = dofMax;
};

PlaneDisplacementLookatDOF.prototype = Object.create(LookatDOF.prototype);
PlaneDisplacementLookatDOF.prototype.constructor = PlaneDisplacementLookatDOF;

/**
 * @param {KinematicGroup} kinematicGroup group to use for kinematic math (assumed to be configured as desired before valToPointAtTarget calls)
 */
PlaneDisplacementLookatDOF.prototype.connectToGroup = function(kinematicGroup){
	LookatDOF.prototype.connectToGroup.call(this, kinematicGroup);
	if(this._kinematicGroup) {
		this._control = this._kinematicGroup.getModelControlGroup().getControlForDOF(this._controlledDOFName);
		this._controlledTransform = this._kinematicGroup.getTransform(this._control.getTransformName());
		this._centralTransform = this._kinematicGroup.getTransform(this._centralTransformName);
	}else{
		this._control = null;
		this._controlledTransform = null;
		this._centralTransform = null;
	}
};


/**
 * Compute value is relative to current setup of the hierarchy that this._transform is part of.
 *
 * @param {THREE.Vector3} target
 * @param {PointReport} [pointReport] - inplace arg to return metadata about computation
 * @param {Pose} [currentPose] - currentPose of the bot, should be same as pose represented by associated kinematic group
 * @return {number} Value to cause this._control to point local this._forwardDir at the target
 * @override
 */
PlaneDisplacementLookatDOF.prototype.valToPointAtTarget = function(target, pointReport, currentPose){ // eslint-disable-line no-unused-vars
	var val = PointADOF.planeIntersectFromRear(this._centralTransform, target, null, this._forwardDir, this._planeNormal, this._internalDistance, pointReport);
	return Math.max(Math.min(val,this._dofMax), this._dofMin);
};

/**
 * Provide the ratio that this error represents for the range of motion of this LookatDOF
 * @param errorAbsolute absolute error
 * @return {number} ratio that absoluteError represents of the total range of this LookatDOF
 * @override
 */
PlaneDisplacementLookatDOF.prototype.errorRatio = function(errorAbsolute){
	return Math.abs(errorAbsolute / (this._dofMax-this._dofMin));
};


PlaneDisplacementLookatDOF.prototype.suggestForwardTarget = function(inplaceVec){
	if(this._centralTransform == null){
		return null;
	}else{
		inplaceVec.copy(this._forwardDir);
		inplaceVec.multiplyScalar(10);
		this._centralTransform.localToWorld(inplaceVec);
		return inplaceVec;
	}
};


/**
 *
 * @param {PlaneDisplacementLookatDOF} pdldOne
 * @param {PlaneDisplacementLookatDOF} pdldTwo
 * @param {Pose} pose
 * @param {THREE.Vector3} inplaceOrigin
 * @param {THREE.Vector3} inplaceDirection
 * @return boolean
 */
PlaneDisplacementLookatDOF.getVectorFromOrthogonalPDLDs = function(pdldOne, pdldTwo, pose, inplaceOrigin, inplaceDirection){
	return PointADOF.vectorFromPlaneIntersections(pdldOne._centralTransform, null, pdldOne._forwardDir,
		pose.get(pdldOne._controlledDOFName, 0), pdldOne._planeNormal, pdldOne._internalDistance,
		pose.get(pdldTwo._controlledDOFName, 0), pdldTwo._planeNormal, pdldTwo._internalDistance,
		inplaceOrigin, inplaceDirection);
};

export default PlaneDisplacementLookatDOF;
