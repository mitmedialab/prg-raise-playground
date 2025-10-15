"use strict";

import Motion from "./Motion.js";
import MotionEvent from "./MotionEvent.js";

/**
 * @param {Motion} motion
 * @param {MotionEvent[]} [events]
 * @constructor
 */
const AnnotatedMotion = function(motion, events)
{
	var rep = {};
	rep.motion = motion;
	events = events || [];
	rep.events = events;
	/** @type {number} */
	rep.speed = 1;

	/**
	 * @return {Motion}
	 */
	this.getMotion = function()
	{
		return rep.motion;
	};

	/**
	 * @return {number}
	 */
	this.getEventCount = function()
	{
		return rep.events.length;
	};

	/**
	 * @param {number} index
	 * @return {MotionEvent}
	 */
	this.getEvent = function(index)
	{
		return rep.events[index];
	};

	/**
	 * @return {MotionEvent[]}
	 */
	this.getEvents = function()
	{
		return rep.events;
	};

	/**
	 * @return {number}
	 */
	this.getSpeed = function()
	{
		return rep.speed;
	};

	/**
	 * Set the speed of this motion relative to the source motion.
	 * @param {number} speed - speed modifier (2 means twice as fast as the source motion)
	 */
	this.setSpeed = function(speed)
	{
		if (speed <= 0)
		{
			throw new Error("invalid speed: "+speed);
		}

		if (speed !== rep.speed)
		{
			rep.speed = speed;
			if (rep.speed === 1)
			{
				rep.motion = motion;
				rep.events = events;
			}
			else
			{
				var newMotion = new Motion(motion.getName());
				var trackKeys = Object.keys(motion.getTracks());
				for(var tki = 0; tki < trackKeys.length; tki++){
					//duplicate each dof's track
					var newTrack = motion.getTracks()[(trackKeys[tki])].clone();

					//grab the timestamps array from TimestampedBuffer
					var timestamps = newTrack.getMotionData().timestampList;
					for(var si = 0; si < timestamps.length; si++){
						//modify each timestamp
						timestamps[si] = timestamps[si]/speed;
					}

					//modify total length
					newTrack.length = newTrack.length/speed;

					newMotion.addTrack(newTrack);
				}
				rep.motion = newMotion;

				var newEvents = [];
				for (var evi = 0; evi < events.length; evi++){
					var newTimestamp = events[evi].getTimestamp()/speed;
					var eventName = events[evi].getEventName();
					var payload = events[evi].getPayload();
					newEvents.push(new MotionEvent(newTimestamp, eventName, payload));
				}
				rep.events = newEvents;
			}
		}
	};
};

export default AnnotatedMotion;