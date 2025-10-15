export default TextureControl;
/**
 * @constructor
 * @extends ModelControl
 */
declare class TextureControl extends ModelControl {
    /** @type {string} */
    _meshName: string;
    /** @type {THREE.Mesh} */
    _mesh: THREE.Mesh;
    /** @type {THREE.Texture} */
    _texture: THREE.Texture;
    /** @type {THREE.Texture} */
    _normal: THREE.Texture;
    /** @type {THREE.DataTexture} */
    _blankTexture: THREE.DataTexture;
    /** @type {CachedImageLoader} */
    _imageLoader: CachedImageLoader;
    /** @type {string} */
    _defaultNormalURL: string;
    /** @type {ColorControl} */
    _colorControl: ColorControl;
    /** @type {boolean} */
    _billboardMode: boolean;
    /** @type {string} */
    _baseURL: string;
    /**
     * @param {CachedImageLoader} imageLoader
     */
    setImageLoader(imageLoader: CachedImageLoader): void;
    /**
     * @param {string} normalURL
     */
    setDefaultNormalURL(normalURL: string): void;
    /**
     * @param {string} baseURL
     */
    setBaseURL(baseURL: string): void;
    /**
     * @param {string} imageURL
     * @private
     */
    private setTextureFromURL;
    /**
     * Resolves relative texture URLs to absolute URLs
     * @param {string} url
     * @return {string}
     * @private
     */
    private _resolveTextureURL;
    /**
     * @param {string} normalURL
     * @private
     */
    private setNormalFromURL;
    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {TextureControl} copyInto - optional object to copy into
     * @return {TextureControl} copy of this dof, not attached to any model
     * @override
     */
    override getCopy(copyInto: TextureControl): TextureControl;
}
declare namespace TextureControl {
    export { TextureControlFactory as Factory };
}
import ModelControl from "./ModelControl.js";
/**
 * @constructor
 */
declare class TextureControlFactory extends ModelControlFactory {
    /** @type {CachedImageLoader} */
    _sharedImageLoader: CachedImageLoader;
    /** @type {string} */
    _baseURL: string;
    /**
     * @param {CachedImageLoader} sharedImageLoader
     */
    setSharedImageLoader(sharedImageLoader: CachedImageLoader): void;
    /**
     * @param {string} baseURL
     */
    setBaseURL(baseURL: string): void;
    /**
     * @param {Object} jsonData
     * @return {ModelControl}
     */
    constructFromJson(jsonData: any): ModelControl;
}
import ModelControlFactory from "./ModelControlFactory.js";
