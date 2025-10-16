"use strict";

import ModelControl from "./ModelControl.js";
import ModelControlFactory from "./ModelControlFactory.js";
// var CachedImageLoader = require("../../ifr-geometry/loaders/CachedImageLoader");
import THREE from "@jibo/three";
import slog from "../../ifr-core/SLog.js";

/**
 * @constructor
 * @extends ModelControl
 */
class TextureControl extends ModelControl {
    constructor() {
        super();

        /** @type {string} */
        this._meshName = null;

        /** @type {THREE.Mesh} */
        this._mesh = null;

        /** @type {THREE.Texture} */
        this._texture = null;

        /** @type {THREE.Texture} */
        this._normal = null;

        /** @type {THREE.DataTexture} */
        this._blankTexture = null;

        /** @type {CachedImageLoader} */
        this._imageLoader = null;

        /** @type {string} */
        this._defaultNormalURL = null;

        /** @type {ColorControl} */
        this._colorControl = null;

        /** @type {boolean} */
        this._billboardMode = true;
        
        /** @type {string} */
        this._baseURL = null;
    }

    /**
     * @param {Object} jsonData
     */
    setFromJson(jsonData) {
        super.setFromJson(jsonData);

        this._dofNames.push(jsonData.dofName);
        this._meshName = jsonData.meshName;
    }

    /**
     * @param {CachedImageLoader} imageLoader
     */
    setImageLoader(imageLoader) {
        this._imageLoader = imageLoader;
    }

    /**
     * @param {string} normalURL
     */
    setDefaultNormalURL(normalURL) {
        this._defaultNormalURL = normalURL;
    }
    
    /**
     * @param {string} baseURL
     */
    setBaseURL(baseURL) {
        this._baseURL = baseURL;
    }

    /**
     * @param {Object.<string, THREE.Object3D>} modelMap
     * @return {!boolean}
     */
    attachToModel(modelMap) {
        this._mesh = null;

        if (modelMap != null && modelMap.hasOwnProperty(this._meshName)) {
            /** @type {THREE.Texture} */
            this._texture = new THREE.Texture();
            this._texture.minFilter = THREE.LinearFilter;

            /** @type {THREE.Texture} */
            this._normal = new THREE.Texture();

            /** @type {THREE.DataTexture} */
            this._blankTexture = new THREE.DataTexture(new Uint8Array(2 * 2 * 4), 2, 2);
            this._blankTexture.minFilter = THREE.LinearFilter;

            this._mesh = modelMap[this._meshName];
            initMesh.call(this);
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Called once when control list is assigned to a group, used by controls
     * which need to make links amongst themselves.
     * @param {ModelControlGroup} controlGroup
     */
    attachToControlGroup(controlGroup) {
        /** @type {ModelControl[]} */
        const controlList = controlGroup.getControlList();
        this._colorControl = null;
        //connect to a ColorControl that contains our mesh.
        for (let i = 0; i < controlList.length; i++) {
            if (controlList[i].getControlType() === "COLOR") {
                const colorMeshNames = controlList[i]._meshNames;
                for (let j = 0; j < colorMeshNames.length; j++) {
                    if (colorMeshNames[j] === this._meshName) {
                        this._colorControl = controlList[i];
                        break;
                    }
                }
            }
            if (this._colorControl !== null) {
                break;
            }
        }
    }

    /**
     * @param {Object.<string, Object>} dofValues
     * @return {!boolean}
     */
    updateFromDOFValues(dofValues) {
        if (this._mesh && dofValues.hasOwnProperty(this._dofNames[0])) {
            const dofValue = dofValues[this._dofNames[0]];
            return updateFromDOFVal.call(this, dofValue);
        }
        else {
            return false;
        }
    }

    /**
     * @param {Pose} pose
     * @return {!boolean}
     */
    updateFromPose(pose) {
        const dofValue = pose.get(this._dofNames[0], 0);
        if (this._mesh && (dofValue != null)) //null or undefined (eqnull)
        {
            return updateFromDOFVal.call(this, dofValue);
        }
        else {
            return false;
        }
    }

    /**
     * @param {string} imageURL
     * @private
     */
    setTextureFromURL(imageURL) {
        if (this._mesh && this._texture.sourceFile !== imageURL) {
            // Resolve relative URLs to absolute URLs
            const resolvedURL = this._resolveTextureURL(imageURL);
            this._texture.sourceFile = resolvedURL;

            this._blankTexture.needsUpdate = true;
            this._mesh.material.map = this._blankTexture;

            const self = this;
            this._imageLoader.loadImage(resolvedURL, function () {
                const result = self._imageLoader.getResult();
                if (result.success && result.url === self._texture.sourceFile) {
                    self._texture.image = result.image;
                    self._texture.needsUpdate = true;
                    self._mesh.material.map = self._texture;
                }
                else if (!result.success) {
                    slog.error("TextureControl for DOF " + self._dofNames[0] + ": image load failed, URL = " + result.url);
                }
            });
        }
    }
    
    /**
     * Resolves relative texture URLs to absolute URLs
     * @param {string} url
     * @return {string}
     * @private
     */
    _resolveTextureURL(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        if (url.startsWith('/static/PRG-Virtual_Jibo')) {
            return url;
        }
        
        if (url.startsWith('/static/')) {
            return url;
        }
        
        if (url.startsWith('/')) {
            return url;
        }
        
        if (url.startsWith('res/')) {
            return '/static/PRG-Virtual_Jibo/' + url;
        }
        
        if (url.startsWith('textures/')) {
            return '/static/animations/' + url;
        }
        
        if (url.startsWith('animations/textures/')) {
            return '/static/' + url;
        }
        
        if (url.startsWith('animations/')) {
            return '/static/' + url;
        }
        
        if (this._baseURL) {
            try {
                const resolved = new URL(url, this._baseURL).href;
                const pathname = new URL(resolved).pathname;
                if (pathname.includes('/res/geometry-config/P1.0/') && pathname.includes('/static/PRG-Virtual_Jibo/')) {
                    const parts = pathname.split('/static/PRG-Virtual_Jibo/');
                    if (parts.length > 1) {
                        return '/static/PRG-Virtual_Jibo/' + parts[parts.length - 1];
                    }
                }
                return resolved;
            } catch (error) {
                console.warn('Failed to resolve texture URL:', url, 'with base:', this._baseURL);
                return url;
            }
        }
        
        return url;
    }

    /**
     * @param {string} normalURL
     * @private
     */
    setNormalFromURL(normalURL) {
        if (this._mesh && this._normal.sourceFile !== normalURL) {
            // Resolve relative URLs to absolute URLs
            const resolvedURL = this._resolveTextureURL(normalURL);
            this._normal.sourceFile = resolvedURL;

            //this._blankTexture.needsUpdate = true;
            //this._mesh.material.map = this._blankTexture;

            const self = this;
            this._imageLoader.loadImage(resolvedURL, function () {
                const result = self._imageLoader.getResult();
                if (result.success && result.url === self._normal.sourceFile) {
                    self._normal.image = result.image;
                    self._normal.needsUpdate = true;
                    if (self._mesh.material.normalMap == null) {
                        self._mesh.material.needsUpdate = true;
                    }
                    self._mesh.material.normalMap = self._normal;
                }
                else if (!result.success) {
                    slog.error("TextureControl for DOF " + self._dofNames[0] + ": normal load failed, URL = " + result.url);
                }
            });
        }
    }

    /**
     * Creates a copy of this dof, or fills in this dof's data to the provided
     * argument (to allow type to be defined by subclass's getCopy).
     *
     * @param {TextureControl} copyInto - optional object to copy into
     * @return {TextureControl} copy of this dof, not attached to any model
     * @override
     */
    getCopy(copyInto) {
        if (!copyInto) {
            copyInto = new TextureControl();
        }
        super.getCopy(copyInto);

        copyInto._meshName = this._meshName;

        copyInto._texture = this._texture ? this._texture.clone() : null;

        copyInto._imageLoader = this._imageLoader;

        copyInto._defaultNormalURL = this._defaultNormalURL;
        
        copyInto._baseURL = this._baseURL;

        return copyInto;
    }
}

TextureControl.prototype._controlType = "TEXTURE";

/**
 * call once after a new mesh is attached to set colors for current render mode,
 * and cache original colors to be restored
 */
function initMesh() {
    //save the specular value in the mesh itself.  this way it will be preserved
    //to be re-enabled even if a new TextureControl is attached.
    if (this._mesh.material._specular_disabled == null) { //null or undefined (eqnull)
        this._mesh.material._specular_disabled = new THREE.Color(this._mesh.material.specular);
    }
    if (this._billboardMode) {
        this._mesh.material.ambient.setRGB(0, 0, 0);
        this._mesh.material.specular.setRGB(0, 0, 0);
    } else {
        this._mesh.material.ambient.setRGB(1, 1, 1);
        this._mesh.material.specular.set(this._mesh.material._specular_disabled);
    }
}

/**
 *
 * @param {boolean} billboardMode
 */
function setBillboardMode(billboardMode) {
    if (this._colorControl !== null) {
        this._colorControl.setBillboardMode(billboardMode);
    }
    if (billboardMode !== this._billboardMode) {
        if (this._mesh !== null) {
            //color control will handle emissive/diffuse
            //we must handle ambient
            if (billboardMode) {
                this._mesh.material.ambient.setRGB(0, 0, 0);
                this._mesh.material.specular.setRGB(0, 0, 0);
            } else {
                this._mesh.material.ambient.setRGB(1, 1, 1);
                this._mesh.material.specular.set(this._mesh.material._specular_disabled); //stored here by initMesh
            }
        }
        this._billboardMode = billboardMode;
    }
}

/**
 * @param {number|string} dofValue
 * @return {!boolean}
 */
function updateFromDOFVal(dofValue) {
    if (typeof (dofValue) === "string") {
        setBillboardMode.call(this, true); //fallback mode, string only, choose billboard
        this.setTextureFromURL(dofValue);
        return true;
    }
    else if (typeof (dofValue) === "object") {
        const url = dofValue.textureURL;
        let useNormals = dofValue.useNormals;
        const normalURL = dofValue.normalURL;
        if (useNormals == null) { //null or undefined (eqnull)
            if (normalURL == null) { //neither key set, no normals
                useNormals = false;
            } else { //useNormals missing, but normalURL present, use normals
                useNormals = true;
            }
        }

        if (useNormals === true && normalURL == null) {
            normalURL = this._defaultNormalURL;
        }

        if (useNormals === true) {
            this.setNormalFromURL(normalURL);
        }

        setBillboardMode.call(this, !useNormals);

        if (url == null) { //null or undefined (eqnull)
            slog.error("Value for DOF " + this._dofNames[0] + " is object, but did not contain field \"textureURL\"");
        } else {
            this.setTextureFromURL(url);
        }
    }
    else if (typeof (dofValue) === "number") {
        slog.error("TextureControl for DOF " + this._dofNames[0] + ": numerical values (image indices) are no longer supported, use full image URL instead");
        return false;
    }
    else {
        return false;
    }
}

/**
 * @constructor
 */
class TextureControlFactory extends ModelControlFactory {
    constructor() {
        super();
        this._controlType = "TEXTURE";
        this._controlConstructor = TextureControl;
        /** @type {CachedImageLoader} */
        this._sharedImageLoader = null;
        
        /** @type {string} */
        this._baseURL = null;
    }

    /**
     * @param {CachedImageLoader} sharedImageLoader
     */
    setSharedImageLoader(sharedImageLoader) {
        this._sharedImageLoader = sharedImageLoader;
    }
    
    /**
     * @param {string} baseURL
     */
    setBaseURL(baseURL) {
        this._baseURL = baseURL;
    }

    /**
     * @param {Object} jsonData
     * @return {ModelControl}
     */
    constructFromJson(jsonData) {
        /** @type {TextureControl} */
        const textureControl = super.constructFromJson(jsonData);
        if (textureControl) {
            textureControl.setImageLoader(this._sharedImageLoader);
            if (this._baseURL) {
                textureControl.setBaseURL(this._baseURL);
            }
        }
        return textureControl;
    }
}

TextureControlFactory.prototype._controlType = TextureControl.prototype._controlType;
TextureControlFactory.prototype._controlConstructor = TextureControl;

// Attach Factory to main class for backward compatibility
TextureControl.Factory = TextureControlFactory;

export default TextureControl;