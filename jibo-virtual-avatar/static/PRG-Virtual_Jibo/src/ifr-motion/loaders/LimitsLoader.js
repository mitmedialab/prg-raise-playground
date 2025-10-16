"use strict";

import FileTools from "../../ifr-core/FileTools.js";
import slog from "../../ifr-core/SLog.js";

const channel = "MODEL_LOADING";

/**
 * @constructor
 */
const LimitsLoadResult = function()
{
	/** @type {string} */
	this.url = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {string} */
	this.message = "";

	/** @type {Object.<string, Object>} */
	this.dofLimits = null;
};

/**
 * @constructor
 */
const LimitsLoader = function()
{
	/** @type {LimitsLoadResult} */
	this._result = null;
};

/**
 * @return {LimitsLoadResult}
 */
LimitsLoader.prototype.getResult = function()
{
	return this._result;
};

/**
 * @param {string} url
 * @param callback
 */
LimitsLoader.prototype.load = function(url, callback)
{
	var self = this;
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
			var result = new LimitsLoadResult();
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
LimitsLoader.prototype.parseData = function(jsonData, dataUrl)
{
	this._result = new LimitsLoadResult();
	this._result.url = dataUrl;

	if (jsonData.header.fileType !== "Limits")
	{
		this._result.success = false;
		this._result.message = "don't know how to handle file type: "+jsonData.header.fileType;
		return;
	}

	/** @type {Object.<string, Object>} */
	var dofLimits = {};
	var limitsList = jsonData.content.dofLimits;
	if (limitsList)
	{
		for (var i=0; i<limitsList.length; i++)
		{
			var dofName = limitsList[i].dofName;
			var limitData = limitsList[i].limits;
			if (dofName === undefined || dofName === null)
			{
				slog(channel, "LimitsLoader: skipping limit data with null or undefined dofName property");
			}
			else if (limitData === undefined || limitData === null)
			{
				slog(channel, "LimitsLoader: skipping limit data with null or undefined limits property");
			}
			else
			{
				// limit data ok!
				dofLimits[dofName] = limitData;
			}
		}
	}

	this._result.dofLimits = dofLimits;
	this._result.success = true;
};

export default LimitsLoader;