/**
 * @typedef {Array.<number>} jibo.animate.Time~Timestamp - This is a two-element array of integers,
 * representing seconds and fractions of a second in microseconds since epoch. Each are non-negative integer values.
 */

/**
 * @param {jibo.animate.Time~Timestamp} timestamp Time printed as seconds and fractions of a second in microseconds.
 * @returns {boolean} `true` if valid, `false` if invalid (i.e. negative).
 */
const isValid = function(timestamp){
	const valid = timestamp[0] === +timestamp[0] && timestamp[1] === +timestamp[1] && //values are numbers
		timestamp[0] >= 0 && timestamp[1] >= 0 && //numbers are positive
		timestamp[1] < 1000000 && //micro seconds portion is under a second
		timestamp[0] === Math.round(timestamp[0]) && timestamp[1] === Math.round(timestamp[1]); //values are integers

	if(!valid){
		if(timestamp[0] !== +timestamp[0] || timestamp[1] !== +timestamp[1]){
			console.log("InvalidTime: At least one element of timestamp is not a number");
		}
		if(timestamp[0] < 0 || timestamp[1] < 0){
			console.log("InvalidTime: At least one element of timestamp is negative");
		}
		if(timestamp[1] >= 1000000){
			console.log("InvalidTime: Microseconds portion is over one second");
		}
		if(timestamp[0] !== Math.round(timestamp[0]) || timestamp[1] !== Math.round(timestamp[1])){
			console.log("InvalidTime: At least one element is not an integer");
		}
	}

	return valid;
};

/**
 * Represents the time since epoch.
 * @param {number} seconds - Seconds from epoch.
 * @param {number} microseconds - Fractions of a second from epoch in microseconds.
 * @throws {Error} Error if time values are invalid (not numbers, not positive, micros more than 10^6, not integers).
 *
 * @class Time
 * @memberof jibo.animate
 */
const Time = function(seconds, microseconds){

	/**
	 * @type {jibo.animate.Time~Timestamp}
	 * @private
	 */
	this._timestamp = [seconds, microseconds];

	if(!isValid(this._timestamp)) {
		throw new Error("new Time() given invalid time values: (INVALID " + this._timestamp[0] + ", " + this._timestamp[1] + ")");
	}
};

/**
 * Creates new Time instance from the specified timeStamp.
 * @method jibo.animate.Time.createFromTimestamp
 * @param {jibo.animate.Time~Timestamp} timestamp - Two element-array representing time from epoch, where first element is seconds and the second is fractions of a second in microseconds.
 * @returns {jibo.animate.Time} new Time instance.
 * @throws {Error} Error if timeStamp is invalid (not an array, not numbers, not positive, micros more than 10^6, not integers).
 */
Time.createFromTimestamp = function(timestamp){
	if(!Array.isArray(timestamp)){
		throw new Error("new Time() given invalid Timestamp: (INVALID: not array)");
	}
	return new Time(timestamp[0], timestamp[1]);
};

/**
 * Computes the signed seconds between this instance and subtrahendTime, i.e. (this - subtrahend)
 * @method jibo.animate.Time#subtract
 * @param {jibo.animate.Time} subtrahendTime Time to compare this time to.
 * @returns {number} (this - subtrahend), in floating point seconds.
 */
Time.prototype.subtract = function(subtrahendTime) {
	let a, b, n;
	if (this.isGreaterOrEqual(subtrahendTime)) {
		a = this._timestamp;
		b = subtrahendTime._timestamp;
		n = 1;
	} else {
		a = subtrahendTime._timestamp;
		b = this._timestamp;
		n = -1;
	}
	let usPart = a[1] - b[1];
	let sPart = a[0] - b[0];
	if (usPart < 0) {
		usPart += 1000000;
		sPart -= 1;
	}
	const r =  n * (sPart + (usPart / 1000000));
	return Math.round(r*1000000)/1000000; //round off floating noise to be exact microseconds result
};


/**
 * Creates and returns a new Time offset from this instance by the seconds value provided.
 * @method jibo.animate.Time#add
 * @param {number} seconds - Signed seconds value to offset new time by.
 * @returns {jibo.animate.Time} new Time instance equal to this Time offset by signed seconds value.
 * @throws {Error} - Error if resulting timeStamp would have been negative.
 */
Time.prototype.add = function(seconds){
	let sPart, usPart;

	if(seconds < 0) {
		const toSubSPart = Math.floor(-seconds);
		const toSubFractionPart = -seconds - toSubSPart;

		sPart = this._timestamp[0] - toSubSPart;
		usPart = this._timestamp[1] - toSubFractionPart * 1000000;

		usPart = Math.round(usPart);
		if(usPart < 0) {
			usPart += 1000000;
			sPart -= 1;
		}

		if(sPart < 0){
			//negative timestamps not supported
			throw new Error("Error, "+this.toString()+"+"+seconds+" is a negative timestamp! (not allowed)");
		}

	}else{
		const toAddSPart = Math.floor(seconds);
		const toAddFractionalPart = seconds - toAddSPart;

		sPart = this._timestamp[0] + toAddSPart;
		usPart = this._timestamp[1] + toAddFractionalPart * 1000000;

		usPart = Math.round(usPart);
		if(usPart >= 1000000){
			usPart -= 1000000;
			sPart += 1;
		}
	}

	return new Time(sPart, usPart);
};


/**
 * Computes if this time instance is later than the provided time, i.e. (this > otherTime).
 * @method jibo.animate.Time#isGreater
 * @param {jibo.animate.Time} otherTime Time to compare this time to.
 * @returns {boolean} `true` if this time is greater (later) than otherTime.
 */
Time.prototype.isGreater = function(otherTime){
	if(this._timestamp[0] > otherTime._timestamp[0]){
		return true;
	}else if(this._timestamp[0] === otherTime._timestamp[0]){
		return this._timestamp[1] > otherTime._timestamp[1];
	}else{
		return false;
	}
};

/**
 * Computes if this time instance is later or the same as the provided time,
 * i.e. (this >= otherTime).
 * @method jibo.animate.Time#isGreaterOrEqual
 * @param {jibo.animate.Time} otherTime Time to compare this time to.
 * @returns {boolean} `true` if this time is greater than or equal to (later or the same) otherTime.
 */
Time.prototype.isGreaterOrEqual = function(otherTime){
	if(this._timestamp[0] > otherTime._timestamp[0]){
		return true;
	}else if(this._timestamp[0] === otherTime._timestamp[0]){
		return this._timestamp[1] >= otherTime._timestamp[1];
	}else{
		return false;
	}
};


/**
 * Computes if this time instance represents the same time as the provided time.
 * @method jibo.animate.Time#equals
 * @param {jibo.animate.Time} otherTime Time to compare this time to.
 * @returns {boolean} `true` if this time is the same time as otherTime.
 */
Time.prototype.equals = function(otherTime){
	return this._timestamp[0] === otherTime._timestamp[0] && this._timestamp[1] === otherTime._timestamp[1];
};


/**
 * Convert time to a string.
 * @method jibo.animate.Time#toString
 * @returns {string} string Representation of this timestamp. Printed as floating point value of seconds since epoch.
 */
Time.prototype.toString = function(){
	let tsUS = ""+this._timestamp[1];
	while(tsUS.length < 6){
		tsUS = "0"+tsUS;
	}
	return this._timestamp[0] + "." + tsUS;
};

export default Time;
