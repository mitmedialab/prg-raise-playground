export default ModelControlGroup;
/**
 * @constructor
 */
declare class ModelControlGroup {
    /** @type {Array.<ModelControl>} */
    _controlList: Array<ModelControl>;
    /** @type {string[]} */
    _dofNames: string[];
    /** @type {Object.<string, ModelControl>} */
    _dofNameToControlMap: {
        [x: string]: ModelControl;
    };
    /** @type {Object.<string, DOFInfo>} */
    _dofInfos: {
        [x: string]: DOFInfo;
    };
    /**
     * @param {Array.<ModelControl>} controlList
     */
    setControlList(controlList: Array<ModelControl>): void;
    /**
     * @return {Array.<ModelControl>}
     */
    getControlList(): Array<ModelControl>;
    /**
     * @return {string[]}
     */
    getDOFNames(): string[];
    /**
     * @param {string} dofName
     * @return {ModelControl}
     */
    getControlForDOF(dofName: string): ModelControl;
    /**
     * @param {string} dofName
     * @return {DOFInfo}
     */
    getDOFInfo(dofName: string): DOFInfo;
    /**
     * @param {THREE.Object3D} modelRoot
     * @return {!boolean}
     */
    attachToModel(modelRoot: THREE.Object3D): boolean;
    /**
     * @param {THREE.Object3D} modelRoot
     */
    attachToModelAndPrune(modelRoot: THREE.Object3D): void;
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
     * @param {string[]} dofNames
     * @return {string[]}
     */
    getRequiredTransformNamesForDOFs(dofNames: string[]): string[];
    /**
     * @param {Pose} inplacePose
     * @return {!boolean}
     */
    getPose(inplacePose: Pose): boolean;
    /**
     * Get a copy of this group, differing only in that it will by unbound to any model.
     * @returns {ModelControlGroup}
     */
    getCopy(): ModelControlGroup;
}
import DOFInfo from "./DOFInfo.js";
