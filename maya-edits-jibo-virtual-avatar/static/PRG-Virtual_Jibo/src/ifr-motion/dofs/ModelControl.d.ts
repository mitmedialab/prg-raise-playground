export default ModelControl;
/**
 * Base class for model controls
 * @class ModelControl
 */
declare class ModelControl {
    /** @type {Array.<string>} */
    _controlNames: Array<string>;
    /** @type {Array.<string>} */
    _dofNames: Array<string>;
    /**
     * @param {Object} jsonData
     */
    setFromJson(jsonData: any): void;
    /**
     * @return {string}
     */
    getControlType(): string;
    /**
     * @return {Array.<string>}
     */
    getControlNames(): Array<string>;
    /**
     * @return {Array.<string>}
     */
    getDOFNames(): Array<string>;
    /**
     * @return {Array.<string>}
     */
    getTransformNames(): Array<string>;
    /**
     * @return {string}
     */
    getDescriptiveName(): string;
    /**
     * @param {Object.<string, THREE.Object3D>} modelMap
     * @return {!boolean}
     */
    attachToModel(modelMap: {
        [x: string]: THREE.Object3D;
    }): boolean;
    /**
     * Called once when control list is assigned to a group, used by controls
     * which need to make links amongst themselves.
     * @param {ModelControlGroup} controlGroup
     */
    attachToControlGroup(controlGroup: ModelControlGroup): void;
    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     */
    updateFromDOFValues(dofValues: {
        [x: string]: any;
    }): boolean;
    /**
     * @param {Pose} pose
     * @return {!boolean}
     */
    updateFromPose(pose: Pose): boolean;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {ModelControl} copyInto - optional object to copy into
     * @return {ModelControl} copy of this dof, not attached to any model
     */
    getCopy(copyInto: ModelControl): ModelControl;
    /** @type {string} */
    _controlType: string;
}
