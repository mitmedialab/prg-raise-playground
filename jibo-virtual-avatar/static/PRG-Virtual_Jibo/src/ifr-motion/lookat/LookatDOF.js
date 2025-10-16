"use strict";

/**
 *
 * @param {string} name
 * @param {string} controlledDOFName
 * @constructor
 */
const LookatDOF = function(name, controlledDOFName){
	/** @type {string} */
	this._name = name;

	/** @type {string} */
	this._controlledDOFName = controlledDOFName;

	/** @type {KinematicGroup} */
	this._kinematicGroup = null;
};

/**
 * @param {KinematicGroup} kinematicGroup group to use for kinematic math (assumed to be configured as desired before valToPointAtTarget calls)
 */
LookatDOF.prototype.connectToGroup = function(kinematicGroup){
	this._kinematicGroup = kinematicGroup;
};

/**
 * Compute value is relative to current setup of the hierarchy that transform is part of.
 *
 * @param {THREE.Vector3} target - world space target
 * @param {PointReport} [pointReport] - optional report for holding meta info produced by computation
 * @param {Pose} [currentPose] - currentPose of the bot, should be same as pose represented by associated kinematic group
 * @abstract
 * @return {number} Value to cause this._control to point local this._forwardDir at the target
 */
LookatDOF.prototype.valToPointAtTarget = function(target, pointReport, currentPose){}; // eslint-disable-line no-unused-vars

LookatDOF.prototype.getName = function(){
	return this._name;
};

LookatDOF.prototype.getControlledDOFName = function(){
	return this._controlledDOFName;
};

/**
 * Provide the ratio that this error represents for the range of motion of this LookatDOF
 * @param errorAbsolute absolute error
 * @return {number} ratio that absoluteError represents of the total range of this LookatDOF
 */
LookatDOF.prototype.errorRatio = function(errorAbsolute){}; // eslint-disable-line no-unused-vars

/**
 * provide a suggestion for a target that is forward for this lookat (node is already looking at this point)
 * @param {THREE.Vector3} inplaceVec
 * @return {THREE.Vector3}
 * @abstract
 */
LookatDOF.prototype.suggestForwardTarget = function(inplaceVec){}; // eslint-disable-line no-unused-vars


export default LookatDOF;