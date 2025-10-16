import FileTools from "../ifr-core/FileTools.js";

/**
 * @constructor
 */
const SceneInfo = function()
{
	/** @type {string} */
	this.faceScreenMeshName = null;
	/** @type {number} */
	this.faceScreenWidth = null;
	/** @type {number} */
	this.faceScreenHeight = null;

	/** @type {string} */
	this.loadURL = null;
	/** @type {!boolean} */
	this.loadSucceeded = false;
	/** @type {string} */
	this.loadMessage = "";
};

/**
 * @param {string} url
 * @param callback
 */
SceneInfo.prototype.load = function(url, callback)
{
	this.loadURL = url;

	const self = this;
	FileTools.loadJSON(url, function(error, data)
	{
		if (error === null)
		{
			self.parseData(data);
			if (callback)
			{
				callback();
			}
		}
		else
		{
			self.loadSucceeded = false;
			self.loadMessage = error;
			if (callback)
			{
				callback();
			}
		}
	});
};

/**
 * @param {Object} jsonData
 */
SceneInfo.prototype.parseData = function(jsonData)
{
	if (jsonData.header.fileType !== "SceneInfo")
	{
		this.loadSucceeded = false;
		this.loadMessage = "don't know how to handle file type: "+jsonData.header.fileType;
		return;
	}

	this.faceScreenMeshName = jsonData.content.faceScreenMeshName;
	this.faceScreenWidth = jsonData.content.faceScreenInternalBounds[0];
	this.faceScreenHeight = jsonData.content.faceScreenInternalBounds[1];

	this.loadSucceeded = true;
};

export default SceneInfo;