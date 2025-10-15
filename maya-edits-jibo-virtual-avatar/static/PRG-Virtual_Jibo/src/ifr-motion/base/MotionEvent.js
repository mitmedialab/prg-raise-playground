"use strict";

/**
 * @param {number} timestamp
 * @param {string} eventName
 * @param {*} payload
 * @constructor
 */
const MotionEvent = function(timestamp, eventName, payload)
{
	/**
	 * @return {number}
	 */
	this.getTimestamp = function(){ return timestamp; };

	/**
	 * @return {string}
	 */
	this.getEventName = function(){ return eventName; };

	/**
	 * @return {*}
	 */
	this.getPayload = function(){ return payload; };
};

export default MotionEvent;