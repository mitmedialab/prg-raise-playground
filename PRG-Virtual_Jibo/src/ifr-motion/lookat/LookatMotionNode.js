"use strict";

import PoseOffsetFilterWindup from "./PoseOffsetFilterWindup.js";
import Pose from "../base/Pose.js";
import slog from "../../ifr-core/SLog.js";
import THREE from "@jibo/three";
import LookatNode from "./LookatNode.js";
import LookatNodeDistanceReport from "./LookatNodeDistanceReport.js";
import LookatNodeTrackPolicy from "./trackpolicy/LookatNodeTrackPolicy.js";
import TrackPolicyTriggerAlways from "./trackpolicy/TrackPolicyTriggerAlways.js";


/**
 * Enum Values for look stabilization modes, for use with LookatMotionNode's constructor.
 * @enum {string}
 */
const LookStabilizationMode = {
	/**
	 * Use point-at stabilization relative to current target.
	 */
	POINT_TARGET: "POINT_TARGET",
	/**
	 * Use point-st stabilization relative to node forward.
	 */
	POINT_FORWARD: "POINT_FORWARD",
	/**
	 * Use point-at from target when it scores stable, forward relative otherwise
	 */
	POINT_AUTO: "POINT_AUTO",
	/**
	 * Stabilizer doesn't need a target; none will be computed
	 */
	UNTARGETED: "UNTARGETED"
};



/**
 *
 * @param {LookatNode} lookatNode - assumed to be in order root to leaf
 * @param {DOFGlobalAlignment} dofAligner
 * @param {number} accel - acceleration value for this node
 * @param {OcularStabilizationTracker} stabilizer - specify stabilizer
 * @param {LookStabilizationMode} stabilizationMode - specify stabilization mode
 * @param {LookatNodeTrackPolicy} trackPolicy
 * @param {LookatBlinkManager} [blinkManager]
 * @param {LookatNodeTargetAdjuster} [targetAdjuster]
 * @param {LookatWindupPolicy} [windupPolicy]
 * @param {WorldTargetAdjuster} [worldTargetAdjuster]
 * @constructor
 */
const LookatMotionNode = function(lookatNode, dofAligner, accel, stabilizer, stabilizationMode, trackPolicy, blinkManager, targetAdjuster, windupPolicy, worldTargetAdjuster){
	/** @type {LookatNode} */
	this._lookatNode = lookatNode;

	/** @type {OcularStabilizationTracker} */
	this._stabilization = stabilizer;

	var lookatNodeDOFs = lookatNode.getDOFs();
	/** @type {PoseOffsetFilterWindup} */
	this._filter = new PoseOffsetFilterWindup(lookatNodeDOFs);
	this._filter.setRejectVelocityThreshold(20);
	if(accel!=null){
		this._filter.setAcceleration(accel);
	}

	/** @type {Time} */
	this._lastUpdateTime = null;

	/** @type {Pose} */
	this._optimalPose = new Pose("LMN Optimal", lookatNodeDOFs);

	/** @type {Pose} */
	this._tempPose = new Pose("LMN Temp", lookatNodeDOFs);

	/** @type {THREE.Vector3} */
	this._stabilizationTarget = new THREE.Vector3();

	/** @type {Pose} */
	this._poseForStabilizationTarget = new Pose("Pose For ST", lookatNodeDOFs);

	/** @type {Pose} */
	this._holdPose = new Pose("Hold Pose", lookatNodeDOFs);

	/**
	 * This will get created when we connect to a hierarchy (then it will have minimal dofs necessary)
	 * @type {Pose}
	 */
	this._lastInputPose = null;
	//this._lastReturnedPose = new Pose("Last Returned", lookatNodeDOFs);

	/**
	 * This will get created when we connect to a hierarchy (then it will have minimal dofs necessary)
	 * @type {Pose}
	 */
	this._currentPoseIncludingOurContribution = null;

	/** @type {LookatNodeTrackPolicy} */
	this._lookatTrackPolicy = trackPolicy;
	if(this._lookatTrackPolicy == null){ //null or undefined (eqnull)
		this._lookatTrackPolicy = new LookatNodeTrackPolicy([new TrackPolicyTriggerAlways()]);
	}

	/** @type {LookatBlinkManager} */
	this._blinkManager = null;
	if(blinkManager != null){ //null or undefined (eqnull)
		this._blinkManager = blinkManager;
	}

	/** @type {LookatNodeTargetAdjuster} */
	this._targetAdjuster = null;
	if(targetAdjuster != null){ //null or undefined (eqnull)
		this._targetAdjuster = targetAdjuster;
	}

	/**
	 * holds the optimal pose adjusted by the targetAdjuster, if present.  (e.g., lazier looking)
	 * @type {Pose}
	 */
	this._adjustedOptimalPose = this._optimalPose;
	//if we have no target adjuster, save time by having these be the same pose and not copying later
	if(targetAdjuster!=null){
		//if we do have a target adjuster, this must be its own distinct pose
		this._adjustedOptimalPose = new Pose("LMN Adjusted Optimal", lookatNodeDOFs);
	}

	/** @type {DOFGlobalAlignment} */
	this._dofAligner = dofAligner;

	/**
	 * stabilization mode
	 * @type {LookStabilizationMode} */
	this._stabilizationMode = stabilizationMode;

	/**
	 * @type {LookatWindupPolicy}
	 * @private
	 */
	this._lookatWindupPolicy = null;
	if(windupPolicy != null){ //null or undefined (eqnull)
		this._lookatWindupPolicy = windupPolicy;
		this._lookatWindupPolicy.configureFilter(this._filter);
	}

	/**
	 * @type {WorldTargetAdjuster}
	 * @private
	 */
	this._worldTargetAdjuster = null;
	if(worldTargetAdjuster != null){
		this._worldTargetAdjuster = worldTargetAdjuster;
	}

	/**
	 * @type {LookatNodeDistanceReport}
	 * @private
	 */
	this._lookatNodeDistanceReport = new LookatNodeDistanceReport();

	/**
	 * @type {TrackMode}
	 * @private
	 */
	this._trackMode = LookatNodeTrackPolicy.TrackMode.TRACK;


	this._individuallyForwardPose = new Pose("Individually Forward", lookatNodeDOFs);

	///**
	// * @type {function}
	// * @private
	// */
	//this._infoListener = null;
};

LookatMotionNode.LookStabilizationMode = LookStabilizationMode;

/**
 * Connect to this group.  Best to provide a group with the minimal dofs required,
 * e.g., the ones that this node uses/modifies plus any ancestors.
 * @param {KinematicGroup} kinematicGroup
 */
LookatMotionNode.prototype.connectToGroup = function(kinematicGroup){
	//init poses here that want to have minimal dofs but include all ancestors
	this._lastInputPose = new Pose("Last Input", kinematicGroup.getDOFNames());//, kinematicGroup.getDOFNames());

	//give initial values here so we don't have to check for init every update
	//_lastInputPose is just used to zero out jitter, so we don't need to worry about the initial value
	//(input is pulled to this value if VERY close)
	for(var i = 0; i < this._lastInputPose.dofIndices.length; i++){
		this._lastInputPose.setByIndex(this._lastInputPose.dofIndices[i], 0, 0);
	}

	this._currentPoseIncludingOurContribution = new Pose("Current Including Us", kinematicGroup.getDOFNames());

	this._lookatNode.connectToGroup(kinematicGroup);
};


/**
 * Update state to the current time and produce the new filtered pose.
 * If called twice at the same "time", second call will not recompute,
 * and will instead return the same pose.
 *
 * @param {Pose} currentPose - use parents' position from here to compute our values.  velocities and positions of currentPose (our node and parents) must be correct on first update after reset! (initialization update)
 * @param {Pose} inplaceOutput
 * @param {THREE.Vector3} target
 * @param {Time} time
 */
LookatMotionNode.prototype.update = function(currentPose, inplaceOutput, target, time){

	if(this._lastUpdateTime !== null && time.equals(this._lastUpdateTime)){
		this._filter.getValue(inplaceOutput);
		return;
	}


	//configure default pose (to use as "optimal" if we can't make a computation this tick)
	//also set current pose to include our contribution from last time
	var defaultPose;

	if(this._lastUpdateTime === null){
		//not initialized, must make do
		defaultPose = currentPose;
	}else{
		//initialized, previous optimal will be a good default for uncomputable joints
		defaultPose = this._optimalPose;

		//if it is the first tick, currentPose will be set correctly already.
		//if it is not the first tick, current will not contain our contribution to the dofs, as it is our job to add it
		//however, we want "current" to be representative of the current WRT this system's output (excluding later additions.
		// (e.g., the value we would return that would keep the robot in place)
		//so, we set change current to have our output from last time.

		this._currentPoseIncludingOurContribution.setPose(currentPose);
		this._filter.getValue(this._currentPoseIncludingOurContribution);
		currentPose = this._currentPoseIncludingOurContribution;
	}

	/////don't pass through numeric jitter; it will invalidate everyone's caching for no real gain/////
	var dofIndices = this._lastInputPose.getDOFIndices();
	var distance = 0;
	for(var i = 0; i < dofIndices.length; i++){
		distance += Math.abs(this._lastInputPose.getByIndex(dofIndices[i], 0) - currentPose.getByIndex(dofIndices[i], 0));
	}
	if(distance <= 0.000001){ //0.00007
		currentPose = this._lastInputPose;
		//console.log("Freezing "+this.getName()+" to top:"+currentPose.get("topSection_r", 0)+", mid:"+currentPose.get("middleSection_r", 0)+", bottom:"+currentPose.get("bottomSection_r", 0));
	}else{
		this._lastInputPose.setPose(currentPose);
	}
	////numeric jitter accounted for///////////////

	if(this._worldTargetAdjuster !== null){
		var adjustedWorldTarget = this._worldTargetAdjuster.getAdjustedTarget(currentPose, target);
		if(adjustedWorldTarget !== null){
			target = adjustedWorldTarget;
		}
	}




	var report = new LookatNode.PointNodeReport();

	this._lookatNode.getPose(currentPose, this._optimalPose, target, defaultPose, report, this._lastUpdateTime===null?null:this._optimalPose);

	this._lookatNode.getIndividuallyForwardPose(this._individuallyForwardPose);


	//modify optimal based on target modifier (e.g., our target may be lazier than geometrical optimal, etc.)
	if(this._targetAdjuster!==null) {
		if (this._lastUpdateTime === null) {
			//first tick, currentPose will be our actual currentPose including our own dofs
			this._targetAdjuster.adjustTarget(this._optimalPose, currentPose, target, this._dofAligner, this._adjustedOptimalPose);
		} else {
			//we are in progress, currentPose may not contain our contribution,
			// use the filter to get our last output value
			this._filter.getValue(this._tempPose);
			this._targetAdjuster.adjustTarget(this._optimalPose, this._tempPose, target, this._dofAligner, this._adjustedOptimalPose);
		}
		//console.log("Adjusted target from "+this._optimalPose+" to "+this._adjustedOptimalPose);
	}

	if(this._stabilization !== null && this._stabilizationMode !== LookStabilizationMode.UNTARGETED) {
		if(this._stabilizationMode === LookStabilizationMode.POINT_FORWARD ||
			(this._stabilizationMode === LookStabilizationMode.POINT_AUTO &&
			(report._targetStability < 0.2 || !report._pointSucceeded))){
			if(this._stabilizationMode === LookStabilizationMode.POINT_AUTO){
				slog.info("Stabilization AUTO mode for "+this.getName()+" falling back to FORWARD with stability "+report._targetStability+", pointSuccess="+report._pointSucceeded);
			}
			this._lookatNode.suggestForwardTarget(currentPose, this._stabilizationTarget);
			this._lookatNode.getPose(currentPose, this._poseForStabilizationTarget, this._stabilizationTarget, defaultPose, null, this._lastUpdateTime===null?null:this._poseForStabilizationTarget);
		}else{
			this._stabilizationTarget.copy(target);
			this._poseForStabilizationTarget.setPose(this._optimalPose);
		}
	}

	//hold is hold, but already stabilized

	if(this._lastUpdateTime === null){

		//init hold pose to the state at the start
		this._holdPose.setPose(currentPose);

		this._lookatTrackPolicy.reset();

		if(this._stabilization!==null) {
			this._stabilization.reset();
			this._stabilization.computeStabilizationDelta(currentPose, this._poseForStabilizationTarget, this._stabilizationTarget); //initialize for next time
			this._tempPose.setPose(currentPose);

			this._stabilization.decomposeVelocity(currentPose, this._tempPose, this._stabilizationTarget, this._filter.getRejectVelocityThreshold());
			//tempPose has velocity removed that will later be added back in by the stabilization delta.
			//console.log("Lookat Initting " + this.getName() + " stabilized(world space):" + this._tempPose.toString());
			this._filter.resetToPose(this._tempPose);
		}else{
			this._filter.resetToPose(currentPose);
		}

	}else{
		var dTime = time.subtract(this._lastUpdateTime);

		this._filter.getTarget(this._tempPose);
		this._dofAligner.refineToLocallyClosestTargetPose(this._tempPose, this._adjustedOptimalPose);

		if(this._stabilization!==null) {
			var delta = this._stabilization.computeStabilizationDelta(currentPose, this._poseForStabilizationTarget, this._stabilizationTarget);
			//console.log("Lookat Node " + this.getName() + " has stabilization delta " + delta.toString());
			//var delta = new Pose("temp", currentPose.getDOFNames());
			this._filter.applyUnfilteredOffset(delta, dTime);
			Pose.add(this._holdPose, delta, false, this._holdPose);
		}

		this._filter.getValue(this._tempPose, true);//grab current filter value to check our progress
		this._lookatNodeDistanceReport.compute(this._holdPose, this._adjustedOptimalPose, this._tempPose);
		this._trackMode = this._lookatTrackPolicy.computeMode(this._lookatNodeDistanceReport, time);
		if(this._lookatWindupPolicy !== null){
			var shouldTriggerWindup = this._lookatWindupPolicy.shouldWindup(this._lookatNodeDistanceReport, this._trackMode, time, target);
			if(shouldTriggerWindup){
				this._filter.startWindupIfPossible();
			}
		}

		var updateHoldPose = false;
		if(this._trackMode === LookatNodeTrackPolicy.TrackMode.HOLD || this._trackMode === LookatNodeTrackPolicy.TrackMode.DELAY){
			this._filter.setTarget(this._holdPose);
		}else{
			this._filter.setTarget(this._adjustedOptimalPose);
			updateHoldPose = true;
		}

		this._filter.updateByTime(dTime);

		//we update blinkManager after updateByTime, because the filter won't compute its windup
		//params until this point, and blink may depend on windup state.
		if(this._blinkManager !== null){
			var windupState = null;
			if(this._lookatWindupPolicy !== null){
				windupState = this._filter.getWindupState();
			}
			this._blinkManager.update(this._lookatNodeDistanceReport, this._trackMode, windupState, time);
		}

		if(updateHoldPose){
			this._filter.getValue(this._holdPose);
		}
	}

	if(inplaceOutput!=null){ //null or undefined (eqnull)
		this._filter.getValue(inplaceOutput);
		//if(this._infoListener!==null){
		//	var theDOFs = this.getDOFs();
		//	for(var k = 0; k < theDOFs.length; k++) {
		//		var theDOF = theDOFs[k];
		//		this._infoListener({
		//			dofName: theDOF,
		//			timestamp: time,
		//			currentPosition: currentPose.get(theDOF, 0),
		//			optimalPosition: this._optimalPose.get(theDOF, 0),
		//			adjustedOptimal: this._adjustedOptimalPose.get(theDOF, 0),
		//			filteredPosition: inplaceOutput.get(theDOF, 0),
		//			stabilizationDelta: delta!=null?delta.get(theDOF, 0):0,
		//			solution1: report.solution1!=undefined?report.solution1:0,
		//			solution2: report.solution2!=undefined?report.solution2:0
		//		});
		//	}
		//}
	}



	this._lastUpdateTime = time;
};

/**
 * Produces the optimal lookat pose, regardless of current state/time.  Does not update state.  Does not apply
 * LookatNodeTargetAdjuster
 *
 * @param {Pose} currentPose
 * @param {Pose} inplaceOutput
 * @param {THREE.Vector3} target
 */
LookatMotionNode.prototype.getOptimalPose = function(currentPose, inplaceOutput, target) {
	var defaultPose;

	if(this._lastUpdateTime === null){
		//not initialized, must make do
		defaultPose = currentPose;
	}else{
		//initialized, previous optimal will be a good default for uncomputable joints
		defaultPose = this._optimalPose;
	}

	this._lookatNode.getPose(currentPose, inplaceOutput, target, defaultPose);
};

/**
 * Get the latest computed pose.  Does not advance (use update()).  Only
 * valid after initialized, typically by first call to update() after init or reset.
 *
 * @param {Pose} inplaceOutput
 */
LookatMotionNode.prototype.getPose = function(inplaceOutput){
	if(this._lastUpdateTime === null){
		slog.error("LookatMotionNode asked \"getPose()\" before initialization");
	}
	this._filter.getValue(inplaceOutput);
};

/**
 * Get the individual forward information for the last computed Pose, does not update state.  Only valid
 * after initialization.
 *
 * @param {Pose} inplaceAtTarget - provide the forward vals here (a dof will be cleared out if unavailable).  May be null or have incomplete dofs.
 * @param {Pose} inplaceAtCurrent - provide the forward vals at current position (e.g., in progress to target), a dof will by cleared out if unavailable). May be null or have incomplete dofs.
 */
LookatMotionNode.prototype.getIndividuallyForwardPose = function(inplaceAtTarget, inplaceAtCurrent){
	if(this._lastUpdateTime === null){
		slog.error("LookatMotionNode asked \"getIndividuallyForwardPose()\" before initialization");
	}
	if(inplaceAtCurrent!==null) {
		if (this._lookatNode.valsAreIndividuallyForward()) {
			this._filter.getValue(inplaceAtCurrent);
		} else {
			inplaceAtCurrent.clear();
		}
	}
	if(inplaceAtTarget!==null) {
		///don't get right now, get the one cached after the optimal computation,
		//so it is not polluted by the later getPoses that may be used for stabilization etc.
		this._individuallyForwardPose.getPose(inplaceAtTarget);
	}
};


/**
 * Get the distance remaining from filtered to optimal.  Does not advance (use update())
 * This value is computed from the data calculated in the last update() call.
 *
 * This is the distance to the adjusted optimal pose, e.g., if we have target undershoot enabled,
 * and we have gotten to our proper undershot target (short of actual target), this value will be approaching zero.
 *
 * @return {number} distance of dof with largest remaining distance (as ratio of current distance of total range of LookatDOF)
 */
LookatMotionNode.prototype.getDistanceRemaining = function(){
	if(this._lastUpdateTime === null){
		slog.error("LookatMotionNode asked \"getDistanceRemaining()\" before initialization");
	}
	this._filter.getValue(this._tempPose);
	return this._lookatNode.distanceAsRatio(this._tempPose, this._adjustedOptimalPose);
};


/**
 * Get all the dofs that are modified by this node
 * @return {string[]}
 */
LookatMotionNode.prototype.getDOFs = function(){
	return this._lookatNode.getDOFs();
};

/**
 * Get all the dofs that are needed in the provided kinematic group
 * (may include dofs that will not be modified by this node)
 * @return {string[]}
 */
LookatMotionNode.prototype.getDOFsNeededInKG = function(){
	return this._lookatNode.getDOFsNeededInKG();
};


LookatMotionNode.prototype.reset = function(){
	this._lastUpdateTime = null;
	this._trackMode = LookatNodeTrackPolicy.TrackMode.TRACK;
};

LookatMotionNode.prototype.getName = function(){
	return this._lookatNode.getName();
};

/**
 * The the track mode as of the last update of this node.
 * (Nodes are initted in TRACK before their first update)
 * @returns {TrackMode}
 */
LookatMotionNode.prototype.getTrackMode = function(){
	return this._trackMode;
};

/**
 * True if this node is in HOLD mode as of the last update of this node.  NOTE: node can be in DELAY mode, which
 * means it is not moving but expects to.  For certain discomfort configurations
 * this period could last a significant time.
 * (nodes are initted in TRACK before their first update)
 * @returns {boolean}
 */
LookatMotionNode.prototype.getInHoldMode = function(){
	return this._trackMode === LookatNodeTrackPolicy.TrackMode.HOLD;
};

/**
 * True if this node is in TRACK mode as of the last update of this node.  NOTE: node can be in DELAY mode, which
 * means it is not moving but expects to.  For certain discomfort configurations
 * this period could last a significant time.
 *
 * To avoid false-positive on tracking mode (we start in track mode) we will and with whether the track policy
 * has been updated since the last reset.
 *
 * @returns {boolean}
 */
LookatMotionNode.prototype.getInTrackMode = function(){
	return this._trackMode === LookatNodeTrackPolicy.TrackMode.TRACK && (this._lookatTrackPolicy === null || this._lookatTrackPolicy.hasBeenUpdatedSinceReset());
};


export default LookatMotionNode;