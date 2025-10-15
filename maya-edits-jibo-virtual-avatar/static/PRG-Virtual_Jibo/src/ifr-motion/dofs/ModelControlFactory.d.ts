export default ModelControlFactory;
/**
 * Factory class for creating model controls
 * @class ModelControlFactory
 */
declare class ModelControlFactory {
    /** @type {string} */
    _controlType: string;
    _controlConstructor: any;
    /**
     * @return {string}
     */
    getControlType(): string;
    /**
     * @param {Object} jsonData
     * @return {ModelControl}
     */
    constructFromJson(jsonData: any): ModelControl;
    /**
     * @param {Array.<ModelControl>} controlList
     * @return {Array.<ModelControl>}
     */
    postProcessControlList(controlList: Array<ModelControl>): Array<ModelControl>;
}
