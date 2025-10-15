export default ColorControl;
/**
 * @constructor
 * @extends ModelControl
 */
declare class ColorControl extends ModelControl {
    /** @type {Array.<string>} */
    _meshNames: Array<string>;
    /** @type {Array.<string>} */
    _ledNames: Array<string>;
    /** @type {Array.<THREE.Mesh>} */
    _meshes: Array<THREE.Mesh>;
    /**
     * @type {boolean}
     * @private
     */
    private _billboardMode;
    /**
     *
     * @param {boolean} billboard - true for billboard (emissive) mode, false for normal (diffuse) mode
     */
    setBillboardMode(billboard: boolean): void;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {ColorControl} copyInto - optional object to copy into
     * @return {ColorControl} copy of this dof, not attached to any model
     * @override
     */
    override getCopy(copyInto: ColorControl): ColorControl;
}
declare namespace ColorControl {
    export { ColorControlFactory as Factory };
}
import ModelControl from "./ModelControl.js";
/**
 * @constructor
 */
declare class ColorControlFactory extends ModelControlFactory {
}
import ModelControlFactory from "./ModelControlFactory.js";
