export default DOFInfo;
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
declare class DOFInfo {
    /**
     * @constructor
     * @param {string} dofName - Protected constructor parameter.
     * @param {ModelControl} modelControl - Protected constructor parameter.
     */
    constructor(dofName: string, modelControl: ModelControl);
    /** @type {string} */
    /** @private */
    private _dofName;
    /** @type {string} */
    /** @private */
    private _controlType;
    /** @type {boolean} */
    /** @private */
    private _isMetric;
    /** @type {boolean} */
    /** @private */
    private _isCyclic;
    /** @type {number} */
    /** @private */
    private _min;
    /** @type {number} */
    /** @private */
    private _max;
    /** @type {Object.<string, number>} */
    /** @private */
    private _limitData;
    /**
     * @param {ModelControl} modelControl
     * @private
     */
    private setFromModelControl;
    /**
     * @return {string}
     */
    getDOFName(): string;
    /**
     * Gets the control type associated with this DOF.
     * @method jibo.animate.DOFInfo#getControlType
     * @return {string}
     */
    getControlType(): string;
    /**
     * Returns whether or not this DOF exists in a metric space, i.e.
     * with a meaningful distance function, a well-defined minimum and maximum, etc.
     * @method jibo.animate.DOFInfo#isMetric
     * @return {boolean}
     */
    isMetric(): boolean;
    /**
     * Returns whether or not this DOF is cyclical (for example, a continuous rotational joint).
     * @method jibo.animate.DOFInfo#isCyclic
     * @return {boolean}
     */
    isCyclic(): boolean;
    /**
     * Returns the minimum value for this DOF (may be undefined).
     * @method jibo.animate.DOFInfo#getMin
     * @return {number}
     */
    getMin(): number;
    /**
     * Returns the maximum value for this DOF (may be undefined).
     * @method jibo.animate.DOFInfo#getMax
     * @return {number}
     */
    getMax(): number;
    /**
     * Sets optional limit values.
     * @param {Object.<string, number>} limitData
     * @private
     */
    private setLimitData;
    /**
     * Returns the value for the specified limit (may be undefined).
     * @method jibo.animate.DOFInfo#getLimit
     * @param {string} limitName - The requested limit (e.g. "velocity").
     * @return {number} - The limit value, or undefined if no limit is specified.
     */
    getLimit(limitName: string): number;
}
