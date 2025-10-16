"use strict";

import CyclicDOFTargetSelector from "./CyclicDOFTargetSelector.js";
import CyclicMath from "./CyclicMath.js";

/**
 * CyclicDOFTargetSelector for the case where the parent motion we are compensating
 * for is on-axis with our own motion, and therefore the solution can be a computed
 * as a scalar without 3d math.
 *
 * @param {string} dofName
 * @param {string[]} alignedParents - all parents that contribute to motion of this joint (all must be axis aligned)
 * @param {number[]} parentDirections - sign of the direction for these parents, relative to us (-1 or 1)
 * @constructor
 * @extends CyclicDOFTargetSelector
 */
class SeriesAlignedAxesTargetSelector extends CyclicDOFTargetSelector {
	constructor(dofName, alignedParents, parentDirections){
		super(dofName);
		this._alignedParents = alignedParents;
		this._parentDirections = parentDirections;
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
	closestEquivalentRotation(currentPose, targetPose){
		//find our motion from current to target due to our parents
		let parentMotion = 0;
		for(let i = 0; i < this._alignedParents.length; i++){
			const aParentCurrent = currentPose.get(this._alignedParents[i], 0);
			const aParentTarget = targetPose.get(this._alignedParents[i], 0);
			const aParentMotion = aParentTarget - aParentCurrent;
			parentMotion += this._parentDirections[i] * aParentMotion;
		}

		const finalOrientation = targetPose.get(this.getDOFName(), 0);
		const initialOrientation = currentPose.get(this.getDOFName(), 0);
		const referenceRotation = initialOrientation - parentMotion;

		return CyclicMath.closestEquivalentRotation(finalOrientation, referenceRotation);
	}
}

export default SeriesAlignedAxesTargetSelector;

