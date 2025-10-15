"use strict";

import BaseMotionGenerator from "./BaseMotionGenerator.js";
import LookatBlendGenerator from "./LookatBlendGenerator.js";
import Pose from "../../ifr-motion/base/Pose.js";
import slog from "../../ifr-core/SLog.js";

const channel = "LOOKAT";

/**
 * @param {AnimationUtilities} animUtils
 * @param {MotionLookat} motionLookat
 * @param {jibo.animate.Time} startTime
 * @param {THREE.Vector3} target
 * @param {string[]} [onDOFs=null] - use only these dofs (all dofs of motionLookat used if omitted/null)
 * @param {LookatMultiLayerStatusManager} multiLayerLookatStatus - handle statekeeping here to allow for multiple generators per lookat
 * @param {LookatOrientationStatusReporter} statusReporter
 * @constructor
 * @extends BaseMotionGenerator
 */
class LookatMotionGenerator extends BaseMotionGenerator {
	constructor(animUtils, motionLookat, startTime, target, onDOFs, multiLayerLookatStatus, statusReporter) {
		let useDOFs;
		const fullLookatDOFs = motionLookat.getDOFs();
		if(onDOFs!=null){ //null or undefined (eqnull)
			useDOFs = [];
			for(let i = 0; i < onDOFs.length; i++){
				if(fullLookatDOFs.indexOf(onDOFs[i])>=0){
					useDOFs.push(onDOFs[i]);
				}else{
					slog(channel, "Rejecting dof "+onDOFs[i]+" from lookat set as it is covered by no lookat nodes");
				}
			}
		}else{
			useDOFs = fullLookatDOFs;
		}

		super(animUtils, "SingleLookGenerator", startTime);
		this._initWithDOFNames(useDOFs, null);

		/** @type {MotionLookat} */
		this._motionLookat = motionLookat; //TODO: we assume that motion lookat is reset and primed with current state

		/** @type {THREE.Vector3} */
		this._target = target.clone();

		/** @type {Pose} */
		this._generatedPose = new Pose("LMG generated pose", fullLookatDOFs);

		/**
		 * pose frozen after particular dofs roll off the end
		 * @type {Pose} */
		this._frozenPose = new Pose("LMG frozen pose", useDOFs);

		this._motionLookat.getPose(this._frozenPose);

		/** @type {LookatMultiLayerStatusManager} */
		this._multiLayerLookatStatus = multiLayerLookatStatus;

		/** @type {LookatOrientationStatusReporter} */
		this._statusReporter = statusReporter || null;
	}

	/**
	 *
	 * @param {THREE.Vector3} target
	 */
	setTarget(target){
		this._target.copy(target);
	}

	/**
	 *
	 * @param {jibo.animate.Time} currentTime
	 * @override
	 */
	notifyUpdateFinished(currentTime)
	{
		if(currentTime.isGreaterOrEqual(this._startTime)) {
			var shouldEndNow = this._multiLayerLookatStatus.handleUpdateFinishedForGenerator(this, currentTime);

			if(shouldEndNow) {
				this.cropEnd(currentTime, this.getDOFIndices());
				this._interrupted = false;
			}
		}

		super.notifyUpdateFinished.call(this, currentTime);
	}

	/**
	 * @param {number} dofIndex
	 * @param {LayerState} partialRender
	 * @param {Object} blackboard
	 * @returns {number[]}
	 * @override
	 */
	getDOFState(dofIndex, partialRender, blackboard) // eslint-disable-line no-unused-vars
	{
		var endTime = this._dofEndTimes[dofIndex];
		var val = null;

		if(endTime === null || endTime.isGreater(this._currentTime)){
			this._motionLookat.generatePoseIncremental(partialRender.getPose(), this._generatedPose, this._target, this._currentTime, dofIndex);
			val = this._generatedPose.getByIndex(dofIndex);
			if(val!==null) {
				this._frozenPose.setByIndex(dofIndex, val);
			}
		}else{
			val = this._frozenPose.getByIndex(dofIndex);
		}
		if(val !== null && this._statusReporter !== null && this._statusReporter.shouldReportOnIndex(dofIndex)){
			blackboard.baseBlendMode = LookatBlendGenerator.BlendMode.ABSOLUTE; //TODO: possibly make the relationship of this to base more clear/documented
			blackboard.lookatInfo = this._statusReporter.generateStatus(this._motionLookat);
		}

		return val!=null?val.slice(0):null;
	}
}

export default LookatMotionGenerator;
