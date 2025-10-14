"use strict";

import THREE from "@jibo/three";
import PointADOF from "./PointADOF.js";
import LookatDOF from "./LookatDOF.js";
import ExtraMath from "../../ifr-geometry/ExtraMath.js";
import CyclicMath from "../../ifr-motion/base/CyclicMath.js";

/**
 *
 * @param {string} name
 * @param {string} controlledDOFName
 * @param {THREE.Vector3} planeNormal
 * @param {number} distanceAlongDOFAxisToPlane
 * @param {number} angleAbovePlane
 * @param {boolean} chooseCloserSolution
 * @extends LookatDOF
 * @constructor
 */
const RotationalPlaneAlignmentLookatDOF = function(name, controlledDOFName, planeNormal,
													distanceAlongDOFAxisToPlane, angleAbovePlane, chooseCloserSolution){
	LookatDOF.call(this, name, controlledDOFName);

	/** @type {RotationControl} */
	this._control = null;

	/**	@type {THREE.Vector3} */
	this._planeNormal = planeNormal;

	/**	@type {number} */
	this._distanceAlongDOFAxisToPlane = distanceAlongDOFAxisToPlane;

	/**	@type {number} */
	this._angleAbovePlane = angleAbovePlane;

	/** @type {THREE.Object3D} */
	this._transform = null;

	/** @type {boolean} */
	this._chooseCloserSolution = chooseCloserSolution;
};

RotationalPlaneAlignmentLookatDOF.prototype = Object.create(LookatDOF.prototype);
RotationalPlaneAlignmentLookatDOF.prototype.constructor = RotationalPlaneAlignmentLookatDOF;

/**
 * @param {KinematicGroup} kinematicGroup group to use for kinematic math (assumed to be configured as desired before valToPointAtTarget calls)
 */
RotationalPlaneAlignmentLookatDOF.prototype.connectToGroup = function(kinematicGroup){
	LookatDOF.prototype.connectToGroup.call(this, kinematicGroup);
	if(kinematicGroup) {
		this._control = this._kinematicGroup.getModelControlGroup().getControlForDOF(this._controlledDOFName);
		this._transform = this._kinematicGroup.getTransform(this._control.getTransformName());
	}else{
		this._transform = null;
		this._control = null;
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
RotationalPlaneAlignmentLookatDOF.prototype.valToPointAtTarget = function(target, pointReport, currentPose){
	var values = PointADOF.pointDOFToIntersectConeWithPoint(this._control, this._transform,
		this._planeNormal, this._distanceAlongDOFAxisToPlane, target, this._angleAbovePlane, true, pointReport);
	if(values && values.length > 0){
		var val = values[0];
		if(values.length > 1 && this._chooseCloserSolution){
			var currentDOFValue = CyclicMath.closestEquivalentRotation(currentPose.get(this._controlledDOFName, 0), 0);
			var v1 = CyclicMath.closestEquivalentRotation(values[0], currentDOFValue);
			var v2 = CyclicMath.closestEquivalentRotation(values[1], currentDOFValue);
			if(Math.abs(v1-currentDOFValue) <= Math.abs(v2-currentDOFValue)){
				val = v1;
			}else{
				val = v2;
			}
			//if(pointReport!==null){
			//	pointReport.solution1 = v1;
			//	pointReport.solution2 = v2;
			//}
		}
		return val;
	}
};

/**
 * Provide the ratio that this error represents for the range of motion of this LookatDOF.
 * For cyclic dofs, range is considered one revolution.
 *
 * @param errorAbsolute absolute error
 * @return {number} ratio that absoluteError represents of the total range of this LookatDOF
 * @override
 */
RotationalPlaneAlignmentLookatDOF.prototype.errorRatio = function(errorAbsolute){
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
RotationalPlaneAlignmentLookatDOF.prototype.suggestForwardTarget = function(inplaceVec){
	if(this._transform == null){
		return null;
	}else{
		//TODO: cache results and variables
		var origin = new THREE.Vector3();
		this._control.getRotationalAxis(origin);
		var perp = new THREE.Vector3();
		ExtraMath.findOrthogonal(this._planeNormal, perp);

		var coneItAxis = new THREE.Vector3();
		coneItAxis.crossVectors(perp, this._planeNormal);
		var coneItRot = new THREE.Quaternion();
		ExtraMath.quatFromAxisAngle(coneItAxis, this._angleAbovePlane, coneItRot);
		perp.applyQuaternion(coneItRot);

		origin.setLength(this._distanceAlongDOFAxisToPlane);
		perp.setLength(10);
		inplaceVec.copy(perp);
		inplaceVec.add(origin);

		this._transform.localToWorld(perp);
		return inplaceVec;
	}
};


export default RotationalPlaneAlignmentLookatDOF;
