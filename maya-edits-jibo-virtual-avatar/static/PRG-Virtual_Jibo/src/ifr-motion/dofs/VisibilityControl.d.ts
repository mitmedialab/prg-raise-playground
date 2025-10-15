export default VisibilityControl;
/**
 * @constructor
 * @extends ModelControl
 */
declare class VisibilityControl extends ModelControl {
    /** @type {Array.<string>} */
    _meshNames: Array<string>;
    /** @type {Array.<THREE.Mesh>} */
    _meshes: Array<THREE.Mesh>;
    _lastValue: any;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {VisibilityControl} copyInto - optional object to copy into
     * @return {VisibilityControl} copy of this dof, not attached to any model
     * @override
     */
    override getCopy(copyInto: VisibilityControl): VisibilityControl;
}
declare namespace VisibilityControl {
    export { VisibilityControlFactory as Factory };
}
import ModelControl from "./ModelControl.js";
/**
 * @constructor
 */
declare class VisibilityControlFactory extends ModelControlFactory {
}
import ModelControlFactory from "./ModelControlFactory.js";
