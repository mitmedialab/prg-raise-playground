"use strict";

/**
 * Base class for model controls
 * @class ModelControl
 */
class ModelControl {
    /**
     * @constructor
     */
    constructor() {
        /** @type {Array.<string>} */
        this._controlNames = [];
        /** @type {Array.<string>} */
        this._dofNames = [];
    }

    /**
     * @param {Object} jsonData
     */
    setFromJson(jsonData) {
        if (jsonData.controlName) {
            this._controlNames.push(jsonData.controlName);
        }
    }

    /**
     * @return {string}
     */
    getControlType() {
        return this._controlType;
    }

    /**
     * @return {Array.<string>}
     */
    getControlNames() {
        return this._controlNames;
    }

    /**
     * @return {Array.<string>}
     */
    getDOFNames() {
        return this._dofNames;
    }

    /**
     * @return {Array.<string>}
     */
    getTransformNames() {
        return null;
    }

    /**
     * @return {string}
     */
    getDescriptiveName() {
        if (this._controlNames.length === 0) {
            return null;
        }
        else if (this._controlNames.length === 1) {
            return this._controlNames[0];
        }
        else {
            let names = this._controlNames[0];
            for (let i = 1; i < this._controlNames.length; i++) {
                names = names + ", " + this._controlNames[i];
            }
            return "MultiControl<" + names + ">";
        }
    }

    /**
     * @param {Object.<string, THREE.Object3D>} modelMap
     * @return {!boolean}
     */
    attachToModel(modelMap) { // eslint-disable-line no-unused-vars
        return false;
    }

    /**
     * Called once when control list is assigned to a group, used by controls
     * which need to make links amongst themselves.
     * @param {ModelControlGroup} controlGroup
     */
    attachToControlGroup(controlGroup) {} // eslint-disable-line no-unused-vars

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     */
    updateFromDOFValues(dofValues) { // eslint-disable-line no-unused-vars
        return false;
    }

    /**
     * @param {Pose} pose
     * @return {!boolean}
     */
    updateFromPose(pose) { // eslint-disable-line no-unused-vars
        return false;
    }

    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {ModelControl} copyInto - optional object to copy into
     * @return {ModelControl} copy of this dof, not attached to any model
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new ModelControl();
        }
        copyInto._controlNames = this._controlNames ? this._controlNames.slice(0) : null;
        copyInto._dofNames = this._dofNames ? this._dofNames.slice(0) : null;
        copyInto._controlType = this._controlType;
        return copyInto;
    }
}

/** @type {string} */
ModelControl.prototype._controlType = null;

export default ModelControl;