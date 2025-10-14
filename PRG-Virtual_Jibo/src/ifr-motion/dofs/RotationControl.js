"use strict";

import ModelControl from "./ModelControl.js";
import ModelControlFactory from "./ModelControlFactory.js";
import BasicFrame from "../../ifr-geometry/BasicFrame.js";
import THREE from "@jibo/three";

/**
 * @constructor
 * @extends ModelControl
 */
class RotationControl extends ModelControl {
    constructor() {
        super();

        /** @type {string} */
        this._skeletonFrameName = null;

        /** @type {THREE.Vector3} */
        this._rotationalAxis = new THREE.Vector3();
        /** @type {THREE.Quaternion} */
        this._initialRotation = new THREE.Quaternion();

        /** @type {number} */
        this._min = null;
        /** @type {number} */
        this._max = null;

        /** @type {boolean} */
        this._isCyclic = false;

        /** @type {THREE.Object3D} */
        this._skeletonFrame = null;

        /**
         * @type {number}
         * @private
         */
        this._lastValue = null;
    }

    /**
     * @param {Object} jsonData
     * @override
     */
    setFromJson(jsonData) {
        super.setFromJson(jsonData);

        this._dofNames.push(jsonData.dofName);
        this._skeletonFrameName = jsonData.skeletonFrameName;
        this._rotationalAxis.copy(BasicFrame.vector3FromJson(jsonData.xyzRotationAxis));
        this._initialRotation.copy(BasicFrame.quaternionFromJson(jsonData.wxyzQuatInitialRotation));
        this._min = jsonData.min;
        this._max = jsonData.max;
        this._isCyclic = jsonData.isCyclic | false;
    }

    /**
     * @param {Object.<string, THREE.Object3D>} modelMap
     * @return {!boolean}
     * @override
     */
    attachToModel(modelMap) {
        this._skeletonFrame = null;

        if (modelMap != null && modelMap.hasOwnProperty(this._skeletonFrameName)) {
            this._skeletonFrame = modelMap[this._skeletonFrameName];
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     * @override
     */
    updateFromDOFValues(dofValues) {
        if (this._skeletonFrame && dofValues.hasOwnProperty(this._dofNames[0])) {
            const dofValue = dofValues[this._dofNames[0]];

            updateFromDOFVal.call(this, dofValue);

            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {Pose} pose
     * @return {!boolean}
     * @override
     */
    updateFromPose(pose) {
        const dofValue = pose.get(this._dofNames[0], 0);
        if (this._skeletonFrame && (dofValue != null)) //null or undefined (eqnull)
        {
            updateFromDOFVal.call(this, dofValue);
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {THREE.Vector3 } inplaceVector3 - new vector will be created if null or omitted
     * @return {!THREE.Vector3} the rotational axis.  will be === inplaceVector3 if provided
     */
    getRotationalAxis(inplaceVector3) {
        if (inplaceVector3 == null) { //null or undefined (eqnull)
            inplaceVector3 = new THREE.Vector3();
        }
        return inplaceVector3.copy(this._rotationalAxis);
    }

    /**
     * @param {THREE.Quaternion } inplaceQuaternion - new vector will be created if null or omitted
     * @return {!THREE.Quaternion} the initial rotation.  will be === inplaceQuaternion if provided
     */
    getInitialRotation(inplaceQuaternion) {
        if (inplaceQuaternion == null) { //null or undefined (eqnull)
            inplaceQuaternion = new THREE.Quaternion();
        }
        return inplaceQuaternion.copy(this._initialRotation);
    }

    /**
     * @returns {number}
     */
    getMin() {
        return this._min;
    }

    /**
     * @returns {number}
     */
    getMax() {
        return this._max;
    }

    /**
     * @returns {boolean}
     */
    isCyclic() {
        return this._isCyclic;
    }

    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {RotationControl} copyInto - optional object to copy into
     * @return {RotationControl} copy of this dof, not attached to any model
     * @override
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new RotationControl();
        }

        super.getCopy(copyInto);

        copyInto._skeletonFrameName = this._skeletonFrameName;

        copyInto._rotationalAxis = this._rotationalAxis ? this._rotationalAxis.clone() : null;

        copyInto._initialRotation = this._initialRotation ? this._initialRotation.clone() : null;

        copyInto._min = this._min;

        copyInto._max = this._max;

        copyInto._isCyclic = this._isCyclic;

        return copyInto;
    }

    /**
     ** @returns {string}
     */
    getTransformName() {
        return this._skeletonFrameName;
    }

    /**
     * @return {Array.<string>}
     * @override
     */
    getTransformNames() {
        return [this.getTransformName()];
    }
}

RotationControl.prototype._controlType = "ROTATION";

/**
 * @param {number} dofValue
 */
function updateFromDOFVal(dofValue) {
    if (dofValue !== this._lastValue) {
        this._lastValue = dofValue;
        //dofValue = THREE.Math.clamp(dofValue, this._min, this._max);
        const rotationAroundAxis = new THREE.Quaternion().setFromAxisAngle(this._rotationalAxis, dofValue);
        this._skeletonFrame.quaternion.multiplyQuaternions(this._initialRotation, rotationAroundAxis);
        this._skeletonFrame._nodeDirtyToKG = true; //mark as dirty for KH CF updates
    }
}

/**
 * @constructor
 */
class RotationControlFactory extends ModelControlFactory {
    constructor() {
        super();
        this._controlType = "ROTATION";
        this._controlConstructor = RotationControl;
    }
}

RotationControlFactory.prototype._controlType = RotationControl.prototype._controlType;
RotationControlFactory.prototype._controlConstructor = RotationControl;

// Attach Factory to main class for backward compatibility
RotationControl.Factory = RotationControlFactory;

export default RotationControl;