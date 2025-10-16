"use strict";

/**
 * @type {?Object.<string, number>}
 */
let namesToIndex = null;

/**
 * @type {?string[]}
 */
let indexToName = null;

/**
 * @type {?number}
 */
let globalNumDOFs = null;

const globalSetup = function(dofNames){
	//console.log("Global setup of Pose with "+dofNames.toString());
	globalNumDOFs = dofNames.length;
	namesToIndex = {};
	indexToName = new Array(globalNumDOFs);
	for(var i = 0; i < globalNumDOFs; i++){
		namesToIndex[dofNames[i]] = i;
		indexToName[i] = dofNames[i];
	}
};

const numericComparator = function(number1, number2){
	return number1 - number2;
};

const setupDOFNamesFromNames = function(pose, dofNames) {
	var dofIndex, i;
	if (pose.dofNames !== null) {
		throw new Error("Cannot re-setup pose with new dofnames!");
	}
	if (namesToIndex === null) {
		throw new Error("Pose used before __globalSetup!");
	}
	//pose.dofNames = dofNames;
	var numDOFsThisPose = dofNames.length;
	pose.dofIndices = new Array(numDOFsThisPose);
	pose.dofPresent = new Array(globalNumDOFs);
	pose.dofVals = new Array(globalNumDOFs);
	for (dofIndex = 0; dofIndex < globalNumDOFs; dofIndex++) {
		pose.dofPresent[dofIndex] = false;
	}
	for (i = 0; i < numDOFsThisPose; i++) {
		dofIndex = namesToIndex[dofNames[i]];
		if (typeof dofIndex === "undefined") {
			throw new Error("Cannot use DOF " + dofNames[i] + ", not in dofset!");
		}
		pose.dofIndices[i] = dofIndex;
		pose.dofPresent[dofIndex] = true;
		pose.dofVals[dofIndex] = [];
	}
	pose.dofIndices.sort(numericComparator);
	pose.dofNames = new Array(numDOFsThisPose);
	for (i = 0; i < numDOFsThisPose; i++) {
		pose.dofNames[i] = indexToName[pose.dofIndices[i]];
	}

	//now we have:
	//Arrays of globalNumDOF length, indexed by global indices:
	//  dofPresent, dofVals
	//Arrays of length dofNames.length (the dofs we have present), indexed in ascending order
	//by their entries in the global dofs index table:
	//  dofNames, dofIndices
};

/**
 * @param {string} name the name of this pose
 * @param {Array.<string>} [dofNames=null] array of DOF names that this pose will store values for (use null for lazy-init via setPose)
 * @constructor
 */
const Pose = function(name, dofNames)
{
	/** @type {string} */
	this.name = name;
	/** @type {Array.<string>} */
	this.dofNames = null;
	/** @type {Array.<number>} */
	this.dofIndices = null;
	/** @type {Array.<boolean>} */
	this.dofPresent = null;

	/** @type {Object.<number, Array>} */
	this.dofVals = null;

	if((dofNames !== undefined)){
		setupDOFNamesFromNames(this, dofNames);
	}
};

/**
 * Set all entries in this Pose to the values contained in the specified pose.  DOF entries in
 * this pose not contained in the specified pose are left as is.
 *
 * If this pose was constructed with a null array of DOF names (lazy-init), then the first time this function is
 * called the local set of entries will be copied fully from the specified pose; subsequent calls
 * will behave as normal with this set of entries/DOF names.
 *
 * @param {Pose} pose pose to copy values from into this instance
 */
Pose.prototype.setPose = function(pose)
{
	if (this.dofNames === null)
	{
		setupDOFNamesFromNames(this, pose.dofNames);
	}

	for (var i=0; i<this.dofIndices.length; i++)
	{
		var dofIndex = this.dofIndices[i];
		if (pose.dofPresent[dofIndex])
		{
			var v = pose.dofVals[dofIndex];
			var myV = this.dofVals[dofIndex];
			for(var j = 0; j < v.length; j++){
				myV[j] = v[j];
			}
			myV.length = v.length;
		}
	}
};

/**
 * Set all 0th position entries in this Pose to the values contained in the specified pose.  DOF entries in
 * this pose not contained in the specified pose are left as is.
 *
 * If an element in this pose has 1+ slot data but the incoming pose has no data at all for that dof,
 * this pose will get a null in the 0th slot to preserve the 1+ slots.
 *
 * @param {Pose} pose - pose to copy values from into this instance
 */
Pose.prototype.setPose0Only = function(pose)
{
	for (var i=0; i<this.dofIndices.length; i++)
	{
		var dofIndex = this.dofIndices[i];
		if (pose.dofPresent[dofIndex])
		{
			var v = pose.dofVals[dofIndex];
			var myV = this.dofVals[dofIndex];
			if(v.length > 0){
				myV[0] = v[0];
			}else if(myV.length > 1){
				myV[0] = null;
			}else{
				myV.length = 0;
			}
		}
	}
};

/**
 * @param {Pose} inplacePose pose to copy this instance's values into
 */
Pose.prototype.getPose = function(inplacePose)
{
	inplacePose.setPose(this);
};

/**
 * Set the entry for the specified DOF name to the specified value.  If the specified DOF name
 * is not an element of this pose, this call has no effect.
 *
 * If derivativeIndex is specified, value is interpreted as a specific element in the DOF's
 * position-derivative array.  If derivativeIndex is left undefined, value must specify the
 * DOF's full position-derivative array.
 *
 * @param {string} dofName name of the DOF entry to set
 * @param {Array|*} value DOF value to set: either the full position-derivative array, or (if derivativeIndex is specified) a single element in the position-derivative array
 * @param {number} [derivativeIndex] derivative index of the specified value (e.g. 0 for position, 1 for first derivative, 2 for second derivative, etc.)
 */
Pose.prototype.set = function(dofName, value, derivativeIndex)
{
	var dofIndex = namesToIndex[dofName];
	if(this.dofPresent[dofIndex]){
		if(derivativeIndex !== undefined){
			this.dofVals[dofIndex][derivativeIndex] = value;
		}else{
			this.dofVals[dofIndex] = value;
		}
	}
};

/**
 * Set the entry for the specified DOF to the specified value.  If the specified DOF
 * is not an element of this pose, this call has no effect.
 *
 * If derivativeIndex is specified, value is interpreted as a specific element in the DOF's
 * position-derivative array.  If derivativeIndex is left undefined, value must specify the
 * DOF's full position-derivative array.
 *
 * @param {number} dofIndex name of the DOF entry to set
 * @param {Array|*} value DOF value to set: either the full position-derivative array, or (if derivativeIndex is specified) a single element in the position-derivative array
 * @param {number} [derivativeIndex] derivative index of the specified value (e.g. 0 for position, 1 for first derivative, 2 for second derivative, etc.)
 */
Pose.prototype.setByIndex = function(dofIndex, value, derivativeIndex)
{
	if(this.dofPresent[dofIndex]){
		if(derivativeIndex !== undefined){
			this.dofVals[dofIndex][derivativeIndex] = value;
		}else{
			this.dofVals[dofIndex] = value;
		}
	}
};

/**
 * Get the value for the specified DOF.  If the specified DOF is not an
 * element of this pose, null is returned.
 *
 * If derivativeIndex is specified, this call will return the specified element of the DOF's
 * position-derivative array, or null if no such element exists.
 *
 * @param {string} dofName name of the DOF value to get
 * @param {number} [derivativeIndex] derivative index to get (e.g. 0 for position, 1 for first derivative, 2 for second derivative, etc.)
 * @return {Array|*} the requested DOF value, or null if not present
 */
Pose.prototype.get = function(dofName, derivativeIndex)
{
	var dofIndex = namesToIndex[dofName];
	if (this.dofPresent[dofIndex]){
		var dofVal = this.dofVals[dofIndex];
		if (derivativeIndex !== undefined)
		{
			if(derivativeIndex >= dofVal.length)
			{
				return null;
			}
			else
			{
				return dofVal[derivativeIndex];
			}
		}
		else
		{
			return dofVal;
		}
	}
	else
	{
		return null;
	}
};

/**
 * Get the value for the specified DOF.  If the specified DOF is not an
 * element of this pose, null is returned.
 *
 * If derivativeIndex is specified, this call will return the specified element of the DOF's
 * position-derivative array, or null if no such element exists.
 *
 * @param {number} dofIndex global index of the dof to get
 * @param {number} [derivativeIndex] derivative index to get (e.g. 0 for position, 1 for first derivative, 2 for second derivative, etc.)
 * @return {Array|*} the requested DOF value, or null if not present
 */
Pose.prototype.getByIndex = function(dofIndex, derivativeIndex)
{
	if (this.dofPresent[dofIndex]){
		var dofVal = this.dofVals[dofIndex];
		if (derivativeIndex !== undefined)
		{
			if(derivativeIndex >= dofVal.length)
			{
				return null;
			}
			else
			{
				return dofVal[derivativeIndex];
			}
		}
		else
		{
			return dofVal;
		}
	}
	else
	{
		return null;
	}
};

/**
 * True if this pose includes the dof represented by dofIndex.  Not this does not
 * necessarily mean the pose has a value for this dof currently
 *
 * @param {number} dofIndex
 * @returns {boolean}
 */
Pose.prototype.hasDOFIndex = function(dofIndex){
	return this.dofPresent[dofIndex];
};

/**
 * True if this pose includes the dof represented by dofIndex, and has a value
 * in the derivative index specified
 *
 * @param {number} dofIndex
 * @param {number} derivativeIndex
 * @returns {boolean}
 */
Pose.prototype.hasValueForDOFIndex = function(dofIndex, derivativeIndex){
	return this.dofPresent[dofIndex] && this.dofVals[dofIndex].length > derivativeIndex;
};

/**
 * @return {string} the name of this pose
 */
Pose.prototype.getName = function()
{
	return this.name;
};

/**
 * @return {Array.<string>} the array of DOF names that this pose stores values for
 */
Pose.prototype.getDOFNames = function()
{
	return this.dofNames;
};

/**
 * @return {Array.<number>} the array of DOF indices that this pose stores values for
 */
Pose.prototype.getDOFIndices = function()
{
	return this.dofIndices;
};

/**
 * clear the DOF values stored in this pose
 */
Pose.prototype.clear = function()
{
	if (this.dofNames !== null)
	{
		for (var i=0; i<this.dofIndices.length; i++)
		{
			this.dofVals[this.dofIndices[i]].length = 0;
		}
	}
};

/**
 * Get a copy of this pose that does not share any reps.
 *
 * @param {string} [name] - optional, will use original name if omitted
 * @return {Pose}
 */
Pose.prototype.getCopy = function(name){
	var p = new Pose(name!=null?name:this.name); //null or undefined (eqnull)

	var originalDOFNames = this.dofNames;
	var originalDOFIndices = this.dofIndices;
	var originalDOFPresent = this.dofPresent;
	var numDOFs = originalDOFNames.length;
	var copiedDOFNames = new Array(numDOFs);
	var copiedDOFIndices = new Array(numDOFs);
	var copiedDOFPresent = new Array(globalNumDOFs);
	for(var i = 0; i < numDOFs; i++){
		copiedDOFNames[i] = originalDOFNames[i];
		copiedDOFIndices[i] = originalDOFIndices[i];
	}
	for(var k = 0; k < globalNumDOFs; k++){
		copiedDOFPresent[k] = originalDOFPresent[k];
	}
	p.dofNames = copiedDOFNames;
	p.dofIndices = copiedDOFIndices;
	p.dofPresent = copiedDOFPresent;
	p.dofVals = new Array(numDOFs);

	for (var ii=0; ii< numDOFs; ii++)
	{
		var dofIndex = originalDOFIndices[ii];
		var origVal = this.dofVals[dofIndex];
		var newVal = new Array(origVal.length);
		for(var j = 0; j < origVal.length; j++){
			newVal[j] = origVal[j];
		}
		p.dofVals[dofIndex] = newVal;
	}
	return p;
};

/**
 * Returns true if the other Pose represents the same dof subset and it has the same
 * values for those dofs.  Assumes both are already set up with a dofset.
 *
 * @param {Pose} otherPose
 * @return {boolean}
 */
Pose.prototype.equals = function(otherPose){
	var i, j;
	if(this.dofIndices.length === otherPose.dofIndices.length){ //they muse have the same number of represented dofs

		for(i = 0; i < this.dofIndices.length; i++){

			if(this.dofIndices[i] === otherPose.dofIndices[i]){ //they each must be the same dof as the other pose

				var globalIndex = this.dofIndices[i];

				var myDV = this.dofVals[globalIndex];
				var otherDV = otherPose.dofVals[globalIndex];
				if(myDV.length === otherDV.length) { //and have the same number of vals (pos, vel, etc.)

					for (j = 0; j < myDV.length; j++) {
						if (myDV[j] !== otherDV[j]) { //and, be equal!
							return false;
						}
					}

				}else{
					return false;
				}
			}else{
				return false;
			}
		}

	}else{
		return false;
	}
	return true;
};

/**
 * Returns true if the other Pose represents the same dof subset and it has the same
 * values for the 0th slot for represented dofs.  Assumes both are already set up with a dofset.
 *
 * @param {Pose} otherPose
 * @return {boolean}
 */
Pose.prototype.equals0Only = function(otherPose){
	var i;
	if(this.dofIndices.length === otherPose.dofIndices.length){ //they muse have the same number of represented dofs

		for(i = 0; i < this.dofIndices.length; i++){
			if(this.dofIndices[i] === otherPose.dofIndices[i]){ //they each must be the same dof as the other pose

				var globalIndex = this.dofIndices[i];

				var myDV = this.dofVals[globalIndex];
				var otherDV = otherPose.dofVals[globalIndex];

				if(myDV.length>0 && otherDV.length>0) { //and either both have a 0th value for the dof

						if (myDV[0] !== otherDV[0]) { //and, be equal!
							return false;
						}

				}else if(myDV.length!==otherDV.length) { //or, one has a value and the other doesn't, not equal
					return false;
				}//final case: both don't have a value, OK

			}else{
				return false;
			}
		}

	}else{
		return false;
	}
	return true;
};

/**
 * Returns true if the other Pose contains no information that would change this Pose if
 * it was passed in with setPose.  That is, any overlapping dofs have the same values as
 * this Pose.
 *
 * @param {Pose} otherPose
 * @return {boolean}
 */
Pose.prototype.equalsNoChange = function(otherPose){
	var i, j;

	for(i = 0; i < this.dofIndices.length; i++) {

		var globalIndex = this.dofIndices[i];

		if (otherPose.dofPresent[globalIndex]) { //if other pose has it, it could be different, need to check
			var myDV = this.dofVals[globalIndex];
			var otherDV = otherPose.dofVals[globalIndex];
			if (myDV.length === otherDV.length) { //if we have the same number of values we could still be ok

				for (j = 0; j < otherDV.length; j++) { //make sure every value present in otherPose is present/same in ours
					if (myDV[j] !== otherDV[j]) {
						return false;
					}
				}

			} else {
				return false; //otherPose has different number of values for this dof, no chance they won't change us
			}
		}//else, otherPose doesn't have this dof, it can't change us, continue

	}

	return true;
};

/**
 * Returns true if the other Pose contains no information that would change the 0th slot values
 * of this Pose if it was passed in with setPose.  That is, any overlapping dofs have the same 0th slot values
 * as this Pose.
 *
 * @param {Pose} otherPose
 * @return {boolean}
 */
Pose.prototype.equalsNoChange0Only = function(otherPose){
	var i;

	for(i = 0; i < this.dofIndices.length; i++) {

		var globalIndex = this.dofIndices[i];

		if (otherPose.dofPresent[globalIndex]) { //if other pose has it, it could be different, need to check
			var myDV = this.dofVals[globalIndex];
			var otherDV = otherPose.dofVals[globalIndex];
			if (myDV.length>0 && otherDV.length>0) { //we both have a 0th slot value, need to compare

				if (myDV[0] !== otherDV[0]) { //and, be equal!
					return false;
				}

			} else if(myDV.length!==otherDV.length){ //or, one has a value and the other doesn't, not equal
				return false;
			}
		}//else, otherPose doesn't have this dof, it can't change us, continue

	}

	return true;
};

/**
 * Get the map used by Pose to go from dof names to Pose internal indices.  Use these
 * indices for getByIndex/setByIndex.  Returned value will be a copy of the map.
 * @return {Object.<string,number>}
 */
Pose.prototype.getDOFNamesToIndices = function(){
	return Object.assign({}, namesToIndex);
};

/**
 * Get the array mapping from Pose internal indices to dof names.  Use these indices
 * for getByIndex/setByIndex.  Returned value will be a copy of this array.
 * @returns {Array.<string>}
 */
Pose.prototype.getDOFIndicesToNames = function(){
	return indexToName.slice();
};

/**
 * Get the Pose internal index for the provided dof name.  Use these indices
 * for getByIndex/setByIndex
 * @param {string} dofName
 * @returns {number}
 */
Pose.prototype.getDOFIndexForName = function(dofName){
	return namesToIndex[dofName];
};

/**
 * Get the name for the provided Pose internal index.  Use these indices
 * for getByIndex/setByIndex
 * @param {number} dofIndex
 * @returns {string}
 */
Pose.prototype.getDOFNameForIndex = function(dofIndex){
	return indexToName[dofIndex];
};

/**
 * Operator for computeBinary.  Will only be called on non-null arguments
 * (e.g., both poses contain the dof.).  They could have zero elements however.
 *
 * @callback binaryOperator
 * @param {string} dofName
 * @param {number[]} pose1Data
 * @param {number[]} pose2Data
 * @return {number[]}
 * @intdocs
 */

/**
 * Only the values present in both a, b, and inplaceResult
 * will be computed and stored in inplaceResult.  If clearUnused is true,
 * then values in inplaceResult but not in a AND b will be cleared.
 * If inplaceResult is null or omitted, it will be created and will have
 * values present in a AND b.  Any or all arguments can point to the same Pose.
 *
 * @param {Pose} a
 * @param {Pose} b
 * @param {binaryOperator} operator
 * @param {boolean} [clearUnused=false] - clear elements in result not in (a AND b), otherwise leave them as is.
 * @param {Pose} [result=null]
 */
Pose.computeBinary = function(a, b, operator, clearUnused, result){
	var i, dofIndex;
	if(result == null || result.dofNames == null){ //null or undefined (eqnull)
		//we'll go here if result is "blank" (no dof names set yet) or not provided.
		if(result == null) {
			result = new Pose(a.getName() + " x " + b.getName());
		}
		var intersectingDofNames = [];
		for (dofIndex=0; dofIndex < globalNumDOFs; dofIndex++){
			if(a.dofPresent[dofIndex] && b.dofPresent[dofIndex]){
				intersectingDofNames.push(indexToName[dofIndex]);
			}
		}
		setupDOFNamesFromNames(result, intersectingDofNames);

	}

	for (i=0; i<result.dofIndices.length; i++){
		dofIndex = result.dofIndices[i];
		if (a.dofPresent[dofIndex] && b.dofPresent[dofIndex]){ //everyone's got it
			result.dofVals[dofIndex] = operator(result.dofNames[i], a.dofVals[dofIndex], b.dofVals[dofIndex]);
		}else if(clearUnused){
			result.dofVals[dofIndex].length = 0;
		}
	}

	return result;
};

/**
 * Operator for computeUnary.  Will only be called on non-null arguments
 * (e.g., pose contains the dof.).  It may have zero elements however.
 *
 * @callback unaryOperator
 * @param {string} dofName
 * @param {number[]} poseData
 * @return {number[]}
 * @intdocs
 */

/**
 * Only the values present in a and inplaceResult
 * will be computed and stored in inplaceResult.  If clearUnused is true,
 * then values in inplaceResult but not in a will be cleared.
 * If inplaceResult is null or omitted, it will be created and will have
 * values present in a.  Any or all arguments can point to the same Pose.
 *
 * @param {Pose} a
 * @param {unaryOperator} operator
 * @param {boolean} [clearUnused=false] - clear elements in result not in a, otherwise leave them as is.
 * @param {Pose} [result=null]
 */
Pose.computeUnary = function(a, operator, clearUnused, result){
	var i, dofIndex;
	if(result == null || result.dofNames == null){ //null or undefined (eqnull)
		//we'll go here if result is "blank" (no dof names set yet) or not provided.
		if(result == null) {
			result = new Pose(a.getName(), a.dofNames);
		}else{
			setupDOFNamesFromNames(result, a.dofNames);
		}
	}

	for (i=0; i<result.dofIndices.length; i++){
		dofIndex = result.dofIndices[i];
		if (a.dofPresent[dofIndex]){ //everyone has it
			result.dofVals[dofIndex] = operator(result.dofNames[i], a.dofVals[dofIndex]);
		}else if(clearUnused){
			result.dofVals[dofIndex].length = 0;
		}
	}

	return result;
};

/**
 *
 * @param {string} dofName
 * @param {number[]} pose1Data
 * @param {number[]} pose2Data
 * @return {number[]}
 * @private
 */
Pose._subtractOperator = function(dofName, pose1Data, pose2Data){
	var result = [];
	var p10 = pose1Data.length>0?pose1Data[0]:0;
	var p20 = pose2Data.length>0?pose2Data[0]:0;
	result[0] = p10 - p20; //do at least the first (position), even if it's not explicitly present, will be treated as zero.
	var i = 1;
	while(i < pose1Data.length && i < pose2Data.length){
		result.push(pose1Data[i] - pose2Data[i]);
		i++;
	}
	return result;
};

/**
 *
 * @param {string} dofName
 * @param {number[]} pose1Data
 * @param {number[]} pose2Data
 * @return {number[]}
 * @private
 */
Pose._additionOperator = function(dofName, pose1Data, pose2Data){
	var result = [];
	var p10 = pose1Data.length>0?pose1Data[0]:0;
	var p20 = pose2Data.length>0?pose2Data[0]:0;
	result[0] = p10 + p20; //do at least the first (position), even if it's not explicitly present, will be treated as zero.
	var i = 1;
	while(i < pose1Data.length && i < pose2Data.length){
		result.push(pose1Data[i] + pose2Data[i]);
		i++;
	}
	return result;
};

/**
 * Compute the advance of dofs in poseData by their velocities, optionally by the time specified (can be negative).
 * Dofs with no velocity are not advanced.  derivative data passed through to result unchanged.
 *
 * @param {string} dofName
 * @param {number[]} poseData
 * @param {number} [time=1]
 * @return {number[]}
 * @private
 */
Pose._advanceByVelocityOperator = function(dofName, poseData, time){
	var result = [];
	if(poseData.length > 0) {
		if (time == null) {//null of undefined (eqnull)
			time = 1;
		}
		var velocity = 0;
		if (poseData.length >= 2) {
			velocity = poseData[1];
		}
		result[0] = (velocity * time + poseData[0]);

		for(var i = 1; i < poseData.length; i++) {
			result.push(poseData[i]);
		}
	}
	return result;
};

/**
 * Only the values present in both a, b, and inplaceResult
 * will be subtracted and stored in inplaceResult.  If clearUnused is true,
 * then values in inplaceResult but not in a AND b will be cleared.
 * If inplaceResult is null or omitted, it will be created and will have
 * values present in a AND b.  Any or all arguments can point to the same Pose.
 *
 * Derivatives will be subtracted if both are present for a dof.  Positions will
 * always be subtracted for dofs in all poses.
 *
 * @param {Pose} a
 * @param {Pose} b
 * @param {boolean} [clearUnused=false] - clear elements in result not in (a AND b), otherwise leave them as is.
 * @param {Pose} [result=null]
 */
Pose.subtract = function(a, b, clearUnused, result){
	return Pose.computeBinary(a, b, Pose._subtractOperator, clearUnused, result);
};

/**
 * Only the values present in both a, b, and inplaceResult
 * will be added and stored in inplaceResult.  If clearUnused is true,
 * then values in inplaceResult but not in a AND b will be cleared.
 * If inplaceResult is null or omitted, it will be created and will have
 * values present in a AND b.  Any or all arguments can point to the same Pose.
 *
 * Derivatives will be added if both are present for a dof.  Positions will
 * always be added for dofs in all poses.
 *
 * @param {Pose} a
 * @param {Pose} b
 * @param {boolean} [clearUnused=false] - clear elements in result not in (a AND b), otherwise leave them as is.
 * @param {Pose} [result=null]
 */
Pose.add = function(a, b, clearUnused, result){
	return Pose.computeBinary(a, b, Pose._additionOperator, clearUnused, result);
};

/**
 * Only the values present in a and inplaceResult
 * will be advanced and stored in inplaceResult.  If clearUnused is true,
 * then values in inplaceResult but not in a will be cleared.
 * If inplaceResult is null or omitted, it will be created and will have
 * values present in a.  Any or all arguments can point to the same Pose.
 * Empty velocities are assumed to be zero.
 *
 * @param a - pose to advance
 * @param clearUnused - clear elements in result not used in a
 * @param result - resulting advanced pose
 * @param [time=null] - if omitted or null, default (1) will be used
 */
Pose.advanceByTime = function(a, clearUnused, result, time){
	if(time == null){
		return Pose.computeUnary(a, Pose._advanceByVelocityOperator, clearUnused, result);
	}else{
		return Pose.computeUnary(a, function(dofName, poseData){
			return Pose._advanceByVelocityOperator(dofName, poseData, time);
		}, clearUnused, result);
	}
};

Pose.prototype.toString = function(){
	var s = "Pose{";
	for(var i = 0; i < this.dofNames.length; i++){
		s+=this.dofNames[i]+":["+this.dofVals[this.dofIndices[i]].toString()+"]";
		if(i < this.dofNames.length-1){
			s+=",";
		}
	}
	return s+"}";
};

Pose.__globalSetup = globalSetup;

export default Pose;
