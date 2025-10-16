"use strict";

import Interpolators from "./Interpolators.js";
import TextureControl from "../dofs/TextureControl.js";
import VisibilityControl from "../dofs/VisibilityControl.js";

/**
 * @constructor
 */
const InterpolatorSet = function()
{
	/** @type {Object.<string, Interpolators.BaseInterpolator>} */
	this.interpolatorSet = {};
};

/**
 * associate an interpolator with a specified DOF
 * @param {string} dofName
 * @param {Interpolators.BaseInterpolator} interpolator
 */
InterpolatorSet.prototype.addInterpolator = function(dofName, interpolator)
{
	this.interpolatorSet[dofName] = interpolator;
};

/**
 * get the interpolator associated with the specified DOF, or null if none is set
 * @param {string} dofName
 * @return {Interpolators.BaseInterpolator}
 */
InterpolatorSet.prototype.getInterpolator = function(dofName)
{
	var interpolator = this.interpolatorSet[dofName];
	return (interpolator !== undefined) ? interpolator : null;
};

/**
 * add interpolators for all of the DOFs in the specified ModelControlGroup
 * @param {ModelControlGroup} modelControlGroup
 */
InterpolatorSet.prototype.addModelControlGroup = function(modelControlGroup)
{
	var controlList = modelControlGroup.getControlList();
	for (var controlIndex=0; controlIndex<controlList.length; controlIndex++)
	{
		var modelControl = controlList[controlIndex];
		var dofNames = modelControl.getDOFNames();

		for (var dofIndex=0; dofIndex<dofNames.length; dofIndex++)
		{
			if (modelControl instanceof TextureControl || modelControl instanceof VisibilityControl)
			{
				this.addInterpolator(dofNames[dofIndex], new Interpolators.DOFSampleInterpolator(new Interpolators.StepInterpolator()));
			}
			else
			{
				this.addInterpolator(dofNames[dofIndex], new Interpolators.DOFSampleInterpolator(new Interpolators.LinearInterpolator()));
			}
		}
	}
};

export default InterpolatorSet;