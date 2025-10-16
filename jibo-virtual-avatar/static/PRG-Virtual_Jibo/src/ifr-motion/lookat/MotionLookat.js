"use strict";

import Pose from "../base/Pose.js";

/**
 *
 * @param {LookatMotionNode[]} lookatNodes - assumed to be in order root to leaf
 * @param {KinematicGroup} kinematicGroupPrototype
 * @constructor
 */
const MotionLookat = function(lookatNodes, kinematicGroupPrototype){
	var allRequiredDOFs = [];
	var i,j;

	/** @type {LookatMotionNode[]} */
	this._lookatNodes = lookatNodes;
	for(i = 0; i < this._lookatNodes.length; i++){
		var localGroup = kinematicGroupPrototype.getCopy(kinematicGroupPrototype.getModelControlGroup().getRequiredTransformNamesForDOFs(this._lookatNodes[i].getDOFsNeededInKG()), true);
		this._lookatNodes[i].connectToGroup(localGroup);

		//local group will include all required ancestor dofs
		var dofsForThisLook = localGroup.getDOFNames();
		for(j = 0; j < dofsForThisLook.length; j++){
			if(allRequiredDOFs.indexOf(dofsForThisLook[j]) < 0){
				allRequiredDOFs.push(dofsForThisLook[j]);
			}
		}
	}

	/** @type {Pose} */
	this._internalPose = new Pose("LookPose", allRequiredDOFs);

	/** @type {Object.<string,LookatMotionNode>} */
	this._dofToLookatNodeMap = {};
	/** @type {Object.<string,string[]>} */
	this._lookatNodeToDOFsMap = {};

	/**
	 * Array indexed by global dof indices
	 * @type {LookatMotionNode[]}
	 */
	this._dofIndexToLookatNodeMap = [];

	/** @type {Array.<Number[]>} */
	this._lookatNodeIndexToDOFIndices = [];


	for(i = 0; i < this._lookatNodes.length; i++){
		var lookatNode = this._lookatNodes[i];
		var lookatNodeDOFs = this._lookatNodes[i].getDOFs();
		if(this._lookatNodeToDOFsMap.hasOwnProperty(lookatNode.getName())){
			throw new Error("Error, multiple lookat nodes named "+lookatNode.getName());
		}
		this._lookatNodeToDOFsMap[lookatNode.getName()] = lookatNodeDOFs;
		this._lookatNodeIndexToDOFIndices[i] = [];
		for(j = 0; j < lookatNodeDOFs.length; j++){
			var dofName = lookatNodeDOFs[j];
			if(this._dofToLookatNodeMap.hasOwnProperty(dofName)){
				throw new Error("Error, multiple lookat nodes use DOF "+dofName+": "+this._dofToLookatNodeMap[dofName].getName()+" and "+lookatNode.getName());
			}
			this._dofToLookatNodeMap[dofName] = lookatNode;

			var dofIndex = this._internalPose.getDOFIndexForName(dofName);
			this._dofIndexToLookatNodeMap[dofIndex] = lookatNode;
			this._lookatNodeIndexToDOFIndices[i].push(dofIndex);
		}
	}
};

/**
 * Updates state to time, tracking target.
 *
 * @param {Pose} poseCurrentPose - should contain at least nodes of relevance to the computation, e.g. ancestor nodes (and lookat node, if we are initializing after reset)
 * @param {Pose} poseInplaceOut - output values will be stored here (output values unchanged "poseCurrentPose" for unused dofs, preset poseInplaceOut to poseCurrentPose if full pose is to be used)
 * @param {THREE.Vector3} target - target in world space
 * @param {Time} time - time to generate pose for
 */
MotionLookat.prototype.generatePose = function(poseCurrentPose, poseInplaceOut, target, time){
	//if(poseCurrentPose!==poseInplaceOut) {
	//	poseInplaceOut.setPose(poseCurrentPose);
	//}

	//use _internalPose instead of poseInplaceOutput in case it doesn't have required "state" dofs
	this._internalPose.setPose(poseCurrentPose);

	for(var i = 0; i < this._lookatNodes.length; i++){
		this._lookatNodes[i].update(this._internalPose, this._internalPose, target, time);
	}
	poseInplaceOut.setPose(this._internalPose);
};


/**
 * Updates state to time, tracking target.  Only updates the lookat node related to the dof provided.
 * For lookat nodes that control multiple dofs, we rely on the the underlying LookatMotionNodes
 * to cache results and return the same computation again for 2 calls at the same "time".  poseInplaceOut
 * will have results of all dofs for that multi-dof node when any of it's nodes are specified (unless
 * the Pose does not contain those dofs)
 *
 * Caller must take care to update dofs in order (base to leaf), and to not skip dofs that
 * will later be used again before the next reset, as their state tracking will become out
 * of sync.  They must also take care to update all DOFs in use before calling status calls
 * like getDistanceRemaining().
 *
 * @param {Pose} poseCurrentPose - should contain at least nodes of relevance to the computation, e.g. ancestor nodes (and lookat node, if we are initializing after reset)
 * @param {Pose} poseInplaceOut - output values will be stored here (output values unchanged "poseCurrentPose" for unused dofs, preset poseInplaceOut to poseCurrentPose if full pose is to be used)
 * @param {THREE.Vector3} target - target in world space
 * @param {Time} time - time to generate pose for
 * @param {number} dofIndex - only generate state for this dof (if we have no node for this dof, poseInplaceOut will just be poseCurrentPose)
 */
MotionLookat.prototype.generatePoseIncremental = function(poseCurrentPose, poseInplaceOut, target, time, dofIndex){
	//if(poseCurrentPose!==poseInplaceOut) {
	//	poseInplaceOut.setPose(poseCurrentPose);
	//}

	var node = this._dofIndexToLookatNodeMap[dofIndex];
	node.update(poseCurrentPose, poseInplaceOut, target, time);
};

/**
 * Get the most recently computed pose, without updating any state.  This is only valid once initialized
 * via generatePoseIncremental or generatePose have been called (after initial construction or any reset).
 *
 * @param {Pose} poseInplaceOut
 */
MotionLookat.prototype.getPose = function(poseInplaceOut){
	for(var i = 0; i < this._lookatNodes.length; i++){
		var indicesForNode = this._lookatNodeIndexToDOFIndices[i];
		var lookatNode = this._lookatNodes[i];

		//only ask nodes that are in our poseInplaceOut
		for(var j = 0; j < indicesForNode.length; j++){
			if(poseInplaceOut.hasDOFIndex(indicesForNode[j])){
				lookatNode.getPose(poseInplaceOut);
				break;
			}
		}
	}
};

/**
 * Get the individual forward information for the last computed Pose, does not update state.  This is
 * only valid once initialized via generatePoseIncremental or generatePose have been called (after initial
 * construction or any reset).
 *
 * @param {Pose} inplaceAtTarget - provide the forward vals here (a dof will be cleared out if unavailable).  may be null or have incomplete dofs.
 * @param {Pose} inplaceAtCurrent - provide the forward vals at current position (e.g., in progress to target), a dof will by cleared out if unavailable).  may be null or have incomplete dofs.
 */
MotionLookat.prototype.getIndividuallyForwardPose = function(inplaceAtTarget, inplaceAtCurrent){
	for(var i = 0; i < this._lookatNodes.length; i++){
		var indicesForNode = this._lookatNodeIndexToDOFIndices[i];
		var lookatNode = this._lookatNodes[i];

		//only ask nodes that are in our poseInplaceOut
		for(var j = 0; j < indicesForNode.length; j++){
			if((inplaceAtTarget !== null && inplaceAtTarget.hasDOFIndex(indicesForNode[j])) ||
				(inplaceAtCurrent !== null && inplaceAtCurrent.hasDOFIndex(indicesForNode[j]))){
				lookatNode.getIndividuallyForwardPose(inplaceAtTarget, inplaceAtCurrent);
				break;
			}
		}
	}
};



/**
 * Produces the optimal lookat pose, regardless of current state/time.  Does not update state.  Does not apply
 * LookatNodeTargetAdjuster
 *
 * @param {Pose} poseCurrentPose - should contain at least nodes of relevance to the computation, e.g. ancestor nodes
 * @param {Pose} poseInplaceOut - output values will be stored here
 * @param {THREE.Vector3} target - target in world space
 */
MotionLookat.prototype.getOptimalPose = function(poseCurrentPose, poseInplaceOut, target){
	if(poseCurrentPose!==poseInplaceOut) {
		poseInplaceOut.setPose(poseCurrentPose);
	}

	//use _internalPose instead of poseInplaceOutput in case it doesn't have required state dofs
	this._internalPose.setPose(poseCurrentPose);

	for(var i = 0; i < this._lookatNodes.length; i++){
		this._lookatNodes[i].getOptimalPose(this._internalPose, this._internalPose, target);
	}

	poseInplaceOut.setPose(this._internalPose);
};

/**
 * Get the distance remaining for this lookat to travel to the current target.  Does not advance (use update())
 * This value is computed from the data calculated in the last generatePose() call.  The value is the maximum
 * distance remaining for any DOF used in this lookat.
 *
 * @param {string[]} [dofNames] - only count distance on lookats that contain at least one of these dofs.  all nodes checked if omitted/null
 * @return {number} distance of dof with largest remaining distance (as ratio of current distance of total range of LookatDOF)
 */
MotionLookat.prototype.getDistanceRemaining = function(dofNames){
	var i;
	var d;
	var maxD = 0;
	if(dofNames == null) { //null of undefined (eqnull)
		for (i = 0; i < this._lookatNodes.length; i++) {
			d = this._lookatNodes[i].getDistanceRemaining();
			if (d > maxD) {
				maxD = d;
			}
		}
	}else{
		var processed = {};
		for(i = 0; i < dofNames.length; i++){
			var dofName = dofNames[i];
			if(this._dofToLookatNodeMap.hasOwnProperty(dofName)){
				var node = this._dofToLookatNodeMap[dofName];
				if(processed[node.getName()] !== true){
					d = node.getDistanceRemaining();
					if(d > maxD){
						maxD = d;
					}
					processed[node.getName()] = true;
				}
			}
		}
	}
	return maxD;
};

/**
 * True if hold is reached on all dofs selected by the mask argument.
 * Mask argument is indexed by global DOF indices, and a true indicates
 * that the dof at that index is present (and should be included in the hold check)
 *
 * Null mask means check all
 *
 * @param {boolean[]} presenceMask
 */
MotionLookat.prototype.getHoldReached = function(presenceMask){
	var i, j;
	var holdingAll = true;
	var lookatNodes = this._lookatNodes;
	if(presenceMask == null){
		for(i = 0; i < lookatNodes.length; i++){
			if(!lookatNodes[i].getInHoldMode()){
				holdingAll = false;
				break;
			}
		}
	}else{
		var includeNode;
		var indicesForNode;
		var lookatNode;

		for(i = 0; i < lookatNodes.length; i++){
			includeNode = false;
			indicesForNode = this._lookatNodeIndexToDOFIndices[i];
			lookatNode = this._lookatNodes[i];

			for(j = 0; j < indicesForNode.length; j++){
				if(presenceMask[indicesForNode[j]]){
					includeNode = true;
					break;
				}
			}

			if(includeNode && !lookatNode.getInHoldMode()){
				holdingAll = false;
				break;
			}
		}
	}
	return holdingAll;
};

/**
 * True if hold is reached on node related to provided dof index.  data relates to last
 * update of the lookatnode
 *
 * @param {number} dofIndex
 * @return {?boolean}
 */
MotionLookat.prototype.getHoldReachedForDOFIndex = function(dofIndex){
	var lookatNode = this._dofIndexToLookatNodeMap[dofIndex];
	if(lookatNode !== undefined) {
		return lookatNode.getInHoldMode();
	}else {
		return null;
	}
};

/**
 * True if hold is node related to provided dof index is in tracking mode.
 * data relates to last update of the node.
 *
 * @param {number} dofIndex
 * @return {?boolean}
 */
MotionLookat.prototype.getIsTrackingForDOFIndex = function(dofIndex){
	var lookatNode = this._dofIndexToLookatNodeMap[dofIndex];
	if(lookatNode !== undefined) {
		return lookatNode.getInTrackMode();
	}else {
		return null;
	}
};



/**
 * @return {string[]} dof names that can be affected by this lookat
 */
MotionLookat.prototype.getDOFs = function(){
	var dofNames = [];
	for(var i = 0; i < this._lookatNodes.length; i++) {
		dofNames = dofNames.concat(this._lookatNodes[i].getDOFs());
	}
	return dofNames;
};

/**
 * @returns {Array.<string>} all dof names that this lookat affects, or that can affect this lookat (ancestors)
 */
MotionLookat.prototype.getStateDOFs = function(){
	return this._internalPose.getDOFNames();
};

MotionLookat.prototype.reset = function(){
	for(var i = 0; i < this._lookatNodes.length; i++){
		this._lookatNodes[i].reset();
	}
};

export default MotionLookat;