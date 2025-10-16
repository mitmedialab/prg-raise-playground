import ArticulatedModelLoader from "../ifr-geometry/loaders/ArticulatedModelLoader.js";
import KinematicsLoader from "../ifr-motion/loaders/KinematicsLoader.js";
import TextureControl from "../ifr-motion/dofs/TextureControl.js";
import THREE from "@jibo/three";

/**
 * @param {JiboConfig} jiboConfig
 * @private
 * @constructor
 */
const JiboBody = function(jiboConfig)
{
	/** @type {JiboConfig} */
	this._config = jiboConfig;

	/** @type {CachedImageLoader} */
	this._textureLoader = null;

	/** @type {THREE.Object3D} */
	this._modelRoot = null;
	/** @type {ModelControlGroup} */
	this._modelControlGroup = null;

	/** @type {!boolean} */
	this.loadSucceeded = false;
	/** @type {string} */
	this.loadMessage = "";
};

/**
 * @param {CachedImageLoader} textureLoader
 */
JiboBody.prototype.setTextureLoader = function(textureLoader)
{
	this._textureLoader = textureLoader;
};

JiboBody.prototype.load = function(callback)
{
	const self = this;

	const loader = new ArticulatedModelLoader();
	loader.modelLoader.defaultMaterial.side = THREE.DoubleSide;

	loader.load("body model", self._config.getBodyGeometryURL(), self._config.getBodySkeletonURL(), function()
	{
		const result = loader.getResult();
		if (result.success)
		{
			self._modelRoot = result.modelRoot;

			const kinematicsLoader = new KinematicsLoader();
			/** @type {TextureControl.Factory} */
			const textureFactory = kinematicsLoader.getModelControlFactory(TextureControl.Factory.prototype._controlType);
			if (self._textureLoader)
			{
				textureFactory.setSharedImageLoader(self._textureLoader);
			}
			// Set base URL for texture path resolution
			textureFactory.setBaseURL(self._config.getRobotURL());

			kinematicsLoader.load(self._config.getBodyKinematicsURL(), function()
			{
				const kinematicsResult = kinematicsLoader.getResult();
				if (kinematicsResult.success)
				{
					self._modelControlGroup = kinematicsResult.modelControlGroup;
					self._modelControlGroup.attachToModel(self._modelRoot);

					self.loadSucceeded = true;
				}
				else
				{
					self.loadSucceeded = false;
					self.loadMessage = "kinematics load failed with message: "+kinematicsResult.message+", URL = "+kinematicsResult.url;
				}
				if (callback)
				{
					callback();
				}
			});
		}
		else
		{
			self.loadSucceeded = false;
			self.loadMessage = ""+result.message+", model URL = "+result.modelUrl+", skeleton URL = "+result.skeletonUrl;
			if (callback)
			{
				callback();
			}
		}
	});
};

/**
 * @return {THREE.Object3D}
 */
JiboBody.prototype.getModelRoot = function()
{
	return this._modelRoot;
};

/**
 * @return {ModelControlGroup}
 */
JiboBody.prototype.getModelControlGroup = function()
{
	return this._modelControlGroup;
};

/**
 * @param {SceneInfo} sceneInfo
 * @return {THREE.WebGLRenderTarget}
 */
JiboBody.prototype.constructFaceScreenRenderTarget = function(sceneInfo)
{
	const renderTexture = new THREE.WebGLRenderTarget(800, 450);
	renderTexture.minFilter = THREE.LinearFilter;

	const faceScreenMesh = this.getModelRoot().getObjectByName(sceneInfo.faceScreenMeshName, true);
	faceScreenMesh.material.map = renderTexture;

	return renderTexture;
};

export default JiboBody;
