"use strict";

import FileTools from "./FileTools.js";
import slog from "./SLog.js";

/**
 * Implementation of the Bakery that provides data from a serialized JSON object.
 *
 * @param {object|string} bakeryData - Bakery data object or URL to load for data.
 * @constructor
 */
const JSONBaker = function(bakeryData)
{
	let initData = null;
	let url = null;
	if (typeof bakeryData === "string")
	{
		url = bakeryData;
	}
	else
	{
		initData = bakeryData;
	}

	this._dataRoot = {};
	this._defaultScopeName = "default";

	if (initData)
	{
		this._dataRoot = initData;
	}
	if (url)
	{
		const self = this;
		FileTools.loadJSON(url, function(error, data)
		{
			if (error)
			{
				slog.error("JSONBaker: failed to load data, url: "+url+" error: "+error);
			}
			else
			{
				self._dataRoot = data;
			}
		});
	}
};

JSONBaker.prototype._getScope = function(tabName)
{
	if (!tabName)
	{
		tabName = this._defaultScopeName;
	}
	if (tabName instanceof Array)
	{
		let scope = this._dataRoot;
		for (let i = 0; i < tabName.length; i++)
		{
			if (typeof scope[tabName[i]] !== "object")
			{
				scope[tabName[i]] = {};
			}
			scope = scope[tabName[i]];
		}
		return scope;
	}
	else
	{
		if (typeof this._dataRoot[tabName] !== "object")
		{
			this._dataRoot[tabName] = {};
		}
		return this._dataRoot[tabName];
	}
};

JSONBaker.prototype.getFloat = function(name, min, max, initial, tabName)
{
	const scope = this._getScope(tabName);
	let value = scope[name];
	if (value === undefined || value === null)
	{
		value = initial;
		scope[name] = value;
	}
	return value;
};

JSONBaker.prototype.getBoolean = function(name, initial, tabName)
{
	const scope = this._getScope(tabName);
	let value = scope[name];
	if (value === undefined || value === null)
	{
		value = initial;
		scope[name] = value;
	}
	return value;
};

JSONBaker.prototype.makeButton = function(name, callback, tabName) // eslint-disable-line no-unused-vars
{
};

JSONBaker.prototype.showText = function(name, text, tabName) // eslint-disable-line no-unused-vars
{
};

JSONBaker.prototype.getData = function()
{
	return this._dataRoot;
};

JSONBaker.prototype.setProperty = function(property, value)
{
	const elements = property.split('/');
	const name = elements[elements.length-1];
	let tabName = null;
	if (elements.length > 1)
	{
		tabName = elements.slice(0, elements.length-1);
	}
	const scope = this._getScope(tabName);
	scope[name] = value;
};

export default JSONBaker;
