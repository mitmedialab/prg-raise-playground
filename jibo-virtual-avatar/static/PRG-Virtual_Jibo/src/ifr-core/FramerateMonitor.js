"use strict";

import Clock from "./Clock.js";
import slog from "./SLog.js";

/**
 * constructs a new framerate monitor.
 * @param {number} updateIntervalSeconds - the period at which the framerate measurement will be updated
 * @param {string} [slogChannel] - if specified, at every measurement the framerate will be printed to the given slog channel
 * @param {string} [prefixText] - prefix text for the framerate printout, defaults to 'fps: '
 * @param {boolean} [enableLatency] - track and print the max latency (time between updates) in the current period
 * @constructor
 */
const FramerateMonitor = function(updateIntervalSeconds, slogChannel, prefixText, enableLatency)
{
	const channel = (slogChannel !== undefined) ? slogChannel : null;
	const prefix = (prefixText !== undefined) ? prefixText : "fps: ";
	const trackLatency = (enableLatency !== undefined) ? enableLatency : false;

	let updateCount = 0;
	let lastFramerateUpdateTime = Clock.currentTime();
	let updatesPerSecond = 0;

	let lastFrameTime = null;
	let highestLatencyForPeriod = 0;
	let highestLatencyEver = 0;


	const self = this;

	this.update = function()
	{
		updateCount++;
		if(trackLatency){
			const ct = Clock.currentTime();
			if(lastFrameTime !== null){
				const l = ct.subtract(lastFrameTime);
				if(l > highestLatencyForPeriod){
					highestLatencyForPeriod = l;
					if(l > highestLatencyEver){
						highestLatencyEver = l;
					}
				}
			}
			lastFrameTime = ct;
		}
	};

	this.getUpdateFunction = function()
	{
		return function(){ self.update(); };
	};

	this.getFramerate = function()
	{
		return updatesPerSecond;
	};

	this.getHighestLatencyInPeriod = function()
	{
		return highestLatencyForPeriod;
	};

	this.getHighestLatencyEver= function()
	{
		return highestLatencyEver;
	};

	const updateFramerate = function()
	{
		const currentTime = Clock.currentTime();
		updatesPerSecond = updateCount / (currentTime.subtract(lastFramerateUpdateTime));
		updateCount = 0;
		lastFramerateUpdateTime = currentTime;

		if (channel !== null)
		{
			if(trackLatency) {
				slog(channel, "" + prefix + updatesPerSecond+" maxDelta: (peroid)"+highestLatencyForPeriod+", (lifetime)"+highestLatencyEver);
			}else{
				slog(channel, "" + prefix + updatesPerSecond);
			}
		}

		highestLatencyForPeriod = 0;
	};

	const updateIntervalMillis = Math.round(updateIntervalSeconds * 1000);
	setInterval(updateFramerate, updateIntervalMillis);
};

export default FramerateMonitor;
