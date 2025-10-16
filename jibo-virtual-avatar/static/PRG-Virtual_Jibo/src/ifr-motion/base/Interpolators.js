"use strict";

const Interpolators = {};

/**
 * @constructor
 */
Interpolators.BaseInterpolator = function()
{
};

/**
 * Interpolate between two samples based on interpolation factor alpha.
 * alpha === 0 : sampleA-only; alpha === 1 : sampleB-only
 * @param {*} sampleA
 * @param {*} sampleB
 * @param {number} alpha interpolation factor
 * @return {*}
 */
Interpolators.BaseInterpolator.prototype.interpolate = function(sampleA, sampleB, alpha) // eslint-disable-line no-unused-vars
{
	return sampleA;
};

/**
 * @param {number} [alphaThreshold]
 * @constructor
 */
Interpolators.StepInterpolator = function(alphaThreshold)
{
	Interpolators.BaseInterpolator.call(this);
	/** @type {number} */
	this.alphaThreshold = (alphaThreshold !== undefined) ? alphaThreshold : 1;
};

Interpolators.StepInterpolator.prototype = Object.create(Interpolators.BaseInterpolator.prototype);
Interpolators.StepInterpolator.prototype.constructor = Interpolators.StepInterpolator;

Interpolators.StepInterpolator.prototype.interpolate = function(sampleA, sampleB, alpha)
{
	return (alpha < this.alphaThreshold) ? sampleA : sampleB;
};

/**
 * @constructor
 */
Interpolators.LinearInterpolator = function()
{
	Interpolators.BaseInterpolator.call(this);
};

Interpolators.LinearInterpolator.prototype = Object.create(Interpolators.BaseInterpolator.prototype);
Interpolators.LinearInterpolator.prototype.constructor = Interpolators.LinearInterpolator;

/**
 * Linearly interpolate between two numerical samples based on interpolation factor alpha.
 * alpha === 0 : sampleA-only; alpha === 1 : sampleB-only
 * @param {number} sampleA
 * @param {number} sampleB
 * @param {number} alpha interpolation factor
 * @return {number}
 */
Interpolators.LinearInterpolator.prototype.interpolate = function(sampleA, sampleB, alpha)
{
	return (1-alpha)*sampleA + alpha*sampleB;
};

/**
 * @param {Interpolators.BaseInterpolator} positionInterpolator
 * @param {Interpolators.BaseInterpolator} [derivativeInterpolator]
 * @constructor
 */
Interpolators.DOFSampleInterpolator = function(positionInterpolator, derivativeInterpolator)
{
	Interpolators.BaseInterpolator.call(this);
	/** @type {Interpolators.BaseInterpolator} */
	this.positionInterpolator = positionInterpolator;
	/** @type {Interpolators.BaseInterpolator} */
	this.derivativeInterpolator = (derivativeInterpolator !== undefined) ? derivativeInterpolator : new Interpolators.LinearInterpolator();
};

Interpolators.DOFSampleInterpolator.prototype = Object.create(Interpolators.BaseInterpolator.prototype);
Interpolators.DOFSampleInterpolator.prototype.constructor = Interpolators.DOFSampleInterpolator;

/**
 * Interpolate between two DOF samples based on interpolation factor alpha.
 * @param {Array|*} sampleA
 * @param {Array|*} sampleB
 * @param {number} alpha
 * @return {Array}
 */
Interpolators.DOFSampleInterpolator.prototype.interpolate = function(sampleA, sampleB, alpha)
{
	if (!(sampleA instanceof Array))
	{
		sampleA = [sampleA];
	}
	if (!(sampleB instanceof Array))
	{
		sampleB = [sampleB];
	}

	var result = [];
	var derivativeLength = Math.min(sampleA.length, sampleB.length);

	for (var derivativeIndex=0; derivativeIndex<derivativeLength; derivativeIndex++)
	{
		if (derivativeIndex === 0)
		{
			result.push(this.positionInterpolator.interpolate(sampleA[derivativeIndex], sampleB[derivativeIndex], alpha));
		}
		else
		{
			result.push(this.derivativeInterpolator.interpolate(sampleA[derivativeIndex], sampleB[derivativeIndex], alpha));
		}
	}

	return result;
};

export default Interpolators;