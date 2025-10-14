import { LEDCommand } from "./BodyData.js";
import Clock from "../ifr-core/Clock.js";
import ReconnectingWebSocket from "../ifr-core/ReconnectingWebSocket.js";

/**
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {string} [sessionToken] - optional session security token
 * @constructor
 */
const LEDInterface = function(bodyServiceURL, sessionToken)
{
	/** @type {LEDCommand} */
	this.command = new LEDCommand();
	this.command.color = [0, 0, 0];
	this.command.setRateLimit(50);

	/** @type {ReconnectingWebSocket} */
	this.commandSocket = new ReconnectingWebSocket(bodyServiceURL+"/led_command", sessionToken, 3000, "BODY");
};

/**
 * @param {number[]} rgbValue - RGB color value array, values in percentage of maximum [0.0, 1.0]
 * @param {number} rateLimit - maximum rate of change of color values, in percent/second
 * @return {boolean} true if the command was set successfully
 */
LEDInterface.prototype.setCommand = function(rgbValue, rateLimit)
{
	for (let i=0; i<3; i++)
	{
		this.command.color[i] = rgbValue[i];
	}
	this.command.setRateLimit(rateLimit);

	return true;
};

/**
 * @return {boolean} true if the command was sent successfully
 */
LEDInterface.prototype.sendCommand = function()
{
	if (this.isConnected())
	{
		this.command.setTimestamp(Clock.currentTime());
		const cmd = JSON.stringify(this.command);
		this.commandSocket.send(cmd);
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * @return {boolean} true if the LED interface is connected
 */
LEDInterface.prototype.isConnected = function()
{
	return this.commandSocket.isConnected();
};

LEDInterface.prototype.close = function()
{
	this.commandSocket.close();
};

export default LEDInterface;
