import Time from "../ifr-core/Time.js";
import slog from "../ifr-core/SLog.js";

/**
 * Enum values for command mode
 * @enum {number}
 */
const AxisCommandMode = {
	NONE: 0,
	LIMP: 1,
	BRAKE: 2,
	PWM: 3,
	VELOCITY: 4,
	TRAJECTORY: 5,
	TORQUE: 6,
	POS_VEL: 7
};

/**
 * Enum values for single axis status
 * @enum {number}
 */
const StatusFieldBitMask = {
	INDEXED: 0x01, //bit 0
	ENABLED: 0x02, //bit 1
	BRAKED:  0x04, //bit 2
	MOVING:  0x08, //bit 3
	STALLED: 0x10, //bit 4
	TIMEOUT: 0x20, //bit 5
	FAULT:   0x40  //bit 6
};

/**
 * Enum values for motion limiter operation mode
 * @enum {number}
 */
const MotionLimiterMode = {
	DISABLED: -1,
	OK: 0,
	APPROACHING_LIMIT: 1,
	EXCEEDING_LIMIT: 2,
	UNINDEXED: 3
};


/**
 * @constructor
 */
const SingleAxisState = function()
{
	/**
	 * chronometer timestamp
	 * @type {number[]} */
	this.ts = null;
	/**
	 * absolute (indexed) position in radians, undefined until indexed
	 * @type {number} */
	this.pos = null;
	/**
	 * encoder position in radians, arbitrary zero based on power-up position
	 * @type {number} */
	this.inc_pos = null;
	/**
	 * velocity in radians/second
	 * @type {number} */
	this.vel = null;
	/**
	 * current in amperes
	 * @type {number} */
	this.cur = null;
	/**
	 * PWM value in % max PWM
	 * @type {number} */
	this.pwm = null;
	/**
	 * low-level flags for motor and driver status (integer)
	 * @type {?number} */
	this.status = null;
	/**
	 * velocity limit in radians/second
	 * @type {number} */
	this.vel_limit = null;
	/**
	 * acceleration limit in radians/second^2
	 * @type {number} */
	this.acc_limit = null;
	/**
	 * current limit in amperes
	 * @type {number} */
	this.cur_limit = null;
	/**
	 * command mode of the axis {none=0, limp=1, brake=2, pwm=3, vel=4, traj=5, trq=6}
	 * @type {number} */
	this.mode = null;
	/**
	 * reference value of trajectory generator (depends on command)
	 * @type {number} */
	this.ref = null;
	/**
	 * reference position (may not be reported for all modes)
	 * @type {number} */
	this.ref_pos = null;
	/**
	 * reference acc (may not be reported for all modes)
	 * @type {number} */
	this.ref_acc = null;
	/**
	 * hardware-level tick counter (milliseconds)
	 * @type {number} */
	this.ticks = null;
	/**
	 * value of the integral term of the PID loop
	 * @type {number} */
	this.integrator = null;
	/**
	 * Low level motor fault flags (int)
	 * @type {number} */
	this.fault_status = null;
	/**
	 * Counter of the number of observed index events. Wraps after 255. (int)
	 * @type {number} */
	this.index_count = null;
	/**
	 * Motion limiter operation mode (-1 == DISABLED, 0 == OK, 1 == APPROACHING_LIMIT, 2 == EXCEEDING_LIMIT). (int)
	 * @type {number} */
	this.limiter_mode = null;
};

/**
 * @return {Time} - chronometer timestamp as a Time instance
 */
SingleAxisState.prototype.getTimestamp = function()
{
	if (this.ts === null)
	{
		return null;
	}
	else
	{
		return Time.createFromTimestamp(this.ts);
	}
};

/**
 * @return {boolean} - true if axis is indexed (0th bit of status)
 */
SingleAxisState.prototype.isIndexed = function()
{
	if (this.status === null)
	{
		return false;
	}
	else
	{
		/*jshint bitwise:false*/
		return (this.status & 0x01) > 0;
		/*jshint bitwise:true*/
	}
};


/**
 * @param {StatusFieldBitMask} statusBitMask
 * @return {boolean} - true if bit(s) represented by statusBitMask is(are) set for this axis (all must be set for "true" if multiple specified)
 */
SingleAxisState.prototype.hasStatus = function(statusBitMask)
{
	if (this.status === null)
	{
		return false;
	}
	else
	{
		/*jshint bitwise:false*/
		return (this.status & statusBitMask) === statusBitMask;
		/*jshint bitwise:true*/
	}
};


/**
 * @return {number} - number of observed index events (wraps after 255)
 */
SingleAxisState.prototype.getIndexCount = function()
{
	return this.index_count;
};

/**
 * @return {boolean} - true if there is currently a fault on the axis
 */
SingleAxisState.prototype.hasFault = function()
{
	return this.fault_status !== null && this.fault_status !== 0;
};

/**
 * @return {number} - low level motor fault flags (int)
 */
SingleAxisState.prototype.getFault = function()
{
	return this.fault_status;
};

/**
 * @return {MotionLimiterMode} - motion limiter operation mode
 */
SingleAxisState.prototype.getLimiterMode = function()
{
	return this.limiter_mode !== null ? this.limiter_mode : MotionLimiterMode.DISABLED;
};

/**
 * @param {Object} jsonData
 * @return {SingleAxisState}
 */
SingleAxisState.prototype.setFromJson = function(jsonData)
{
	const keys = Object.keys(jsonData);
	for (let i=0; i<keys.length; i++)
	{
		if (this.hasOwnProperty(keys[i]))
		{
			this[keys[i]] = jsonData[keys[i]];
		}
		else
		{
			slog.info("SingleAxisState: unknown JSON property name: "+keys[i]);
		}
	}
	return this;
};

/**
 * @constructor
 */
const AxisState = function()
{
	/**
	 * overall update chronometer timestamp
	 * @type {number[]} */
	this.ts = null;
	/** @type {SingleAxisState} */
	this.pelvis = null;
	/** @type {SingleAxisState} */
	this.torso = null;
	/** @type {SingleAxisState} */
	this.neck = null;
	/**
	 * Bitmask representing lockout conditions, e.g. system policies that prevent control of the motors. (int)
	 * @type {number} */
	this.lockout = null;
};

/**
 * @return {Time} - overall update chronometer timestamp as a Time instance
 */
AxisState.prototype.getTimestamp = function()
{
	if (this.ts === null)
	{
		return null;
	}
	else
	{
		return Time.createFromTimestamp(this.ts);
	}
};

/**
 * @return {boolean} - true if a system lockout condition currently exists
 */
AxisState.prototype.hasLockout = function()
{
	return this.lockout !== null && this.lockout !== 0;
};

/**
 * @return {number} - bitmask representing lockout conditions, e.g. system policies that prevent control of the motors. (int)
 */
AxisState.prototype.getLockout = function()
{
	return this.lockout;
};

/**
 * @return {boolean} - true if there is currently a fault on any axis
 */
AxisState.prototype.hasFault = function()
{
	return this.pelvis.hasFault() || this.torso.hasFault() || this.neck.hasFault();
};

/**
 * @return {boolean} - true if there is currently a timeout on any axis
 */
AxisState.prototype.hasTimeout = function()
{
	const timeoutMask = StatusFieldBitMask.TIMEOUT;
	return this.pelvis.hasStatus(timeoutMask) || this.torso.hasStatus(timeoutMask) || this.neck.hasStatus(timeoutMask);
};

/**
 * @return {boolean} - true if all axis are indexed
 */
AxisState.prototype.allIndexed = function()
{
	return this.pelvis.isIndexed() && this.torso.isIndexed() && this.neck.isIndexed();
};

/**
 * @return {MotionLimiterMode} - the most severe motion limiter mode being applied to any axis
 */
AxisState.prototype.getLimiterMode = function()
{
	return Math.max(this.pelvis.getLimiterMode(), this.torso.getLimiterMode(), this.neck.getLimiterMode());
};

/**
 * @param {Object} jsonData
 * @return {AxisState}
 */
AxisState.prototype.setFromJson = function(jsonData)
{
	this.ts = jsonData.ts;
	this.pelvis = new SingleAxisState().setFromJson(jsonData.pelvis);
	this.torso = new SingleAxisState().setFromJson(jsonData.torso);
	this.neck = new SingleAxisState().setFromJson(jsonData.neck);
	if (jsonData.lockout !== undefined)
	{
		this.lockout = jsonData.lockout;
	}
	return this;
};

/**
 * @constructor
 */
const SingleAxisCommand = function()
{
	/**
	 * command mode {none=0, limp=1, brake=2, pwm=3, vel=4, traj=5, trq=6}
	 * @type {number} */
	this.mode = null;
	/**
	 * command target, as defined by the mode
	 * @type {number[]} */
	this.value = null;
	/**
	 * velocity limit in radians/second
	 * @type {number} */
	this.vel_limit = null;
	/**
	 * acceleration limit in radians/second^2
	 * @type {number} */
	this.acc_limit = null;
	/**
	 * current limit in amperes
	 * @type {number} */
	this.cur_limit = null;
};

/**
 * @constructor
 */
const AxisCommand = function()
{
	/**
	 * chronometer timestamp
	 * @type {number[]} */
	this.ts = null;
	/** @type {SingleAxisCommand} */
	this.pelvis = null;
	/** @type {SingleAxisCommand} */
	this.torso = null;
	/** @type {SingleAxisCommand} */
	this.neck = null;
};

/**
 * @param {Time} timestamp
 */
AxisCommand.prototype.setTimestamp = function(timestamp)
{
	this.ts = timestamp._timestamp;
};

/**
 * @constructor
 */
const LEDCommand = function()
{
	/**
	 * chronometer timestamp
	 * @type {number[]} */
	this.ts = null;
	/**
	 * RGB color value, percentage of maximum [0.0, 1.0]
	 * @type {number[]} */
	this.color = null;
	/**
	 * desired rate of change of each color value, in percent/second
	 * @type {number[]} */
	this.rate_limit = null;
};

/**
 * @param {Time} timestamp
 */
LEDCommand.prototype.setTimestamp = function(timestamp)
{
	this.ts = timestamp._timestamp;
};

/**
 * @param {number} rateLimit - desired rate of change, in percent/second
 */
LEDCommand.prototype.setRateLimit = function(rateLimit)
{
	this.rate_limit = [rateLimit, rateLimit, rateLimit];
};

// Export all the enums and classes with the same structure as before
export { AxisCommandMode, StatusFieldBitMask, MotionLimiterMode, SingleAxisState, AxisState, SingleAxisCommand, AxisCommand, LEDCommand };

