"use strict";

import THREE from "@jibo/three";
import ExtraMath from "../../ifr-geometry/ExtraMath.js";
import PlaneDisplacementLookatDOF from "./PlaneDisplacementLookatDOF.js";
import slog from "../../ifr-core/SLog.js";

/**
 * @param {string} name
 * @constructor
 */
const FeatureReporter = function(name){
	this.name = name;
};

/**
 * @param {KinematicGroup} kinematicGroup
 */
FeatureReporter.prototype.connectToGroup = function(kinematicGroup){}; // eslint-disable-line no-unused-vars

/**
 * @param {Pose} forPose - current pose. attached kinematic group will already be updated to match this pose
 * @return {?{position: THREE.Vector3, direction: THREE.Vector3}}
 * @abstract
 */
FeatureReporter.prototype.computeFeature = function(forPose){}; // eslint-disable-line no-unused-vars

/**
 * @param {KinematicGroup} kinematicGroupPrototype - used if necessary to find required transform names. NOT saved or bound to!
 * @return {string[]}
 * @abstract
 */
FeatureReporter.prototype.getRequiredTransforms = function(kinematicGroupPrototype){}; // eslint-disable-line no-unused-vars


/**
 * @param {string} name
 * @param {string} transformName
 * @param {THREE.Vector3} position
 * @param {THREE.Vector3} direction
 * @constructor
 * @extends {FeatureReporter}
 */
const VectorFeatureReporter = function(name, transformName, position, direction){
	FeatureReporter.call(this, name);

	/**
	 * @type {string}
	 * @private
	 */
	this._transformName = transformName;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._position = position;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._direction = direction;

	/**
	 *
	 * @type {THREE.Object3D}
	 * @private
	 */
	this._transform = null;
};

VectorFeatureReporter.prototype = Object.create(FeatureReporter.prototype);
VectorFeatureReporter.prototype.constructor = VectorFeatureReporter;

/**
 * @param {KinematicGroup} kinematicGroup
 */
VectorFeatureReporter.prototype.connectToGroup = function(kinematicGroup){
	this._transform = null;
	if(kinematicGroup!==null){
		this._transform = kinematicGroup.getTransform(this._transformName);
		if(this._transform == null){
			slog.error("VectorFeatureReporter: error initting, did not find transform "+this._transformName+" for feature "+this.name);
		}
	}
};
/**
 * @param {Pose} forPose - current pose. attached kinematic group will already be updated to match this pose
 * @return {?{position: THREE.Vector3, direction: THREE.Vector3}}
 * @override
 */
VectorFeatureReporter.prototype.computeFeature = function(forPose){ // eslint-disable-line no-unused-vars
	if(this._transform!==null){
		var position = null, direction = null;
		if(this._position!==null){
			position = new THREE.Vector3().copy(this._position);
			this._transform.localToWorld(position);
		}
		if(this._direction!==null){
			direction = ExtraMath.convertDirectionLocalToWorld(this._transform, this._direction, new THREE.Vector3());
		}
		return {position:position, direction:direction};
	}else{
		return null;
	}
};

/**
 * @param {KinematicGroup} kinematicGroupPrototype - used if necessary to find required transform names. NOT saved or bound to!
 * @return {string[]}
 * @abstract
 */
VectorFeatureReporter.prototype.getRequiredTransforms = function(kinematicGroupPrototype){ // eslint-disable-line no-unused-vars
	return [this._transformName];
};



/**
 * @param {string} name
 * @param {PlaneDisplacementLookatDOF} planeDisplacementDOF1
 * @param {PlaneDisplacementLookatDOF} planeDisplacementDOF2
 * @constructor
 * @extends {FeatureReporter}
 */
const PlaneDisplacementVectorReporter = function(name, planeDisplacementDOF1, planeDisplacementDOF2){
	FeatureReporter.call(this, name);

	/**
	 * @type {PlaneDisplacementLookatDOF}
	 * @private
	 */
	this._planeDisplacementDOF1 = planeDisplacementDOF1;

	/**
	 * @type {PlaneDisplacementLookatDOF}
	 * @private
	 */
	this._planeDisplacementDOF2 = planeDisplacementDOF2;
};

PlaneDisplacementVectorReporter.prototype = Object.create(FeatureReporter.prototype);
PlaneDisplacementVectorReporter.prototype.constructor = PlaneDisplacementVectorReporter;

/**
 * @param {KinematicGroup} kinematicGroup
 */
PlaneDisplacementVectorReporter.prototype.connectToGroup = function(kinematicGroup){
	this._planeDisplacementDOF1.connectToGroup(kinematicGroup);
	this._planeDisplacementDOF2.connectToGroup(kinematicGroup);
};

/**
 * @param {Pose} forPose - current pose. attached kinematic group will already be updated to match this pose
 * @return {?{position: THREE.Vector3, direction: THREE.Vector3}}
 * @override
 */
PlaneDisplacementVectorReporter.prototype.computeFeature = function(forPose){
	if(this._planeDisplacementDOF1._controlledTransform !== null) { //assume if 1 is initialized, both are.
		var position = new THREE.Vector3();
		var direction = new THREE.Vector3();

		PlaneDisplacementLookatDOF.getVectorFromOrthogonalPDLDs(
			this._planeDisplacementDOF1, this._planeDisplacementDOF2,
			forPose,
			position, direction);

		return {position: position, direction: direction};
	}else{
		return null;
	}
};

/**
 * @param {KinematicGroup} kinematicGroupPrototype - used if necessary to find required transform names. NOT saved or bound to!
 * @return {string[]}
 * @abstract
 */
PlaneDisplacementVectorReporter.prototype.getRequiredTransforms = function(kinematicGroupPrototype){
	//we want the central transform, because it will be needed as coordinate frame:
	var rt = [this._planeDisplacementDOF1._centralTransformName, this._planeDisplacementDOF2._centralTransformName];
	//we also want the transforms that the dof actually moves:
	rt = rt.concat(
		kinematicGroupPrototype.getModelControlGroup().getRequiredTransformNamesForDOFs([
			this._planeDisplacementDOF1.getControlledDOFName(),
			this._planeDisplacementDOF2.getControlledDOFName()
		]));
	return rt;
};


/**
 *
 * @param {KinematicGroup} kinematicGroupPrototype - prototype group; this group will be copied, not used.
 * @param {FeatureReporter[]} featureReporters
 * @constructor
 */
const KinematicFeaturesReporter = function (kinematicGroupPrototype, featureReporters){

	var i;

	var allRequiredTransforms = [];
	for (i = 0; i < featureReporters.length; i++) {
		var r = featureReporters[i].getRequiredTransforms(kinematicGroupPrototype);
		if(r!==null){
			allRequiredTransforms = allRequiredTransforms.concat(r);
		}
	}

	this._kinematicGroup = kinematicGroupPrototype.getCopy(allRequiredTransforms);

	this._featureRepoters = featureReporters;

	for (i = 0; i < this._featureRepoters.length; i++) {
		this._featureRepoters[i].connectToGroup(this._kinematicGroup);
	}
};

/**
 * @param {Pose} forPose
 * @return {Object.<string,{position: THREE.Vector3, direction: THREE.Vector3}>}
 */
KinematicFeaturesReporter.prototype.computeFeatures = function(forPose){
	this._kinematicGroup.setFromPose(forPose);
	this._kinematicGroup.updateWorldCoordinateFrames();
	//this._kinematicGroup.getRoot().updateMatrixWorld(true);

	var features = {};
	for (var i = 0; i < this._featureRepoters.length; i++) {
		var fr = this._featureRepoters[i];
		features[fr.name] = fr.computeFeature(forPose);
	}
	return features;
};

KinematicFeaturesReporter.VectorFeatureReporter = VectorFeatureReporter;
KinematicFeaturesReporter.PlaneDisplacementVectorReporter = PlaneDisplacementVectorReporter;

export default KinematicFeaturesReporter;
