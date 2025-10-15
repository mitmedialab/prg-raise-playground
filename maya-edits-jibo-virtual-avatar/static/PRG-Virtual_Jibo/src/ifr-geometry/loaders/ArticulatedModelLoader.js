import ModelLoader from "./ModelLoader.js";
import SkeletonLoader from "./SkeletonLoader.js";
import THREE from "@jibo/three";

/**
 * @constructor
 */
const ArticulatedModelLoadResult = function()
{
	/** @type {string} */
	this.modelUrl = null;
	/** @type {string} */
	this.skeletonUrl = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {string} */
	this.message = "";

	/** @type {ModelLoadResult} */
	this.modelResult = null;
	/** @type {SkeletonLoadResult} */
	this.skeletonResult = null;

	/** @type {THREE.Object3D} */
	this.modelRoot = null;
};

/**
 * @param {ModelLoader} modelLoader
 * @param {SkeletonLoader} skeletonLoader
 * @constructor
 */
const ArticulatedModelLoader = function(modelLoader, skeletonLoader)
{
	/** @type {ModelLoader} */
	this.modelLoader = modelLoader || new ModelLoader();
	/** @type {SkeletonLoader} */
	this.skeletonLoader = skeletonLoader || new SkeletonLoader();

	/** @type {ArticulatedModelLoadResult} */
	this._result = null;
};

/**
 * @return {ArticulatedModelLoadResult}
 */
ArticulatedModelLoader.prototype.getResult = function()
{
	return this._result;
};

/**
 * @param {string} modelName
 * @param {!string} modelUrl - must not be null
 * @param {string} skeletonUrl - can be null
 * @param callback
 */
ArticulatedModelLoader.prototype.load = function(modelName, modelUrl, skeletonUrl, callback)
{
	if (skeletonUrl)
	{
		const self = this;
		this.skeletonLoader.load(skeletonUrl, function()
		{
			const skeletonResult = self.skeletonLoader.getResult();
			if (skeletonResult.success)
			{
				self._loadModel(modelName, modelUrl, skeletonResult, callback);
			}
			else
			{
				const result = new ArticulatedModelLoadResult();
				result.modelUrl = modelUrl;
				result.skeletonUrl = skeletonUrl;
				result.skeletonResult = skeletonResult;
				result.success = false;
				result.message = "skeleton load failed with message: "+skeletonResult.message;
				self._result = result;
				callback();
			}
		});
	}
	else
	{
		this._loadModel(modelName, modelUrl, null, callback);
	}
};

/**
 * @param {string} modelName
 * @param {!string} modelUrl
 * @param {SkeletonLoadResult} skeletonResult
 * @param callback
 * @private
 */
ArticulatedModelLoader.prototype._loadModel = function(modelName, modelUrl, skeletonResult, callback)
{
	const self = this;
	this.modelLoader.load(modelUrl, function()
	{
		self._result = new ArticulatedModelLoadResult();
		self._result.modelUrl = modelUrl;
		self._result.skeletonUrl = skeletonResult ? skeletonResult.url : null;
		self._result.skeletonResult = skeletonResult;

		const modelResult = self.modelLoader.getResult();
		self._result.modelResult = modelResult;
		if (!modelResult.success)
		{
			self._result.success = false;
			self._result.message = "model load failed with message: "+modelResult.message;
			callback();
			return;
		}

		const modelRoot = new THREE.Object3D();
		modelRoot.name = modelName || "";

		let i;
		if (!skeletonResult)
		{
			for (i=0; i<modelResult.meshes.length; i++)
			{
				modelRoot.add(modelResult.meshes[i].mesh);
			}
		}
		else
		{
			const skeletonRoot = skeletonResult.skeletonRoot;
			modelRoot.add(skeletonRoot);

			for (i=0; i<modelResult.meshes.length; i++)
			{
				const mesh = modelResult.meshes[i];

				if (mesh.bones)
				{
					for (let b=0; b<mesh.bones.length; b++)
					{
						const boneParent = skeletonRoot.getObjectByName(mesh.boneFrameNames[b], true);
						if (boneParent)
						{
							boneParent.add(mesh.bones[b]);
						}
						else
						{
							self._result.success = false;
							self._result.message = "unable to find skeleton frame: "+mesh.boneFrameNames[b]+" required to attach bone "+b+" of mesh: "+mesh.name;
							callback();
							return;
						}
					}
					mesh.mesh.material.skinning = true;
					modelRoot.add(mesh.mesh);
				}
				else if (mesh.skeletonFrameName)
				{
					const parent = skeletonRoot.getObjectByName(mesh.skeletonFrameName, true);
					if (parent)
					{
						parent.add(mesh.mesh);
					}
					else
					{
						self._result.success = false;
						self._result.message = "unable to find skeleton frame: "+mesh.skeletonFrameName+" required to attach mesh: "+mesh.name;
						callback();
						return;
					}
				}
				else
				{
					self._result.success = false;
					self._result.message = "unable to attach mesh: "+mesh.name+" - no skeleton frame or skinning data specified";
					callback();
					return;
				}
			}
		}

		self._result.success = true;
		self._result.modelRoot = modelRoot;
		callback();
	});
};

export default ArticulatedModelLoader;
export { ArticulatedModelLoadResult };