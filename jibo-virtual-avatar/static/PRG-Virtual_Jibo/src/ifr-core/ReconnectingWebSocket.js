"use strict";

import slog from "./SLog.js";

/**
 * @param {string} url - socket URL
 * @param {string|string[]} [protocolInfo] - optional sub-protocol info string(s)
 * @param {number} [reconnectDelayMillis] - optional milliseconds to wait before attempting reconnect, -1 to disable reconnect
 * @param {string} [channelName] - optional debugging channel name
 * @constructor
 */
const ReconnectingWebSocket = function(url, protocolInfo, reconnectDelayMillis, channelName)
{
	/** @type {string} */
	this._url = url;
	/** @type {string|string[]} */
	this._protocolInfo = protocolInfo || null;
	/** @type {string} */
	this._channelName = channelName || "SOCKET";
	/** @type {number} */
	this._reconnectDelayMillis = 3000;
	if (reconnectDelayMillis !== null && reconnectDelayMillis !== undefined)
	{
		this._reconnectDelayMillis = reconnectDelayMillis;
	}
	this._originalReconnectDelayMillis = this._reconnectDelayMillis;

	/** @type {WebSocket} */
	this._socket = null;
	/** @type {Object<string,function[]>} */
	this._listenerMap = {};
	/** @type {boolean} */
	this._shouldClose = false;
	/** @type {number} */
	this._sendsSinceLastFailure = 0;
	/** @type {number} */
	this._sequentialSocketFailures = 0;

	this._connect();
};

/**
 * @return {boolean} - true if the socket is open and ready to communicate
 */
ReconnectingWebSocket.prototype.isConnected = function()
{
	return this._socket !== null && this._socket.readyState === WebSocket.OPEN;
};

/**
 * Adds a callback for the specified event type.
 * @param {string} eventType
 * @param {function} callback
 */
ReconnectingWebSocket.prototype.on = function(eventType, callback)
{
	if (!this._listenerMap.hasOwnProperty(eventType))
	{
		this._listenerMap[eventType] = [];
	}
	this._listenerMap[eventType].push(callback);
};

/**
 * Removes a callback for the specified event type.
 * @param {string} eventType
 * @param {function} callback
 */
ReconnectingWebSocket.prototype.off = function(eventType, callback)
{
	const listeners = this._listenerMap[eventType];
	if (listeners && listeners.indexOf(callback) !== -1)
	{
		listeners.splice(listeners.indexOf(callback), 1);
	}
};

/**
 * Sends data via this socket.
 * @param {string} data
 */
ReconnectingWebSocket.prototype.send = function(data)
{
	if (this.isConnected())
	{
		// Browser WebSocket API doesn't expose bufferedAmount in the same way as Node.js
		// Use simpler detection for browser compatibility
		try {
			this._socket.send(data);
			// Track successful sends
			if (this._sendsSinceLastFailure < 5 && ++this._sendsSinceLastFailure >= 5) {
				// Reset our failure count after successful sends
				this._sequentialSocketFailures = 0;
			}
		} catch (error) {
			// If send fails, close and attempt to reconnect
			this.close();
			// If we haven't been able to send anything for a while, then just give up
			if (++this._sequentialSocketFailures >= 12) {
				slog.error("ReconnectingWebSocket has failed too many times for " + this._url + " and is giving up.");
				return;
			}
			// Record our failure
			this._sendsSinceLastFailure = 0;
			slog.warn("ReconnectingWebSocket has been unable to send to " + this._url + ", attempting to reconnect.");
			// Reset our closing
			this._shouldClose = false;
			// Give it 15 seconds, maybe the service on the other end will recover?
			this._reconnectDelayMillis = 15000;
			// And reconnect
			this._considerReconnect();
		}
	}
};

/**
 * Closes this socket (and does not attempt to reconnect).
 */
ReconnectingWebSocket.prototype.close = function()
{
	this._shouldClose = true;
	this._reconnectDelayMillis = -1;
	if (this._socket !== null)
	{
		this._socket.close();
	}
};

/**
 * @private
 */
ReconnectingWebSocket.prototype._connect = function()
{
	if (!this._shouldClose)
	{
		if (this._protocolInfo)
		{
			this._socket = new WebSocket(this._url, this._protocolInfo);
		}
		else
		{
			this._socket = new WebSocket(this._url);
		}
		this._socket.onopen = this._openHappened.bind(this);
		this._socket.onclose = this._closeHappened.bind(this);
		this._socket.onerror = this._errorHappened.bind(this);
		this._socket.onmessage = this._messageHappened.bind(this);
		this._reconnectDelayMillis = this._originalReconnectDelayMillis;
	}
};

/**
 * @private
 */
ReconnectingWebSocket.prototype._considerReconnect = function()
{
	if (this._reconnectDelayMillis >= 0 && this._socket !== null)
	{
		slog(this._channelName, "Scheduling reconnect: "+this._url);
		this._socket.onopen = null;
		this._socket.onclose = null;
		this._socket.onerror = null;
		this._socket.onmessage = null;
		this._socket = null;
		setTimeout(this._connect.bind(this), this._reconnectDelayMillis);
	}
};

/**
 * @param {string} eventType
 * @param {Object} event
 * @private
 */
ReconnectingWebSocket.prototype._fireEvent = function(eventType, event)
{
	const listeners = this._listenerMap[eventType];
	if (listeners)
	{
		for (let i=0; i<listeners.length; i++)
		{
			listeners[i](event);
		}
	}
};

/**
 * @param {Object} event
 * @private
 */
ReconnectingWebSocket.prototype._openHappened = function(event)
{
	slog(this._channelName, "Socket opened: "+this._url);
	this._fireEvent(event.type, event);
};

/**
 * @param {Object} event
 * @private
 */
ReconnectingWebSocket.prototype._closeHappened = function(event)
{
	slog(this._channelName, "Socket closed: "+this._url+" code: "+event.code+" reason: "+event.reason+" clean: "+event.wasClean);
	this._fireEvent(event.type, event);
	this._considerReconnect();
};

/**
 * @param {Object} event
 * @private
 */
ReconnectingWebSocket.prototype._errorHappened = function(event)
{
	slog(this._channelName, "Socket error: "+this._url);
	this._fireEvent(event.type, event);
	this._considerReconnect();
};

/**
 * @param {Object} event
 * @private
 */
ReconnectingWebSocket.prototype._messageHappened = function(event)
{
	this._fireEvent(event.type, event);
};

export default ReconnectingWebSocket;
