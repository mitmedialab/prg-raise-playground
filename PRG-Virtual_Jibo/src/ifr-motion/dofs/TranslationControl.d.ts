export default TranslationControl;
/**
 * @constructor
 * @extends ModelControl
 */
declare class TranslationControl extends ModelControl {
    /** @type {string} */
    _skeletonFrameName: string;
    /** @type {THREE.Vector3} */
    _initialPosition: THREE.Vector3;
    /** @type {Array.<THREE.Vector3>} */
    _translationalDirectionList: Array<THREE.Vector3>;
    /** @type {Array.<number>} */
    _minList: Array<number>;
    /** @type {Array.<number>} */
    _maxList: Array<number>;
    /** @type {THREE.Object3D} */
    _skeletonFrame: THREE.Object3D;
    _lastValue: any[];
    /**
     * @param {TranslationControl} translationControlB
     */
    appendControl(translationControlB: TranslationControl): void;
    /**
     * @param {Object.<string, Object>} dofValues
     * @param {boolean} [forceRecompute]
     * @return {THREE.Vector3} computed value (null if cannot compute)
     */
    computeFromDOFValues(dofValues: {
        [x: string]: any;
    }, forceRecompute?: boolean): THREE.Vector3;
    /**
     * @param {Pose} pose
     * @return {THREE.Vector3} computed value (null if cannot compute)
     */
    computeFromPose(pose: Pose): THREE.Vector3;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {TranslationControl} copyInto - optional object to copy into
     * @return {TranslationControl} copy of this dof, not attached to any model
     * @override
     */
    override getCopy(copyInto: TranslationControl): TranslationControl;
    /**
     ** @returns {string}
     */
    getTransformName(): string;
}
declare namespace TranslationControl {
    export { TranslationControlFactory as Factory };
}
import ModelControl from "./ModelControl.js";
/**
 * @constructor
 */
declare class TranslationControlFactory extends ModelControlFactory {
    /**
     * @param {Array.<ModelControl>} controlList
     * @return {Array.<ModelControl>}
     */
    postProcessControlList(controlList: Array<ModelControl>): Array<ModelControl>;
}
import ModelControlFactory from "./ModelControlFactory.js";
