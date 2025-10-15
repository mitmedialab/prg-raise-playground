"use strict";

import ModelControl from "./ModelControl.js";
import ModelControlFactory from "./ModelControlFactory.js";
import slog from "../../ifr-core/SLog.js";

/**
 * @constructor
 * @extends ModelControl
 */
class VisibilityControl extends ModelControl {
    constructor() {
        super();

        /** @type {Array.<string>} */
        this._meshNames = null;

        /** @type {Array.<THREE.Mesh>} */
        this._meshes = [];

        this._lastValue = null;
    }

    /**
     * @param {Object} jsonData
     * @override
     */
    setFromJson(jsonData) {
        super.setFromJson(jsonData);

        this._dofNames.push(jsonData.dofName);
        this._meshNames = jsonData.meshNames;
    }

    /**
     * @param {Object.<string, THREE.Object3D>} modelMap
     * @return {!boolean}
     * @override
     */
    attachToModel(modelMap) {
        this._meshes.length = 0; //clear all meshes
        if (modelMap == null) {
            return false;
        }

        for (let meshIndex = 0; meshIndex < this._meshNames.length; meshIndex++) {
            if (modelMap.hasOwnProperty(this._meshNames[meshIndex])) {
                this._meshes.push(modelMap[this._meshNames[meshIndex]]);
            }
            else {
                return false;
            }
        }

        return true;
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     * @override
     */
    updateFromDOFValues(dofValues) {
        if (this._meshes.length > 0 && dofValues.hasOwnProperty(this._dofNames[0])) {
            const dofValue = dofValues[this._dofNames[0]];
            return updateFromDOFVal.call(this, dofValue);
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
        if (this._meshes.length > 0 && (dofValue != null)) //null or undefined (eqnull)
        {
            return updateFromDOFVal.call(this, dofValue);
        }
        else {
            return false;
        }
    }

    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {VisibilityControl} copyInto - optional object to copy into
     * @return {VisibilityControl} copy of this dof, not attached to any model
     * @override
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new VisibilityControl();
        }
        super.getCopy(copyInto);
        copyInto._meshNames = this._meshNames ? this._meshNames.slice(0) : null;

        return copyInto;
    }
}

VisibilityControl.prototype._controlType = "VISIBILITY";

/**
 * @param {number} dofValue
 * @return {!boolean}
 */
function updateFromDOFVal(dofValue) {
    if (dofValue !== this._lastValue) {
        this._lastValue = dofValue;
        if (typeof (dofValue) === "number") {
            for (let meshIndex = 0; meshIndex < this._meshes.length; meshIndex++) {
                this._meshes[meshIndex].visible = (dofValue !== 0);
            }
            return true;
        }
        else {
            slog.error("VisibilityControl for DOF " + this._dofNames[0] + ": expected numerical value, but got: " + dofValue);
            return false;
        }
    }
}

/**
 * @constructor
 */
class VisibilityControlFactory extends ModelControlFactory {
    constructor() {
        super();
        this._controlType = "VISIBILITY";
        this._controlConstructor = VisibilityControl;
    }
}

VisibilityControlFactory.prototype._controlType = VisibilityControl.prototype._controlType;
VisibilityControlFactory.prototype._controlConstructor = VisibilityControl;

// Attach Factory to main class for backward compatibility
VisibilityControl.Factory = VisibilityControlFactory;

export default VisibilityControl;