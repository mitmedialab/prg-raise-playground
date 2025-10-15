"use strict";

/**
 * @param {MotionEvent[]} motionEvents
 * @param {RelativeTimeClip} clip
 * @constructor
 */
const MotionEventIterator = function(motionEvents, clip)
{
	motionEvents = motionEvents || [];
	var eventIndex = 0;

	var self = this;

	/**
	 * Gets whether or not there is at least one event available for the given clip time.
	 * @param {number} clipTime - clip time in seconds
	 * @return {boolean}
	 */
	this.hasNext = function(clipTime)
	{
		// skip events before the clip in-point
		while (eventIndex < motionEvents.length && motionEvents[eventIndex].getTimestamp() < clip.getInPoint())
		{
			eventIndex++;
		}

		var sourceTime = clip.getSourceTime(clipTime);
		return (eventIndex < motionEvents.length && motionEvents[eventIndex].getTimestamp() <= sourceTime);
	};

	/**
	 * Gets the next event for the given clip time, or null if there is no such event available.
	 * @param {number} clipTime - clip time in seconds
	 * @return {MotionEvent}
	 */
	this.next = function(clipTime)
	{
		if (self.hasNext(clipTime))
		{
			var event = motionEvents[eventIndex];
			eventIndex++;
			return event;
		}
		else
		{
			return null;
		}
	};

	/**
	 * Resets the iterator back to the beginning of the event list.
	 */
	this.reset = function()
	{
		eventIndex = 0;
	};
};

export default MotionEventIterator;
