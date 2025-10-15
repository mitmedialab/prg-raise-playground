import { AxisCommand, SingleAxisCommand } from "./BodyData.js";
import Clock from "../ifr-core/Clock.js";
import ReconnectingWebSocket from "../ifr-core/ReconnectingWebSocket.js";
import slog from "../ifr-core/SLog.js";

const bodyChannel = "BODY_INTERFACE";

/**
 * @param {string} bodyServiceURL - base URL for the body service
 * @param {string} [sessionToken] - optional session security token
 * @param {string} [baseDOFName] - base DOF name (optional)
 * @param {string} [middleDOFName] - middle DOF name (optional)
 * @param {string} [neckDOFName] - neck DOF name (optional)
 * @constructor
 */
const MotionInterface = function(bodyServiceURL, sessionToken, baseDOFName, middleDOFName, neckDOFName)
{
	const baseDOF = baseDOFName || "bottomSection_r";
	const middleDOF = middleDOFName || "middleSection_r";
	const neckDOF = neckDOFName || "topSection_r";

	/** @type {Object.<string, string>} */
	this.dofToAxis = {};
	this.dofToAxis[baseDOF] = "pelvis";
	this.dofToAxis[middleDOF] = "torso";
	this.dofToAxis[neckDOF] = "neck";

	/** @type string[] */
	this.dofNames = [baseDOF, middleDOF, neckDOF];

	/** @type {number} */
	this.stateMessageCount = 0;
	/** @type {AxisState} */
	this.latestAxisState = null;

	/** @type {AxisCommand} */
	this.command = new AxisCommand();
	this.command.pelvis = new SingleAxisCommand();
	this.command.torso = new SingleAxisCommand();
	this.command.neck = new SingleAxisCommand();

	const self = this;

	/** @type {ReconnectingWebSocket} */
	this.stateSocket = new ReconnectingWebSocket(bodyServiceURL+"/axis_state", sessionToken, 3000, "BODY");
	this.stateSocket.on("message", function(event)
	{
		let data = null;
		try {
			data = JSON.parse(event.data);
		}
		catch(e) {
			slog(bodyChannel, "JSON parse failed on MotionInterface incoming message: "+event.data+" error: "+e, slog.Levels.WARN);
		}
		if(data !== null) {
			let axisState = null;
			try {
				axisState = new AxisState().setFromJson(data);
			}
			catch(e) {
				slog(bodyChannel, "AxisState creation failed on MotionInterface incoming message: "+event.data+" error: "+e, slog.Levels.WARN);
			}
			if(axisState !== null) {
				self.latestAxisState = axisState;
				self.stateMessageCount++;
			}
		}
	});
	this.stateSocket.on("close", function()
	{
		self.latestAxisState = null;
	});
	this.stateSocket.on("error", function()
	{
		self.latestAxisState = null;
	});

	/** @type {ReconnectingWebSocket} */
	this.commandSocket = new ReconnectingWebSocket(bodyServiceURL+"/axis_command", sessionToken, 3000, "BODY");
};

/**
 * @return {string[]}
 */
MotionInterface.prototype.getMotionDOFNames = function()
{
	return this.dofNames;
};

/**
 * @param {string} dofName
 * @return {SingleAxisState}
 */
MotionInterface.prototype.getState = function(dofName)
{
	if (!this.dofToAxis.hasOwnProperty(dofName))
	{
		throw new Error("unknown motion DOF name: "+dofName);
	}

	if (this.latestAxisState !== null)
	{
		return this.latestAxisState[this.dofToAxis[dofName]];
	}
	else
	{
		return null;
	}
};

/**
 * @return {number}
 */
MotionInterface.prototype.getStateMessageCount = function()
{
	return this.stateMessageCount;
};

/**
 * @param {string} dofName - DOF name
 * @param {AxisCommandMode} commandMode - command mode for the axis
 * @param {number|number[]} commandValue - command data (as defined by the given mode)
 * @param {number} [velocityLimit] - optional velocity limit in radians/second
 * @param {number} [accelerationLimit] - optional acceleration limit in radians/second^2
 * @param {number} [currentLimit] - optional current limit in amperes
 * @return {boolean} true if the command was set successfully
 */
MotionInterface.prototype.setCommand = function(dofName, commandMode, commandValue, velocityLimit, accelerationLimit, currentLimit)
{
	if (!this.dofToAxis.hasOwnProperty(dofName))
	{
		throw new Error("unknown motion DOF name: "+dofName);
	}

	const state = this.getState(dofName);
	if (state !== null)
	{
		/** @type {SingleAxisCommand} */
		const command = this.command[this.dofToAxis[dofName]];

		command.mode = commandMode;
		command.value = (commandValue instanceof Array) ? commandValue : [commandValue];
		command.vel_limit = (velocityLimit !== undefined && velocityLimit !== null) ? velocityLimit : state.vel_limit;
		command.acc_limit = (accelerationLimit !== undefined && accelerationLimit !== null) ? accelerationLimit : state.acc_limit;
		command.cur_limit = (currentLimit !== undefined && currentLimit !== null) ? currentLimit : state.cur_limit;

		return true;
	}
	else
	{
		return false;
	}
};

/**
 * @return {boolean} true if the command was sent successfully
 */
MotionInterface.prototype.sendCommand = function()
{
	if (this.commandSocket.isConnected())
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
 * @return {boolean} true if the motion interface is connected
 */
MotionInterface.prototype.isConnected = function()
{
	return this.latestAxisState !== null && this.commandSocket.isConnected() && this.stateSocket.isConnected();
};

/**
 * @return {boolean} - true if a system lockout condition currently exists
 */
MotionInterface.prototype.hasLockout = function()
{
	return this.latestAxisState !== null && this.latestAxisState.hasLockout();
};

/**
 * @return {boolean} true if the motion interface has timeout state on at least one axis
 */
MotionInterface.prototype.hasTimeout = function()
{
	return this.latestAxisState !== null && this.latestAxisState.hasTimeout();
};

/**
 * @return {boolean} true if the motion interface reports all axes indexed
 */
MotionInterface.prototype.allIndexed = function()
{
	return this.latestAxisState !== null && this.latestAxisState.allIndexed();
};

/**
 * @return {number} - bitmask representing lockout conditions, e.g. system policies that prevent control of the motors. (int)
 */
MotionInterface.prototype.getLockout = function()
{
	if (this.latestAxisState !== null)
	{
		return this.latestAxisState.getLockout();
	}
	else
	{
		return null;
	}
};

/**
 * @return {boolean} - true if there is currently a fault on any axis
 */
MotionInterface.prototype.hasFault = function()
{
	return this.latestAxisState !== null && this.latestAxisState.hasFault();
};

/**
 * @return {number[]} - all fault fields
 */
MotionInterface.prototype.getFaults = function()
{
	const faults = [];
	if(this.latestAxisState !== null)
	{
		for(let i = 0; i < this.dofNames.length; i++)
		{
			faults.push(this.latestAxisState[this.dofToAxis[this.dofNames[i]]].getFault());
		}
	}
	return faults;
};

/**
 * @return {boolean[]} - all index fields
 */
MotionInterface.prototype.getIndexStatuses = function()
{
	const statuses = [];
	if(this.latestAxisState !== null)
	{
		for(let i = 0; i < this.dofNames.length; i++)
		{
			statuses.push(this.latestAxisState[this.dofToAxis[this.dofNames[i]]].isIndexed());
		}
	}
	return statuses;
};


/**
 * @return {MotionLimiterMode} - the most severe motion limiter mode being applied to any axis
 */
MotionInterface.prototype.getLimiterMode = function()
{
	if (this.latestAxisState !== null)
	{
		return this.latestAxisState.getLimiterMode();
	}
	else
	{
		return null;
	}
};

MotionInterface.prototype.close = function()
{
	this.stateSocket.close();
	this.commandSocket.close();
};

export default MotionInterface;
