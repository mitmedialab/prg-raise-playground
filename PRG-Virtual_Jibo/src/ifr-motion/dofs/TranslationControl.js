"use strict";

import ModelControl from "./ModelControl.js";
import ModelControlFactory from "./ModelControlFactory.js";
import BasicFrame from "../../ifr-geometry/BasicFrame.js";
import THREE from "@jibo/three";

/**
 * @constructor
 * @extends ModelControl
 */
class TranslationControl extends ModelControl {
    constructor() {
        super();

        /** @type {string} */
        this._skeletonFrameName = null;

        /** @type {THREE.Vector3} */
        this._initialPosition = new THREE.Vector3();
        /** @type {Array.<THREE.Vector3>} */
        this._translationalDirectionList = [];

        /** @type {Array.<number>} */
        this._minList = [];
        /** @type {Array.<number>} */
        this._maxList = [];

        /** @type {THREE.Object3D} */
        this._skeletonFrame = null;

        this._lastValue = [];
    }

    /**
     * @param {Object} jsonData
     * @override
     */
    setFromJson(jsonData) {
        super.setFromJson(jsonData);

        this._dofNames.push(jsonData.dofName);
        this._skeletonFrameName = jsonData.skeletonFrameName;
        this._initialPosition.copy(BasicFrame.vector3FromJson(jsonData.xyzInitialPosition));
        this._translationalDirectionList.push(BasicFrame.vector3FromJson(jsonData.xyzTranslationDirection));
        this._minList.push(jsonData.min);
        this._maxList.push(jsonData.max);
    }

    /**
     * @param {TranslationControl} translationControlB
     */
    appendControl(translationControlB) {
        this._controlNames = this._controlNames.concat(translationControlB._controlNames);
        this._dofNames = this._dofNames.concat(translationControlB._dofNames);
        this._translationalDirectionList = this._translationalDirectionList.concat(translationControlB._translationalDirectionList);
        this._minList = this._minList.concat(translationControlB._minList);
        this._maxList = this._maxList.concat(translationControlB._maxList);
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
     * @param {boolean} [forceRecompute]
     * @return {THREE.Vector3} computed value (null if cannot compute)
     */
    computeFromDOFValues(dofValues, forceRecompute) {
        const dofValueList = [];
        for (let dofIndex = 0; dofIndex < this._dofNames.length; dofIndex++) {
            if (dofValues.hasOwnProperty(this._dofNames[dofIndex])) {
                dofValueList.push(dofValues[this._dofNames[dofIndex]]);
            }
            else {
                return null;
            }
        }

        return computeForDOFValueList.call(this, dofValueList, forceRecompute);
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     * @override
     */
    updateFromDOFValues(dofValues) {
        const newPosition = this.computeFromDOFValues(dofValues);
        if (newPosition != null && this._skeletonFrame != null) //checks for null or undefined (eqnull)
        {
            this._skeletonFrame.position.copy(newPosition);
            this._skeletonFrame._nodeDirtyToKG = true; //mark as dirty for KH CF updates
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {Pose} pose
     * @return {THREE.Vector3} computed value (null if cannot compute)
     */
    computeFromPose(pose) {
        const dofValueList = [];
        for (let dofIndex = 0; dofIndex < this._dofNames.length; dofIndex++) {
            const val = pose.get(this._dofNames[dofIndex], 0);
            if (val != null) {
                dofValueList.push(val);
            }
            else {
                return null;
            }
        }

        return computeForDOFValueList.call(this, dofValueList);
    }

    /**
     * @param {Pose} pose
     * @return {!boolean}
     * @override
     */
    updateFromPose(pose) {
        const newPosition = this.computeFromPose(pose);
        if (newPosition != null && this._skeletonFrame != null) //checks for null or undefined (eqnull)
        {
            this._skeletonFrame.position.copy(newPosition);
            this._skeletonFrame._nodeDirtyToKG = true; //mark as dirty for KH CF updates
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {TranslationControl} copyInto - optional object to copy into
     * @return {TranslationControl} copy of this dof, not attached to any model
     * @override
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new TranslationControl();
        }

        super.getCopy(copyInto);

        copyInto._skeletonFrameName = this._skeletonFrameName;

        copyInto._initialPosition = this._initialPosition ? this._initialPosition.clone() : null;

        copyInto._translationalDirectionList = this._translationalDirectionList ? this._translationalDirectionList.slice(0) : null;
        if (copyInto._translationalDirectionList) { //copy the vecs
            for (let i = 0; i < copyInto._translationalDirectionList.length; i++) {
                copyInto[i] = copyInto[i] ? copyInto[i].clone() : null;
            }
        }

        copyInto._minList = this._minList ? this._minList.slice(0) : this._minList;

        copyInto._maxList = this._maxList ? this._maxList.slice(0) : this._maxList;

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

TranslationControl.prototype._controlType = "TRANSLATION";

/**
 * @param {number[]} dofValueList - values in order of our dofs
 * @param {boolean} [forceRecompute]
 * @return {THREE.Vector3}
 */
function computeForDOFValueList(dofValueList, forceRecompute) {
    let equal = true;

    for (let i = 0; i < dofValueList.length; i++) {
        if (dofValueList[i] !== this._lastValue[i]) {
            this._lastValue[i] = dofValueList[i];
            equal = false;
        }
    }

    if (!equal || forceRecompute) {
        const newPosition = new THREE.Vector3().copy(this._initialPosition);
        const deltaPosition = new THREE.Vector3();
        for (let dofIndex = 0; dofIndex < dofValueList.length; dofIndex++) {
            const dofValue = THREE.Math.clamp(dofValueList[dofIndex], this._minList[dofIndex], this._maxList[dofIndex]);
            deltaPosition.copy(this._translationalDirectionList[dofIndex]).multiplyScalar(dofValue);
            newPosition.add(deltaPosition);
        }
        return newPosition;
    } else {
        return null;
    }
}

/**
 * @constructor
 */
class TranslationControlFactory extends ModelControlFactory {
    constructor() {
        super();
        this._controlType = "TRANSLATION";
        this._controlConstructor = TranslationControl;
    }

    /**
     * @param {Array.<ModelControl>} controlList
     * @return {Array.<ModelControl>}
     */
    postProcessControlList(controlList) {
        /** @type {Object.<string, TranslationControl>} */
        const translationControlMap = {};

        /** @type {Array.<ModelControl>} */
        const trimmedControlList = [];
        for (let c = 0; c < controlList.length; c++) {
            const control = controlList[c];
            if (control instanceof TranslationControl) {
                if (translationControlMap.hasOwnProperty(control._skeletonFrameName)) {
                    const masterTranslationControl = translationControlMap[control._skeletonFrameName];
                    masterTranslationControl.appendControl(control);
                }
                else {
                    translationControlMap[control._skeletonFrameName] = control;
                    trimmedControlList.push(control);
                }
            }
            else {
                trimmedControlList.push(control);
            }
        }

        return trimmedControlList;
    }
}

TranslationControlFactory.prototype._controlType = TranslationControl.prototype._controlType;
TranslationControlFactory.prototype._controlConstructor = TranslationControl;

// Attach Factory to main class for backward compatibility
TranslationControl.Factory = TranslationControlFactory;

export default TranslationControl;