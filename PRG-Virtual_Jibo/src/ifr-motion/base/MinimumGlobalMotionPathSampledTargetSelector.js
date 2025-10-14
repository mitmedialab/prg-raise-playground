"use strict";

import CyclicDOFTargetSelector from "./CyclicDOFTargetSelector.js";

/**
 *
 * @param {string} dofName
 * @param {KinematicGroup} kinematicGroup
 * @constructor
 * @extends CyclicDOFTargetSelector
 */
class MinimumGlobalMotionPathSampledTargetSelector extends CyclicDOFTargetSelector {
	constructor(dofName, kinematicGroup){
		super(dofName);
		this._kinematicGroup = kinematicGroup;
	}

	/**
	 *
	 * Compute value for our DOF, rotationally equivalent to the value it has
	 * in targetPose, but that causes it to go the short (or the otherwise
	 * preferable) way around from currentPose
	 *
	 * This may rely on the currentPose and targetPose values being the correct
	 * sign, i.e., the ancestor values are going to be used as-is, not same-sided
	 * after this point. (Except for the sign of our dof in targetPose pose, of
	 * course, which is what we're computing)
	 *
	 * @param {Pose} currentPose - current pose (should include current position of theDOF)
	 * @param {Pose} targetPose - target pose (should include target position of theDOF)
	 * @override
	 * @return {number} target for this DOF (from targetPose), made into the "close-path" equivalent value for theDOF
	 */
	closestEquivalentRotation(currentPose, targetPose){ // eslint-disable-line no-unused-vars
		// Implementation placeholder - method body intentionally empty in original
	}
}

export default MinimumGlobalMotionPathSampledTargetSelector;

