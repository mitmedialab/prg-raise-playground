"use strict";

import TranslationControl from "../ifr-motion/dofs/TranslationControl.js";

const EyeKinematicsHelper = {};

/**
 * Compute the vertex positions that would result from the given set of dof
 * values, and return them in a map (does not actually move the vertices).
 *
 * Keys of dofValues argument are expected to be DOF names; keys of the
 * returned map are the vertex names.
 *
 * Only gets values from TranslationControl types
 *
 * @param {Object.<string, Object>} dofValues
 * @param {RobotInfo} robotInfo - use the eye dof controls from this robot info to compute the values
 * @return {Object.<string, THREE.Vector3>} map from vertices to local positions
 */
EyeKinematicsHelper.verticesForDOFValues = function(dofValues, robotInfo){
	/** @type {ModelControlGroup} */
	const eyeControlGroup = robotInfo.getKinematicInfo().getEyeControlGroup();

	const vertexMap = {};
	const controlList = eyeControlGroup.getControlList();
	for(let i = 0; i < controlList.length; i++){
		const control = controlList[i];
		if(control instanceof TranslationControl){
			vertexMap[control._skeletonFrameName] = control.computeFromDOFValues(dofValues, true);
		}
	}

	return vertexMap;
};

export default EyeKinematicsHelper;