"use strict";

import ModelControlGroup from "../dofs/ModelControlGroup.js";
import RotationControl from "../dofs/RotationControl.js";
import TranslationControl from "../dofs/TranslationControl.js";
import TextureControl from "../dofs/TextureControl.js";
import ColorControl from "../dofs/ColorControl.js";
import VisibilityControl from "../dofs/VisibilityControl.js";
import FileTools from "../../ifr-core/FileTools.js";

/**
 * @constructor
 */
const KinematicsLoadResult = function()
{
	/** @type {string} */
	this.url = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {string} */
	this.message = "";

	/** @type {ModelControlGroup} */
	this.modelControlGroup = null;
};

/**
 * @constructor
 */
class KinematicsLoader {
	constructor() {
		/** @type {KinematicsLoadResult} */
		this._result = null;

		/** @type {Object.<string, ModelControlFactory>} */
		this._modelControlFactoryMap = {};

		// add default model controls
		this.addModelControlFactory(new RotationControl.Factory());
		this.addModelControlFactory(new TranslationControl.Factory());
		this.addModelControlFactory(new TextureControl.Factory());
		this.addModelControlFactory(new ColorControl.Factory());
		this.addModelControlFactory(new VisibilityControl.Factory());
	}

	/**
	 * @param {ModelControlFactory} modelControlFactory
	 */
	addModelControlFactory(modelControlFactory)
	{
		this._modelControlFactoryMap[modelControlFactory.getControlType()] = modelControlFactory;
	}

	/**
	 * @param {string} controlType
	 * @return {ModelControlFactory}
	 */
	getModelControlFactory(controlType)
	{
		return this._modelControlFactoryMap[controlType];
	}

	/**
	 * @return {KinematicsLoadResult}
	 */
	getResult()
	{
		return this._result;
	}

	/**
	 * @param {string} url
	 * @param callback
	 */
	load(url, callback)
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
				var result = new KinematicsLoadResult();
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
	}

	/**
	 * @param {Object} jsonData
	 * @param {string} dataUrl
	 */
	parseData(jsonData, dataUrl)
	{
		this._result = new KinematicsLoadResult();
		this._result.url = dataUrl;

		if (jsonData.header.fileType !== "Kinematics")
		{
			this._result.success = false;
			this._result.message = "don't know how to handle file type: "+jsonData.header.fileType;
			return;
		}

		/** @type Array.<ModelControl> */
		var controlList = [];
		for (var controlIndex=0; controlIndex<jsonData.content.controls.length; controlIndex++)
		{
			var controlData = jsonData.content.controls[controlIndex];

			if (!this._modelControlFactoryMap.hasOwnProperty(controlData.controlType))
			{
				this._result.success = false;
				this._result.message = "no factory installed for control type: "+controlData.controlType+", control name = "+controlData.controlName;
				return;
			}
			else
			{
				var factory = this._modelControlFactoryMap[controlData.controlType];
				var control = factory.constructFromJson(controlData);

				if (control === null)
				{
					this._result.success = false;
					this._result.message = "factory construction failed, control type = "+controlData.controlType+", control name = "+controlData.controlName;
					return;
				}
				else
				{
					controlList.push(control);
				}
			}
		}

		var controlTypes = Object.keys(this._modelControlFactoryMap);
		for (var typeIndex=0; typeIndex<controlTypes.length; typeIndex++)
		{
			controlList = this._modelControlFactoryMap[controlTypes[typeIndex]].postProcessControlList(controlList);
		}

		this._result.modelControlGroup = new ModelControlGroup();
		this._result.modelControlGroup.setControlList(controlList);
		this._result.success = true;
	}
}

export default KinematicsLoader;
export { KinematicsLoadResult };