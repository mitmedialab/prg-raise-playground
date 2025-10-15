"use strict";

/**
 * @param {number} inPoint - clip start time in seconds.
 * @param {number} outPoint - clip end time in seconds.
 * @param {number} speed - speed modifier (2 means twice as fast)
 * @constructor
 */
const RelativeTimeClip = function(inPoint, outPoint, speed)
{
	if (outPoint < inPoint)
	{
		throw new Error("RelativeTimeClip: out point "+outPoint+" is less than in point "+inPoint);
	}
	if (speed < 0)
	{
		throw new Error("RelativeTimeClip: speed is negative: "+speed);
	}

	/**
	 * @return {number}
	 */
	this.getInPoint = function(){ return inPoint; };

	/**
	 * @return {number}
	 */
	this.getOutPoint = function(){ return outPoint; };

	/**
	 * @return {number}
	 */
	this.getSpeed = function(){ return speed; };

	/**
	 * @return {number}
	 */
	this.getDuration = function()
	{
		if (speed === 0)
		{
			return Number.MAX_VALUE;
		}

		var clipDuration = outPoint - inPoint;
		return clipDuration / speed;
	};

	/**
	 * Gets the time in seconds relative to the source data for the given "clip time" in seconds.
	 * @param {number} clipTime - time in seconds relative to the start of the clip
	 * @return {number} - time in seconds relative to the start of the source data
	 */
	this.getSourceTime = function(clipTime)
	{
		if (clipTime < 0)
		{
			clipTime = 0;
		}
		var sourceTime = clipTime * speed + inPoint;
		if (sourceTime > outPoint)
		{
			sourceTime = outPoint;
		}
		return sourceTime;
	};
};

export default RelativeTimeClip;
