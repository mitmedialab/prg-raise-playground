"use strict";

import THREE from "@jibo/three";
import PointADOF from "./PointADOF.js";
import LookatDOF from "./LookatDOF.js";

/**
 *
 * @param {string} name
 * @param {string} controlledDOFName
 * @param {THREE.Vector3} forwardDirection
 * @extends LookatDOF
 * @constructor
 */
const RotationalLookatDOF = function(name, controlledDOFName, forwardDirection){
	LookatDOF.call(this, name, controlledDOFName);

	/** @type {RotationControl} */
	this._control = null;

	/**	@type {THREE.Vector3} */
	this._forwardDir = forwardDirection;

	/** @type {THREE.Object3D} */
	this._transform = null;

	/** @type {THREE.Vector3} */
	this._axis = null;
};

RotationalLookatDOF.prototype = Object.create(LookatDOF.prototype);
RotationalLookatDOF.prototype.constructor = RotationalLookatDOF;

/**
 * @param {KinematicGroup} kinematicGroup group to use for kinematic math (assumed to be configured as desired before valToPointAtTarget calls)
 */
RotationalLookatDOF.prototype.connectToGroup = function(kinematicGroup){
	LookatDOF.prototype.connectToGroup.call(this, kinematicGroup);
	if(this._kinematicGroup) {
		this._control = this._kinematicGroup.getModelControlGroup().getControlForDOF(this._controlledDOFName);
		this._transform = this._kinematicGroup.getTransform(this._control.getTransformName());
		this._axis = new THREE.Vector3();
		this._control.getRotationalAxis(this._axis);
	}else{
		this._transform = null;
		this._control = null;
		this._axis = null;
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
RotationalLookatDOF.prototype.valToPointAtTarget = function(target, pointReport, currentPose){ // eslint-disable-line no-unused-vars
	return PointADOF.pointDOF(this._control, this._transform, this._forwardDir, target, pointReport);
};

/**
 * Provide the ratio that this error represents for the range of motion of this LookatDOF.
 * For cyclic dofs, range is considered one revolution.
 *
 * @param errorAbsolute absolute error
 * @return {number} ratio that absoluteError represents of the total range of this LookatDOF
 * @override
 */
RotationalLookatDOF.prototype.errorRatio = function(errorAbsolute){
	if(this._control.isCyclic()){
		return Math.abs(errorAbsolute / (Math.PI*2));
	}else{
		return Math.abs(errorAbsolute / (this._control.getMax()-this._control.getMin()));
	}
};

/**
 * provide a suggestion for a target that is forward for this lookat (node is already looking at this point)
 * @param {THREE.Vector3} inplaceVec
 * @return {THREE.Vector3}
 * @override
 */
RotationalLookatDOF.prototype.suggestForwardTarget = function(inplaceVec){
	if(this._transform == null){
		return null;
	}else{
		inplaceVec.copy(this._forwardDir);
		inplaceVec.multiplyScalar(10);
		this._transform.localToWorld(inplaceVec);
		return inplaceVec;
	}
};

export default RotationalLookatDOF;
