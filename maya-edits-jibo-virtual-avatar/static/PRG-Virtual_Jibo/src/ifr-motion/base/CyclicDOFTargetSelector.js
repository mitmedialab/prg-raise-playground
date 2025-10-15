"use strict";

import CyclicMath from "./CyclicMath.js";

/**
 *
 * @param {string} dofName
 * @constructor
 */
class CyclicDOFTargetSelector {
	constructor(dofName){
		this._dofName = dofName;
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
	 * @abstract
	 * @return {number} target for this DOF (from targetPose), made into the "close-path" equivalent value for theDOF
	 */
	closestEquivalentRotation(currentPose, targetPose){
		return CyclicMath.closestEquivalentRotation(targetPose.get(this._dofName, 0), currentPose.get(this._dofName, 0));
	}

	/**
	 * @return {string} name of the dof this selector is computing values for
	 */
	getDOFName(){
		return this._dofName;
	}
}

export default CyclicDOFTargetSelector;