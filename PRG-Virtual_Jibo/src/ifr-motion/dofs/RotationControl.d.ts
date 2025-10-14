export default RotationControl;
/**
 * @constructor
 * @extends ModelControl
 */
declare class RotationControl extends ModelControl {
    /** @type {string} */
    _skeletonFrameName: string;
    /** @type {THREE.Vector3} */
    _rotationalAxis: THREE.Vector3;
    /** @type {THREE.Quaternion} */
    _initialRotation: THREE.Quaternion;
    /** @type {number} */
    _min: number;
    /** @type {number} */
    _max: number;
    /** @type {boolean} */
    _isCyclic: boolean;
    /** @type {THREE.Object3D} */
    _skeletonFrame: THREE.Object3D;
    /**
     * @type {number}
     * @private
     */
    private _lastValue;
    /**
     * @param {THREE.Vector3 } inplaceVector3 - new vector will be created if null or omitted
     * @return {!THREE.Vector3} the rotational axis.  will be === inplaceVector3 if provided
     */
    getRotationalAxis(inplaceVector3: THREE.Vector3): THREE.Vector3;
    /**
     * @param {THREE.Quaternion } inplaceQuaternion - new vector will be created if null or omitted
     * @return {!THREE.Quaternion} the initial rotation.  will be === inplaceQuaternion if provided
     */
    getInitialRotation(inplaceQuaternion: THREE.Quaternion): THREE.Quaternion;
    /**
     * @returns {number}
     */
    getMin(): number;
    /**
     * @returns {number}
     */
    getMax(): number;
    /**
     * @returns {boolean}
     */
    isCyclic(): boolean;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {RotationControl} copyInto - optional object to copy into
     * @return {RotationControl} copy of this dof, not attached to any model
     * @override
     */
    override getCopy(copyInto: RotationControl): RotationControl;
    /**
     ** @returns {string}
     */
    getTransformName(): string;
}
declare namespace RotationControl {
    export { RotationControlFactory as Factory };
}
import ModelControl from "./ModelControl.js";
/**
 * @constructor
 */
declare class RotationControlFactory extends ModelControlFactory {
}
import ModelControlFactory from "./ModelControlFactory.js";
