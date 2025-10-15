"use strict";

import TimelineEventDispatcher from "./TimelineEventDispatcher.js";

/**
 * Called when a clip's end is passed over by the current time.
 *
 * @callback Timeline~ClipStartedHandler
 */

/**
 * Called when a clip's end is passed over by the current time.
 *
 * @callback Timeline~ClipStoppedHandler
 * @param {boolean} interrupted - true if clip ended prematurely (its actual duration is less than than its underlying Motion)
 */

/**
 * Called when a clip is removed from the timeline.
 *
 * @callback Timeline~ClipRemovedHandler
 * @param {boolean} didStart - true if the clip did start through timeline advancing
 * @param {boolean} didStop - true if the clip did stop through timeline advancing
 */

/**
 * Called when a custom clip event is passed over by the current time.
 *
 * @callback Timeline~ClipEventHandler
 * @param {*} payload - custom event payload
 */

/**
 * @param {Clock} clock
 * @constructor
 */
class Timeline {
	constructor(clock) {
		/** @type {Clock} */
		this.clock = clock;
		/** @type {Object.<string, TimelineDelegate>} */
		this.delegates = {};
		/** @type {Time} */
		this.lastCullTime = null;
	}

	/**
	 *
	 * @param {string} modality
	 * @param {TimelineDelegate} delegate
	 */
	installModalityDelegate(modality, delegate)
	{
		this.delegates[modality] = delegate;
	}

	/**
	 * @return {string[]}
	 */
	getModalities()
	{
		return Object.keys(this.delegates);
	}

	/**
	 * @param {string}modality
	 *
	 * @return {TimelineDelegate}
	 */
	getModalityDelegate(modality)
	{
		return this.delegates[modality];
	}

	/**
	 * @return {Clock}
	 */
	getClock()
	{
		return this.clock;
	}

	/**
	 *
	 * @param {string} modality
	 * @param {string} name
	 * @param {Time} startTime
	 * @param {*} payload
	 * @param {string} layer
	 * @param {Timeline~ClipStartedHandler} clipStartedHandler
	 * @param {Timeline~ClipStoppedHandler} clipStoppedHandler
	 * @param {Timeline~ClipRemovedHandler} clipRemovedHandler
	 * @param {Timeline~ClipEventHandler} clipEventHandler
	 *
	 * @return {TimelineClip}
	 */
	add(modality, name, startTime, payload, layer, clipStartedHandler, clipStoppedHandler, clipRemovedHandler, clipEventHandler)
	{
		return this.delegates[modality].add(name, startTime, payload, layer, clipStartedHandler, clipStoppedHandler, clipRemovedHandler, clipEventHandler);
	}

	/**
	 *
	 * @param {string} modality
	 * @param {Time} startTime
	 * @param {Time} endTime
	 *
	 * @return {TimelineClip[]}
	 */
	getClipsInInterval(modality, startTime, endTime)
	{
		return this.delegates[modality].getClipsInInterval(startTime, endTime);
	}

	/**
	 *
	 * @param {string} modality
	 * @param {Time} time
	 *
	 * @return {*}
	 */
	getStateAtTime(modality, time)
	{
		return this.delegates[modality].getStateAtTime(time);
	}

	/**
	 *
	 * @param {string} modality
	 * @param {*} payload
	 *
	 * @return {number}
	 */
	getReactionTime(modality, payload)
	{
		return this.delegates[modality].getReactionTime(payload);
	}

	/**
	 * Must be called frequently.  Dispatches events and
	 * culls old data.
	 */
	update()
	{
		var modalities = this.getModalities();
		var i;
		for (i=0; i<modalities.length; i++)
		{
			this.delegates[modalities[i]].update();
		}

		var currentTime = this.clock.currentTime();

		if (!this.lastCullTime)
		{
			this.lastCullTime = currentTime;
		}

		if (currentTime.subtract(this.lastCullTime) > 5)
		{
			for (i=0; i<modalities.length; i++)
			{
				this.delegates[modalities[i]].cullUpToTime(currentTime.add(-2));
			}
			this.lastCullTime = currentTime;
		}

		TimelineEventDispatcher.dispatchQueuedEvents();
	}
}

export default Timeline;