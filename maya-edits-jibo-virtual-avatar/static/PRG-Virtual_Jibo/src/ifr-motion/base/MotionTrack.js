"use strict";

/**
 * @param {string} name the name of the track (usually the name of the associated DOF/control)
 * @param {TimestampedBuffer} motionData motion data
 * @param {number} length length of motion in seconds
 * @constructor
 */
const MotionTrack = function(name, motionData, length)
{
	/** @type {string} */
	this.name = name;
	/** @type {TimestampedBuffer} */
	this.motionData = motionData;
	/** @type {number} */
	this.length = length;
};

MotionTrack.prototype.clone = function(){
	return new MotionTrack(this.name, this.motionData.clone(), this.length);
};

/**
 * @return {string}
 */
MotionTrack.prototype.getName = function()
{
	return this.name;
};

/**
 * @return {number}
 */
MotionTrack.prototype.getLength = function()
{
	return this.length;
};

/**
 * @return {TimestampedBuffer}
 */
MotionTrack.prototype.getMotionData = function()
{
	return this.motionData;
};

/**
 * @param {number} time
 * @param {Interpolators.BaseInterpolator} interpolator
 * @return {*}
 */
MotionTrack.prototype.getDataAtTime = function(time, interpolator)
{
	if (this.motionData.size() === 0)
	{
		return null;
	}

	var leftIndex = this.motionData.getLeftIndexForTime(time);
	var rightIndex = leftIndex+1;
	leftIndex = Math.max(leftIndex, 0);
	rightIndex = Math.min(rightIndex, this.motionData.size()-1);

	var leftStamp = this.motionData.getTimestamp(leftIndex);
	var rightStamp = this.motionData.getTimestamp(rightIndex);
	var alpha;
	if (leftStamp === rightStamp)
	{
		alpha = 0;
	}
	else
	{
		alpha = (time - leftStamp) / (rightStamp - leftStamp);
	}

	var leftData = this.motionData.getData(leftIndex);
	var rightData = this.motionData.getData(rightIndex);

	return interpolator.interpolate(leftData, rightData, alpha);
};

MotionTrack.prototype.toString = function(){
	return "MotionTrack "+this.getName()+", length="+this.getLength()+", Data:"+this.motionData.toString();
};

export default MotionTrack;