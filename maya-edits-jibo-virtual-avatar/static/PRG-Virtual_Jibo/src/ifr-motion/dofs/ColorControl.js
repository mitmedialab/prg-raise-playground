"use strict";

import ModelControl from "./ModelControl.js";
import ModelControlFactory from "./ModelControlFactory.js";
import THREE from "@jibo/three";

/**
 * @constructor
 * @extends ModelControl
 */
class ColorControl extends ModelControl {
    constructor() {
        super();

        /** @type {Array.<string>} */
        this._meshNames = null;
        /** @type {Array.<string>} */
        this._ledNames = null;

        /** @type {Array.<THREE.Mesh>} */
        this._meshes = [];

        /**
         * @type {boolean}
         * @private
         */
        this._billboardMode = true;
    }

    /**
     * @param {Object} jsonData
     * @override
     */
    setFromJson(jsonData) {
        super.setFromJson(jsonData);

        this._dofNames.push(jsonData.redDOFName);
        this._dofNames.push(jsonData.greenDOFName);
        this._dofNames.push(jsonData.blueDOFName);
        if (jsonData.alphaDOFName) {
            this._dofNames.push(jsonData.alphaDOFName);
        }
        this._meshNames = jsonData.meshNames;
        if (jsonData.ledNames) {
            this._ledNames = jsonData.ledNames;
        }
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
     *
     * @param {boolean} billboard - true for billboard (emissive) mode, false for normal (diffuse) mode
     */
    setBillboardMode(billboard) {
        if (billboard !== this._billboardMode) {
            if (this._meshes.length > 0) {
                const setDiffuse = new THREE.Color(0, 0, 0);
                const setEmissive = new THREE.Color(0, 0, 0);
                if (billboard) {
                    //move existing color from diffuse to emissive, other to 0
                    setEmissive.copy(this._meshes[0].material.color);
                } else {
                    //move existing color from emissive to diffuse, other to 0
                    setDiffuse.copy(this._meshes[0].material.emissive);
                }
                for (let meshIndex = 0; meshIndex < this._meshes.length; meshIndex++) {
                    this._meshes[meshIndex].material.emissive.copy(setEmissive);
                    this._meshes[meshIndex].material.color.copy(setDiffuse);
                }
            }
            this._billboardMode = billboard;
        }
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     * @override
     */
    updateFromDOFValues(dofValues) {
        const dofValueList = [];
        let dofIndex;
        for (dofIndex = 0; dofIndex < this._dofNames.length; dofIndex++) {
            if (dofValues.hasOwnProperty(this._dofNames[dofIndex])) {
                dofValueList.push(dofValues[this._dofNames[dofIndex]]);
            }
            else {
                return false;
            }
        }

        if (this._meshes.length > 0) {
            updateFromRGBA.call(this, dofValueList[0], dofValueList[1], dofValueList[2], dofValueList[3]);
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
        const dofValueList = [];
        let dofIndex;
        for (dofIndex = 0; dofIndex < this._dofNames.length; dofIndex++) {
            const c = pose.get(this._dofNames[dofIndex], 0);
            if (c != null) //null or undefined (eqnull)
            {
                dofValueList.push(c);
            }
            else {
                return false;
            }
        }

        if (this._meshes.length > 0) {
            updateFromRGBA.call(this, dofValueList[0], dofValueList[1], dofValueList[2], dofValueList[3]);
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
     * @param {ColorControl} copyInto - optional object to copy into
     * @return {ColorControl} copy of this dof, not attached to any model
     * @override
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new ColorControl();
        }
        super.getCopy(copyInto);
        copyInto._meshNames = this._meshNames ? this._meshNames.slice(0) : null;
        copyInto._ledNames = this._ledNames ? this._ledNames.slice(0) : null;

        return copyInto;
    }
}

ColorControl.prototype._controlType = "COLOR";

/***
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 */
function updateFromRGBA(r, g, b, a) {
    for (let meshIndex = 0; meshIndex < this._meshes.length; meshIndex++) {
        if (this._billboardMode) {
            this._meshes[meshIndex].material.emissive.setRGB(r, g, b);
        } else {
            this._meshes[meshIndex].material.color.setRGB(r, g, b);
        }

        if (a !== undefined) {
            this._meshes[meshIndex].material.opacity = a;
        }
    }
}

/**
 * @constructor
 */
class ColorControlFactory extends ModelControlFactory {
    constructor() {
        super();
        this._controlType = "COLOR";
        this._controlConstructor = ColorControl;
    }
}

ColorControlFactory.prototype._controlType = ColorControl.prototype._controlType;
ColorControlFactory.prototype._controlConstructor = ColorControl;

// Attach Factory to main class for backward compatibility
ColorControl.Factory = ColorControlFactory;

export default ColorControl;