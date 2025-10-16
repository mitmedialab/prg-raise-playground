import BasicFrame from "../BasicFrame.js";
import FileTools from "../../ifr-core/FileTools.js";
import THREE from "@jibo/three";

/**
 * @constructor
 */
const SkeletonLoadResult = function()
{
	/** @type {string} */
	this.url = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {string} */
	this.message = "";

	/** @type {THREE.Object3D} */
	this.skeletonRoot = null;
};

/**
 * @constructor
 */
const SkeletonLoader = function()
{
	/** @type {SkeletonLoadResult} */
	this._result = null;
};

/**
 * @return {SkeletonLoadResult}
 */
SkeletonLoader.prototype.getResult = function()
{
	return this._result;
};

/**
 * @param {string} url
 * @param callback
 */
SkeletonLoader.prototype.load = function(url, callback)
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
			const result = new SkeletonLoadResult();
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
SkeletonLoader.prototype.parseData = function(jsonData, dataUrl)
{
	this._result = new SkeletonLoadResult();
	this._result.url = dataUrl;

	if (jsonData.header.fileType !== "Skeleton")
	{
		this._result.success = false;
		this._result.message = "don't know how to handle file type: "+jsonData.header.fileType;
		return;
	}

	this._result.skeletonRoot = this._parseSkeleton(jsonData.content);
	this._result.success = true;
};

/**
 * @param {Object} jsonData
 * @return {THREE.Object3D}
 */
SkeletonLoader.prototype._parseSkeleton = function(jsonData)
{
	const obj = new THREE.Object3D();
	const frame = new BasicFrame().setFromJson(jsonData);
	obj.name = frame.name;
	obj.position.copy(frame.position);
	obj.quaternion.copy(frame.orientation);

	if (jsonData.children)
	{
		for (let i=0; i<jsonData.children.length; i++)
		{
			obj.add(this._parseSkeleton(jsonData.children[i]));
		}
	}

	return obj;
};

export default SkeletonLoader;
export { SkeletonLoadResult };