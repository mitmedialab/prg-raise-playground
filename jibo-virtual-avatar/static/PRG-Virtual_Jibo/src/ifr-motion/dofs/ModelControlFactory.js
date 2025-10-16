"use strict";

/**
 * Factory class for creating model controls
 * @class ModelControlFactory
 */
class ModelControlFactory {
    /**
     * @constructor
     */
    constructor() {
        /** @type {string} */
        this._controlType = null;
        this._controlConstructor = null;
    }

    /**
     * @return {string}
     */
    getControlType() {
        return this._controlType;
    }

    /**
     * @param {Object} jsonData
     * @return {ModelControl}
     */
    constructFromJson(jsonData) {
        if (jsonData.controlType !== this._controlType) {
            console.warn("ModelControlFactory<" + this._controlType + ">: don't know how to construct for control type: " + jsonData.controlType);
            return null;
        }

        const control = new this._controlConstructor();
        control.setFromJson(jsonData);
        return control;
    }

    /**
     * @param {Array.<ModelControl>} controlList
     * @return {Array.<ModelControl>}
     */
    postProcessControlList(controlList) {
        return controlList;
    }
}

export default ModelControlFactory;