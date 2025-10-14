"use strict";

import Pose from "../base/Pose.js";

/**
 *
 * @param {number} [undershootTarget]
 * @constructor
 */
const LookatNodeTargetAdjuster = function(undershootTarget){
	/**
	 * @type {number}
	 * @private
	 */
	this._undershootTarget = 0;
	if(undershootTarget!=null){ //null or undefined (eqnull)
		this._undershootTarget = undershootTarget;
	}

	/**
	 * @type {Pose}
	 * @private
	 */
	this._currentDesiredDelta = new Pose("LNTA Delta");

	var self = this;

	this._absMaxValue = function(dofName, poseData) {
		var limit = self._undershootTarget;
		var result = [];
		if (poseData.length > 0) {
			result[0] = Math.max(-limit, Math.min(limit, poseData[0]));
		}
		return result;
	};

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._lastWorldTarget = null;
};

/**
 *
 * @param {Pose} optimalPose
 * @param {Pose} currentPose
 * @param {Pose} inplaceDelta
 * @param {DOFGlobalAlignment} dofAligner
 * @private
 */
LookatNodeTargetAdjuster.prototype.reComputeDelta = function(optimalPose, currentPose, inplaceDelta, dofAligner){
	if(dofAligner!=null){
		dofAligner.refineToLocallyClosestTargetPose(currentPose, optimalPose);
	}

	Pose.subtract(currentPose, optimalPose, false, inplaceDelta);
	Pose.computeUnary(inplaceDelta, this._absMaxValue, false, inplaceDelta);
	//console.log("Recomputed target adjustment delta (|"+currentPose+" - "+optimalPose+"|) as:"+inplaceDelta.toString());
};


/**
 * @param {number} newMaxDelta
 */
LookatNodeTargetAdjuster.prototype.setMaxDelta = function(newMaxDelta){
	this._undershootTarget = newMaxDelta;
	this._lastWorldTarget = null; //trigger a recalculation of the offset
};

/**
 * @param {Pose} optimal
 * @param {Pose} currentPose
 * @param {THREE.Vector3} worldTarget
 * @param {DOFGlobalAlignment} dofAligner
 * @param {Pose} inplaceOutput
 */
LookatNodeTargetAdjuster.prototype.adjustTarget = function(optimal, currentPose, worldTarget, dofAligner, inplaceOutput){
	if(this._undershootTarget !== 0) {
		//console.log("LookatNodeTargetAdjuster: doing adjustment of "+this._undershootTarget);
		//we only need to operate if we have a non-zero _maxDesiredDelta, otherwise the optimal is the answer
		if (this._lastWorldTarget === null) {
			this._lastWorldTarget = worldTarget.clone();
			//recompute
			this.reComputeDelta(optimal, currentPose, this._currentDesiredDelta, dofAligner);
		} else if (this._lastWorldTarget.distanceToSquared(worldTarget) > 0.001) {
			this._lastWorldTarget.copy(worldTarget);
			//recompute
			this.reComputeDelta(optimal, currentPose, this._currentDesiredDelta, dofAligner);
		}
		Pose.add(optimal, this._currentDesiredDelta, false, inplaceOutput);
	}else if(optimal !== inplaceOutput){
		//console.log("LookatNodeTargetAdjuster: doing zero adjustment (copy)");
		//optimal is the answer, as _maxDesiredDelta is zero; if they are not the same instance we must copy it over
		inplaceOutput.setPose(optimal);
	}//else{
		//console.log("LookatNodeTargetAdjuster: doing zero adjustment (passthrough)");
	//}

};

export default LookatNodeTargetAdjuster;