import ArticulatedModelLoader from "../ifr-geometry/loaders/ArticulatedModelLoader.js";
import KinematicsLoader from "../ifr-motion/loaders/KinematicsLoader.js";
import TextureControl from "../ifr-motion/dofs/TextureControl.js";
import THREE from "@jibo/three";

/**
 * @param {JiboConfig} jiboConfig
 * @private
 * @constructor
 */
const JiboEye = function(jiboConfig)
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
JiboEye.prototype.setTextureLoader = function(textureLoader)
{
	this._textureLoader = textureLoader;
};

JiboEye.prototype.load = function(callback)
{
	const self = this;

	const loader = new ArticulatedModelLoader();
	loader.load("eye model", self._config.getEyeGeometryURL(), self._config.getEyeSkeletonURL(), function()
	{
		const result = loader.getResult();
		if (result.success)
		{
			self._modelRoot = result.modelRoot;

			// prepare eye overlays
			let overlayZ = 0;
			const deltaZ = 0.01;
			for (let childIndex=0; childIndex<self._modelRoot.children.length; childIndex++)
			{
				const child = self._modelRoot.children[childIndex];
				if (child instanceof THREE.SkinnedMesh)
				{
					child.material.transparent = true;
					child.frustumCulled = false;
					child.position.z = overlayZ;
					overlayZ += deltaZ;
				}
			}
			self._modelRoot.traverse(function(obj){
				if(obj instanceof THREE.Mesh)
				{ //screen background should also be transparent
					obj.material.transparent = true;
					obj.frustumCulled = false;
				}
			});

			const kinematicsLoader = new KinematicsLoader();
			/** @type {TextureControl.Factory} */
			const textureFactory = kinematicsLoader.getModelControlFactory(TextureControl.Factory.prototype._controlType);
			if (self._textureLoader)
			{
				textureFactory.setSharedImageLoader(self._textureLoader);
			}
			// Set base URL for texture path resolution
			textureFactory.setBaseURL(self._config.getRobotURL());

			kinematicsLoader.load(self._config.getEyeKinematicsURL(), function()
			{
				const kinematicsResult = kinematicsLoader.getResult();
				if (kinematicsResult.success)
				{
					self._modelControlGroup = kinematicsResult.modelControlGroup;
					self._modelControlGroup.attachToModel(self._modelRoot);

					//config for default normal map for users not specifying a normal url
					for(let ci = 0; ci < self._modelControlGroup.getControlList().length; ci++){
						if(self._modelControlGroup.getControlList()[ci].getControlType() === "TEXTURE"){
							self._modelControlGroup.getControlList()[ci].setDefaultNormalURL(self._config.getDefaultNormalMap());
						}
					}

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
JiboEye.prototype.getModelRoot = function()
{
	return this._modelRoot;
};

/**
 * @return {ModelControlGroup}
 */
JiboEye.prototype.getModelControlGroup = function()
{
	return this._modelControlGroup;
};

/**
 * @param {SceneInfo} sceneInfo
 * @return {THREE.Camera}
 */
JiboEye.prototype.constructCamera = function(sceneInfo)
{
	const camera = new THREE.OrthographicCamera(-sceneInfo.faceScreenWidth/2, sceneInfo.faceScreenWidth/2, sceneInfo.faceScreenHeight/2, -sceneInfo.faceScreenHeight/2, -20, 20);
	camera.position.set(0,0,5); //need to provide a position for lighting to work

	//could do as perspective, if having trouble with lighting:
	//const distance = 5;
	//const fov = 0.79;
	//const camera = new THREE.PerspectiveCamera(fov, sceneInfo.faceScreenWidth/sceneInfo.faceScreenHeight, distance-0.5, distance+0.5);
	//camera.position.set(0,0,distance);
	//camera.lookAt(new THREE.Vector3(0,0,0));
	//console.log("Camera matrixWorld = "+camera.matrixWorld.elements);

	camera.updateMatrixWorld(true);
	return camera;
};

/**
 * @return {THREE.Scene}
 */
JiboEye.prototype.constructScene = function()
{
	const scene = new THREE.Scene();
	scene.add(this.getModelRoot());
	return scene;
};

export default JiboEye;