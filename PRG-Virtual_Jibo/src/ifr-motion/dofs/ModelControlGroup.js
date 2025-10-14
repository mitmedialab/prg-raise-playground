"use strict";

import KinematicGroup from "./KinematicGroup.js";
import DOFInfo from "./DOFInfo.js";

/**
 * @constructor
 */
class ModelControlGroup {
    constructor() {
        /** @type {Array.<ModelControl>} */
        this._controlList = [];
        /** @type {string[]} */
        this._dofNames = [];
        /** @type {Object.<string, ModelControl>} */
        this._dofNameToControlMap = {};
        /** @type {Object.<string, DOFInfo>} */
        this._dofInfos = {};
    }

    /**
     * @param {Array.<ModelControl>} controlList
     */
    setControlList(controlList) {
        let controlIndex;

        this._controlList = controlList;
        this._dofNames = [];
        this._dofNameToControlMap = {};
        this._dofInfos = {};

        for (controlIndex = 0; controlIndex < this._controlList.length; controlIndex++) {
            const modelControl = this._controlList[controlIndex];
            const dofNames = modelControl.getDOFNames();

            for (let dofIndex = 0; dofIndex < dofNames.length; dofIndex++) {
                this._dofNames.push(dofNames[dofIndex]);
                this._dofNameToControlMap[dofNames[dofIndex]] = modelControl;
                this._dofInfos[dofNames[dofIndex]] = new DOFInfo(dofNames[dofIndex], modelControl);
            }
        }

        for (controlIndex = 0; controlIndex < this._controlList.length; controlIndex++) {
            this._controlList[controlIndex].attachToControlGroup(this);
        }
    }

    /**
     * @return {Array.<ModelControl>}
     */
    getControlList() {
        return this._controlList;
    }

    /**
     * @return {string[]}
     */
    getDOFNames() {
        return this._dofNames;
    }

    /**
     * @param {string} dofName
     * @return {ModelControl}
     */
    getControlForDOF(dofName) {
        return this._dofNameToControlMap[dofName];
    }

    /**
     * @param {string} dofName
     * @return {DOFInfo}
     */
    getDOFInfo(dofName) {
        return this._dofInfos[dofName];
    }

    /**
     * @param {THREE.Object3D} modelRoot
     * @return {!boolean}
     */
    attachToModel(modelRoot) {
        /** @type {Object.<string, THREE.Object3D>} */
        const modelMap = KinematicGroup.generateTransformMap(modelRoot);

        // flatten model tree
        ///** @type {Array.<THREE.Object3D>} */
        //var nodesToVisit = [modelRoot];
        //while (nodesToVisit.length > 0)
        //{
        //	var node = nodesToVisit.shift();
        //	if (node.name)
        //	{
        //		modelMap[node.name] = node;
        //	}
        //	if (node.children)
        //	{
        //		for (var c=0; c<node.children.length; c++)
        //		{
        //			nodesToVisit.push(node.children[c]);
        //		}
        //	}
        //}

        let attachedAll = true;
        for (let controlIndex = 0; controlIndex < this._controlList.length; controlIndex++) {
            const attached = this._controlList[controlIndex].attachToModel(modelMap);
            if (!attached) {
                attachedAll = false;
                console.warn("failed to attach model control: " + this._controlList[controlIndex].getDescriptiveName());
            }
        }

        return attachedAll;
    }

    /**
     * @param {THREE.Object3D} modelRoot
     */
    attachToModelAndPrune(modelRoot) {
        /** @type {Object.<string, THREE.Object3D>} */
        const modelMap = KinematicGroup.generateTransformMap(modelRoot);

        this.setControlList(this._controlList.filter(function (control) {
            return control.attachToModel(modelMap);
        }
        ));
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     */
    updateFromDOFValues(dofValues) {
        let updatedAll = true;
        for (let controlIndex = 0; controlIndex < this._controlList.length; controlIndex++) {
            const updated = this._controlList[controlIndex].updateFromDOFValues(dofValues);
            if (!updated) {
                updatedAll = false;
            }
        }

        return updatedAll;
    }

    /**
     * @param {Pose} pose
     * @return {!boolean}
     */
    updateFromPose(pose) {
        let updatedAll = true;
        for (let controlIndex = 0; controlIndex < this._controlList.length; controlIndex++) {
            const updated = this._controlList[controlIndex].updateFromPose(pose);
            if (!updated) {
                updatedAll = false;
            }
        }
        return updatedAll;
    }

    /**
     * @param {string[]} dofNames
     * @return {string[]}
     */
    getRequiredTransformNamesForDOFs(dofNames) {
        if (dofNames === null) {
            return null;
        }
        const r = [];
        for (let i = 0; i < dofNames.length; i++) {
            const control = this.getControlForDOF(dofNames[i]);
            const transformNames = control.getTransformNames();
            if (transformNames != null) {
                for (let j = 0; j < transformNames.length; j++) {
                    r.push(transformNames[j]);
                }
            }
        }
        return r;
    }

    /**
     * @param {Pose} inplacePose
     * @return {!boolean}
     */
    getPose(inplacePose) { // eslint-disable-line no-unused-vars
        //TODO
    }

    /**
     * Get a copy of this group, differing only in that it will by unbound to any model.
     * @returns {ModelControlGroup}
     */
    getCopy() {
        if (this._controlList == null) {
            return new ModelControlGroup();
        } else {
            const controlsCopy = [this._controlList.length];
            for (let i = 0; i < this._controlList.length; i++) {
                controlsCopy[i] = this._controlList[i].getCopy(null);
            }
            const groupCopy = new ModelControlGroup();
            groupCopy.setControlList(controlsCopy);
            return groupCopy;
        }
    }
}

export default ModelControlGroup;