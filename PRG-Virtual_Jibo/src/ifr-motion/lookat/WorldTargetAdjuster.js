"use strict";

import slog from "../../ifr-core/SLog.js";
import THREE from "@jibo/three";

const channel = "LOOKAT";

/**
 *
 * @param {number} left - shift target left this many radians (negative for right)
 * @param {number} down - shift target down this many radians (negative for up)
 * @param {THREE.Vector3} upDir - world up vector to define what left/down mean.  left will be RHR (anticlockwise) of up.
 * @constructor
 */
const WorldTargetAdjuster = function (left, down, upDir) {
	this._left = left;
	this._down = down;
	this._up = upDir;
};

/**
 * @param {Pose} currentPose
 * @param {THREE.Vector3} target
 * @return {THREE.Vector3}
 */
WorldTargetAdjuster.prototype.getAdjustedTarget = function (currentPose, target){
	var result = target.clone();
	if(this._left !== 0){
		var leftRot = new THREE.Quaternion().setFromAxisAngle(this._up, this._left);
		result = result.applyQuaternion(leftRot);
	}

	if(this._down !== 0){

		/** @type {THREE.Vector3} */
		var axis = this._up.clone().cross(result);
		if(axis.length() < 0.0001){
			slog.log(channel, "WorldTargetAdjuster not adjusting target up/down, we're near singularity");
		}else{
			axis.normalize();
			var downRot = new THREE.Quaternion().setFromAxisAngle(axis, this._down);
			result = result.applyQuaternion(downRot);
		}

	}
	return result;
};

export default WorldTargetAdjuster;
