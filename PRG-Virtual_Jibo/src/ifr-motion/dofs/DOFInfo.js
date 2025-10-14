"use strict";

/**
 * Protected constructor for internal use only.
 *
 * @param {string} dofName - Protected constructor parameter.
 * @param {ModelControl} modelControl - Protected constructor parameter.
 * @class DOFInfo
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
class DOFInfo {
    /**
     * @constructor
     * @param {string} dofName - Protected constructor parameter.
     * @param {ModelControl} modelControl - Protected constructor parameter.
     */
    constructor(dofName, modelControl) {
        /** @type {string} */
        /** @private */
        this._dofName = dofName;

        /** @type {string} */
        /** @private */
        this._controlType = null;
        /** @type {boolean} */
        /** @private */
        this._isMetric = false;
        /** @type {boolean} */
        /** @private */
        this._isCyclic = false;
        /** @type {number} */
        /** @private */
        this._min = undefined;
        /** @type {number} */
        /** @private */
        this._max = undefined;

        /** @type {Object.<string, number>} */
        /** @private */
        this._limitData = {};

        this.setFromModelControl(modelControl);
    }

    /**
     * @param {ModelControl} modelControl
     * @private
     */
    setFromModelControl(modelControl) {
        this._controlType = modelControl.getControlType();
        this._isMetric = (this._controlType !== "TEXTURE" && this._controlType !== "VISIBILITY");
        this._isCyclic = (this._controlType === "ROTATION" && modelControl.isCyclic());

        if (this._controlType === "ROTATION") {
            this._min = this._isCyclic ? -Math.PI : modelControl.getMin();
            this._max = this._isCyclic ? Math.PI : modelControl.getMax();
        }
        else if (this._controlType === "TRANSLATION") {
            const dofIndex = modelControl.getDOFNames().indexOf(this._dofName);
            if (dofIndex > -1) {
                this._min = modelControl._minList[dofIndex];
                this._max = modelControl._maxList[dofIndex];
            }
        }
        else if (this._controlType === "COLOR") {
            this._min = 0;
            this._max = 1;
        }
    }

    /**
     * @return {string}
     */
    getDOFName() {
        return this._dofName;
    }

    /**
     * Gets the control type associated with this DOF.
     * @method jibo.animate.DOFInfo#getControlType
     * @return {string}
     */
    getControlType() {
        return this._controlType;
    }

    /**
     * Returns whether or not this DOF exists in a metric space, i.e.
     * with a meaningful distance function, a well-defined minimum and maximum, etc.
     * @method jibo.animate.DOFInfo#isMetric
     * @return {boolean}
     */
    isMetric() {
        return this._isMetric;
    }

    /**
     * Returns whether or not this DOF is cyclical (for example, a continuous rotational joint).
     * @method jibo.animate.DOFInfo#isCyclic
     * @return {boolean}
     */
    isCyclic() {
        return this._isCyclic;
    }

    /**
     * Returns the minimum value for this DOF (may be undefined).
     * @method jibo.animate.DOFInfo#getMin
     * @return {number}
     */
    getMin() {
        return this._min;
    }

    /**
     * Returns the maximum value for this DOF (may be undefined).
     * @method jibo.animate.DOFInfo#getMax
     * @return {number}
     */
    getMax() {
        return this._max;
    }

    /**
     * Sets optional limit values.
     * @param {Object.<string, number>} limitData
     * @private
     */
    setLimitData(limitData) {
        const limitKeys = Object.keys(limitData);
        for (let i = 0; i < limitKeys.length; i++) {
            this._limitData[limitKeys[i]] = limitData[limitKeys[i]];
        }
    }

    /**
     * Returns the value for the specified limit (may be undefined).
     * @method jibo.animate.DOFInfo#getLimit
     * @param {string} limitName - The requested limit (e.g. "velocity").
     * @return {number} - The limit value, or undefined if no limit is specified.
     */
    getLimit(limitName) {
        return this._limitData[limitName];
    }
}

export default DOFInfo;
