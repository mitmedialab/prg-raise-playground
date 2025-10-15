"use strict";

/**
 * @constructor
 */
const TimestampedBuffer = function()
{
	/** @type {Array.<number>} */
	this.timestampList = [];
	/** @type {Array.<*>} */
	this.dataList = [];

	/** @type {number} */
	this._lastReturnedLeftIndex = 0;
};

TimestampedBuffer.prototype.clone = function(){
	var newBuffer = new TimestampedBuffer();
	//ok to shallow copy arrays since contents are numbers (immutable)
	newBuffer.timestampList = this.timestampList.slice(0);
	newBuffer.dataList = this.dataList.slice(0);
	newBuffer._lastReturnedLeftIndex = this._lastReturnedLeftIndex;
	return newBuffer;
};

/**
 * @return {number}
 */
TimestampedBuffer.prototype.size = function()
{
	return this.timestampList.length;
};

/**
 * @return {number}
 */
TimestampedBuffer.prototype.getStartTime = function()
{
	return this.timestampList[0];
};

/**
 * @return {number}
 */
TimestampedBuffer.prototype.getEndTime = function()
{
	return this.timestampList[this.timestampList.length-1];
};

/**
 * Append a sample to the buffer. This method assumes that the new sample is after (in time)
 * all samples already added; only use it when adding data in time-order.
 *
 * @param {number} timestamp
 * @param {*} data
 */
TimestampedBuffer.prototype.append = function(timestamp, data)
{
	if (this.size() > 0)
	{
		if (timestamp < this.getEndTime())
		{
			throw new Error("new timestamp "+timestamp+" is out of sequence with previous timestamp "+this.getEndTime());
		}
	}

	this.timestampList.push(timestamp);
	this.dataList.push(data);
};

/**
 * @param {number} index
 * @return {number} timestamp at the specified index
 */
TimestampedBuffer.prototype.getTimestamp = function(index)
{
	return this.timestampList[index];
};

/**
 * @param {number} index
 * @return {*} data sample at the specified index
 */
TimestampedBuffer.prototype.getData = function(index)
{
	return this.dataList[index];
};

/**
 * @param {number} index
 * @return {*} data sample that was removed
 */
TimestampedBuffer.prototype.remove = function(index)
{
	this.timestampList.splice(index, 1);
	return this.dataList.splice(index, 1)[0];
};

/**
 * @param {number} time
 * @return {*} data
 */
TimestampedBuffer.prototype.getDataForTime = function(time)
{
	var index = this.getLeftIndexForTime(time);
	if (index > -1)
	{
		return this.dataList[index];
	}
	else
	{
		return null;
	}
};

/**
 * Get all data for the provided time range.
 * @param {number} startTime start time of the range
 * @param {boolean} inclusiveStart true if data exactly at start time should be included
 * @param {number} endTime end time of the range
 * @param {boolean} inclusiveEnd true if data exactly at end time should be included
 * @return {Array} the data for the time range, in order, or null if no data in range
 */
TimestampedBuffer.prototype.getDataForRange = function(startTime, inclusiveStart, endTime, inclusiveEnd)
{
	var rangedData = null;
	var startIndex = this.getLeftIndexForTime(startTime);
	var endIndex = this.getLeftIndexForTime(endTime)+1;

	for (var i=startIndex; i<=endIndex; i++)
	{
		if (i >= 0 && i < this.size()) // exclude indices indicating out of range values
		{
			var ts = this.getTimestamp(i);
			var startOK = ts > startTime || (ts === startTime && inclusiveStart);
			var endOK = ts < endTime || (ts === endTime && inclusiveEnd);
			if (startOK && endOK)
			{
				if (rangedData === null)
				{
					rangedData = [];
				}
				rangedData.push(this.getData(i));
			}
		}
	}

	return rangedData;
};

/**
 * Insert unordered data.  If data already exists at the exact specified timestamp, it will be replaced with this data.
 * Otherwise, this data will be added in the correct place, associated with the specified timestamp.
 * @param timestamp time stamp to add or alter
 * @param data data to set
 */
TimestampedBuffer.prototype.insert = function(timestamp, data)
{
	var leftIndex = this.getLeftIndexForTime(timestamp);
	if (leftIndex >= 0 && this.timestampList[leftIndex] === timestamp)
	{
		this.dataList[leftIndex] = data;
	}
	else
	{
		var insertAt = leftIndex+1;
		this.timestampList.splice(insertAt, 0, timestamp);
		this.dataList.splice(insertAt, 0, data);
	}
};

/**
 * find index of timestamp s.t. stamps[index] <= time && stamps[index+1] > time
 * OR -1 if buffer is empty or time < startTime
 * OR last index if time >= endTime
 *
 * @param time time to search for
 * @return {number} index
 */
TimestampedBuffer.prototype.getLeftIndexForTime = function(time)
{
	if (this.size() === 0 || time < this.getStartTime())
	{
		return -1;
	}
	if (time >= this.getEndTime())
	{
		return this.size()-1;
	}

	// check the last returned left index
	if (this._lastReturnedLeftIndex < this.size()-1 &&
		this.timestampList[this._lastReturnedLeftIndex] <= time &&
		this.timestampList[this._lastReturnedLeftIndex+1] > time)
	{
		return this._lastReturnedLeftIndex;
	}

	// then, check the next one
	this._lastReturnedLeftIndex++;
	if (this._lastReturnedLeftIndex < this.size()-1 &&
		this.timestampList[this._lastReturnedLeftIndex] <= time &&
		this.timestampList[this._lastReturnedLeftIndex+1] > time)
	{
		return this._lastReturnedLeftIndex;
	}

	// no match yet, so find via binary search
	var leftIndex = 0;
	var rightIndex = this.size()-1;
	var middleIndex;
	while (rightIndex !== leftIndex+1)
	{
		middleIndex = Math.floor((leftIndex + rightIndex) / 2);
		if (this.timestampList[middleIndex] <= time)
		{
			leftIndex = middleIndex;
		}
		else
		{
			rightIndex = middleIndex;
		}
	}

	this._lastReturnedLeftIndex = leftIndex;
	return leftIndex;
};

TimestampedBuffer.prototype.toString = function(){
	var s = "";
	var delim = "";
	for(var i = 0; i < this.timestampList.length; i++){
		s+=delim + this.timestampList[i]+":"+this.dataList[i];
		delim = ", ";
	}
	return s;
};

export default TimestampedBuffer;
