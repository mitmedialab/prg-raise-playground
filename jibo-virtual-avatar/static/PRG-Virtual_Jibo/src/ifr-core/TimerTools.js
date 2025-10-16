/**
 * @typedef {Object} Timer
 * @property {function} stop - stops the timer
 * @intdocs
 */

/**
 * @param {function} callback - the callback
 * @param {number} intervalTimeMillis - interval in milliseconds at which to call the callback
 * @constructor
 */
const BrowserTimer = function(callback, intervalTimeMillis)
{
	const intervalHandle = setInterval(callback, intervalTimeMillis);
	this.stop = function()
	{
		clearInterval(intervalHandle);
	};
};

const workerScript = "" +
""+"var timerHandles = {};"+"\n"+
""+"self.onmessage = function(event)"+"\n"+
""+"{"+"\n"+
""+"	var command = event.data.command;"+"\n"+
""+"	var callbackID = event.data.callbackID;"+"\n"+
""+"	var callbackInterval = event.data.callbackInterval;"+"\n"+
""+"	var timerHandle = null;"+"\n"+
""+""+"\n"+
""+"	if (command === 'start')"+"\n"+
""+"	{"+"\n"+
""+"		timerHandle = setInterval(function()"+"\n"+
""+"		{"+"\n"+
""+"			self.postMessage({callbackID: callbackID});"+"\n"+
""+"		}, callbackInterval);"+"\n"+
""+"		timerHandles[callbackID] = timerHandle;"+"\n"+
""+"	}"+"\n"+
""+"	else if (command === 'stop')"+"\n"+
""+"	{"+"\n"+
""+"		timerHandle = timerHandles[callbackID];"+"\n"+
""+"		if (timerHandle !== undefined && timerHandle !== null)"+"\n"+
""+"		{"+"\n"+
""+"			clearInterval(timerHandle);"+"\n"+
""+"		}"+"\n"+
""+"	}"+"\n"+
""+"};"+"\n"+
"";

/**
 * @constructor
 */
const WebWorkerTimerFactory = function()
{
	const workerBlob = new Blob([workerScript], {type: "text/javascript"});
	const workerURL = URL.createObjectURL(workerBlob);
	const worker = new Worker(workerURL);

	/** @type {Object.<number, function>} */
	const callbackMap = {};
	let nextCallbackID = 0;

	/**
	 * @param {function} callback - the callback
	 * @param {number} intervalTimeMillis - interval in milliseconds at which to call the callback
	 * @return {Timer}
	 */
	this.createTimer = function(callback, intervalTimeMillis)
	{
		const callbackID = nextCallbackID;
		callbackMap[callbackID] = callback;
		nextCallbackID++;

		worker.postMessage({command: "start", callbackID: callbackID, callbackInterval: intervalTimeMillis});

		const timer = {};
		timer.stop = function()
		{
			callbackMap[callbackID] = null;
			worker.postMessage({command: "stop", callbackID: callbackID});
		};
		return timer;
	};

	worker.onmessage = function(event)
	{
		const callbackID = event.data.callbackID;
		const callback = callbackMap[callbackID];
		if (callback)
		{
			callback();
		}
	};
};

/** @type {WebWorkerTimerFactory} */
let timerFactory = null;
/** @type boolean */
let workersAreAllowed = true;

const TimerTools = {};

/**
 * Creates a timer to repeatedly call the specified callback with the given time interval.
 * Call stop() on the returned object to cancel/stop the timer.
 * @param {function} callback - the callback
 * @param {number} intervalTimeMillis - interval in milliseconds at which to call the callback
 * @return {Timer}
 */
TimerTools.setInterval = function(callback, intervalTimeMillis)
{
	if (intervalTimeMillis < 1000 && typeof(Worker) !== "undefined" && workersAreAllowed)
	{
		if (timerFactory === null)
		{
			try
			{
				timerFactory = new WebWorkerTimerFactory();
			}
			catch (error)
			{
				// workers aren't allowed, fail back to setInterval
				console.log("TimerTools: Worker blobs don't seem to be allowed, falling back to standard setInterval timing.");
				workersAreAllowed = false;
				return new BrowserTimer(callback, intervalTimeMillis);
			}
		}
		return timerFactory.createTimer(callback, intervalTimeMillis);
	}
	else
	{
		return new BrowserTimer(callback, intervalTimeMillis);
	}
};

/**
 * Stops the specified timer object.
 * @param {Timer} timer - the timer to stop
 */
TimerTools.clearInterval = function(timer)
{
	if (timer)
	{
		timer.stop();
	}
};

TimerTools.WebWorkerTimerFactory = WebWorkerTimerFactory;

export default TimerTools;
