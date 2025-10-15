import BasicMesh from "../BasicMesh.js";
import BasicFrame from "../BasicFrame.js";
import FileTools from "../../ifr-core/FileTools.js";
import THREE from "@jibo/three";

/**
 * @constructor
 */
const ModelLoadResult = function()
{
	/** @type {string} */
	this.url = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {string} */
	this.message = "";

	/** @type {Array.<BasicMesh>} */
	this.meshes = null;
};

/**
 * @param {THREE.MeshPhongMaterial} defaultMaterial
 * @constructor
 */
const ModelLoader = function(defaultMaterial)
{
	/** @type {THREE.MeshPhongMaterial} */
	this.defaultMaterial = defaultMaterial;
	if (!this.defaultMaterial)
	{
		this.defaultMaterial = new THREE.MeshPhongMaterial();
	}

	/** @type {string} */
	this.baseTextureURL = null;

	/** @type {ModelLoadResult} */
	this._result = null;
};

/**
 * @return {ModelLoadResult}
 */
ModelLoader.prototype.getResult = function()
{
	return this._result;
};

/**
 * @param {string} url
 * @param callback
 */
ModelLoader.prototype.load = function(url, callback)
{
	const self = this;
	FileTools.loadJSON(url, function(error, data)
	{
		if (error === null)
		{
			self.parseData(data, url);
			if (callback)
			{
				callback();
			}
		}
		else
		{
			const result = new ModelLoadResult();
			result.url = url;
			result.success = false;
			result.message = error;
			self._result = result;
			if (callback)
			{
				callback();
			}
		}
	});
};

/**
 * @param {Object} jsonData
 * @param {string} dataUrl
 */
ModelLoader.prototype.parseData = function(jsonData, dataUrl)
{
	this._result = new ModelLoadResult();
	this._result.url = dataUrl;

	if (jsonData.header.fileType !== "Meshes")
	{
		this._result.success = false;
		this._result.message = "don't know how to handle file type: "+jsonData.header.fileType;
		return;
	}

	const parentDir = dataUrl.substring(0, dataUrl.lastIndexOf('/')+1);

	this._result.meshes = [];
	for (let meshIndex=0; meshIndex<jsonData.content.meshes.length; meshIndex++)
	{
		const meshData = jsonData.content.meshes[meshIndex];

		const mesh = new BasicMesh();
		mesh.name = meshData.name;
		mesh.skeletonFrameName = meshData.skeletonFrameName;

		const geom = new THREE.BufferGeometry();

		const positionData = new Float32Array(meshData.position);
		geom.addAttribute("position", new THREE.BufferAttribute(positionData, 3));

		if (meshData.normal)
		{
			const normalData = new Float32Array(meshData.normal);
			geom.addAttribute("normal", new THREE.BufferAttribute(normalData, 3));
		}

		if (meshData.textureCoordinates)
		{
			const textureData = new Float32Array(meshData.textureCoordinates);
			geom.addAttribute("uv", new THREE.BufferAttribute(textureData, 2));
		}

		if (meshData.triangles)
		{
			const faceData = new Uint32Array(meshData.triangles);
			geom.addAttribute("index", new THREE.BufferAttribute(faceData, 3));
		}

		if (meshData.color)
		{
			const colorData = new Float32Array(meshData.color.length / 4 * 3);
			for (let i = 0; i < meshData.color.length / 4; i++)
			{
				colorData[i * 3] = meshData.color[i * 4];
				colorData[i * 3 + 1] = meshData.color[i * 4 + 1];
				colorData[i * 3 + 2] = meshData.color[i * 4 + 2];
			}
			geom.addAttribute("color", new THREE.BufferAttribute(colorData, 3));
		}

		/** @type {THREE.MeshPhongMaterial} */
		const meshMaterial = this.defaultMaterial.clone();
		meshMaterial.vertexColors = meshData.color ? THREE.VertexColors : THREE.NoColors;

		if (meshData.material)
		{
			const mat = meshData.material;
			if (mat.ambient)
			{
				meshMaterial.ambient = new THREE.Color(mat.ambient[0], mat.ambient[1], mat.ambient[2]);
			}
			if (mat.diffuse)
			{
				meshMaterial.color = new THREE.Color(mat.diffuse[0], mat.diffuse[1], mat.diffuse[2]);
			}
			if (mat.specular)
			{
				meshMaterial.specular = new THREE.Color(mat.specular[0], mat.specular[1], mat.specular[2]);
			}
			if (mat.emissive)
			{
				meshMaterial.emissive = new THREE.Color(mat.emissive[0], mat.emissive[1], mat.emissive[2]);
			}
			if (mat.shininess)
			{
				meshMaterial.shininess = mat.shininess;
			}
			if (mat.texture)
			{
				const textureURL = this.baseTextureURL ? this.baseTextureURL+mat.texture : parentDir+mat.texture;
				const texture = THREE.ImageUtils.loadTexture(textureURL);
				texture.minFilter = THREE.LinearFilter;
				meshMaterial.map = texture;
			}
		}

		if (!meshData.skin)
		{
			mesh.mesh = new THREE.Mesh(geom, meshMaterial);
			mesh.mesh.name = meshData.name;
		}
		else
		{
			mesh.mesh = new THREE.SkinnedMesh(geom, meshMaterial);
			mesh.mesh.name = meshData.name;

			const skinData = meshData.skin;
			mesh.boneFrameNames = skinData.skeletonTotalInfluences;
			const numBones = mesh.boneFrameNames.length;

			const bindFrame = new BasicFrame().setFromJson(skinData.skinBindFrame);
			const bindMatrix = bindFrame.toMatrix4();

			mesh.bones = [];
			const boneInverses = [];
			for (let b=0; b<numBones; b++)
			{
				const boneFrame = new BasicFrame().setFromJson(skinData.skinBindInverses[b]);
				boneInverses.push(boneFrame.toMatrix4());
				const bone = new THREE.Bone(mesh.mesh);
				mesh.bones.push(bone);
			}

			const skeleton = new THREE.Skeleton(mesh.bones, boneInverses, false);

			mesh.mesh.bindMode = "detached";
			mesh.mesh.bind(skeleton, bindMatrix);

			const numVertices = positionData.length / 3;
			const skinWeights = new Float32Array(skinData.skeletonWeightsByVertex);
			const skinIndices = new Float32Array(skinData.skeletonInfluencesByVertex);

			if (skinWeights.length !== numVertices*4)
			{
				this._result.success = false;
				this._result.message = "expected "+numVertices*4+" skeleton weights for mesh "+mesh.name+", but got: "+skinWeights.length;
				return;
			}
			if (skinIndices.length !== numVertices*4)
			{
				this._result.success = false;
				this._result.message = "expected "+numVertices*4+" skeleton influences for mesh "+mesh.name+", but got: "+skinIndices.length;
				return;
			}

			geom.addAttribute("skinWeight", new THREE.BufferAttribute(skinWeights, 4));
			geom.addAttribute("skinIndex", new THREE.BufferAttribute(skinIndices, 4));
		}

		this._result.meshes.push(mesh);
	}

	this._result.success = true;
};

export default ModelLoader;
export { ModelLoadResult };