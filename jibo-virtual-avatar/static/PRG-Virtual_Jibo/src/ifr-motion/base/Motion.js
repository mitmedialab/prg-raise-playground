"use strict";

import Pose from "./Pose.js";
import MotionTrack from "./MotionTrack.js";
import TimestampedBuffer from "./TimestampedBuffer.js";

/**
 * @param {string} name
 * @constructor
 */
const Motion = function(name)
{
	/** @type {string} */
	this.name = name;
	/** @type {number} */
	this.length = 0;
	/** @type {Object.<string, MotionTrack>} */
	this.tracks = {};
};

/**
 * @return {string}
 */
Motion.prototype.getName = function()
{
	return this.name;
};

/**
 * @return {number} duration of the motion in seconds
 */
Motion.prototype.getDuration = function()
{
	return this.length;
};

/**
 * @return {Object.<string, MotionTrack>}
 */
Motion.prototype.getTracks = function()
{
	return this.tracks;
};

/**
 * add a track to this motion
 * @param {MotionTrack} track
 */
Motion.prototype.addTrack = function(track)
{
	this.tracks[track.getName()] = track;
	if (track.getLength() > this.length)
	{
		this.length = track.getLength();
	}
};

/**
 * @return {string[]}
 */
Motion.prototype.getDOFs = function()
{
	return Object.keys(this.tracks);
};

/**
 * @param {string} dofName
 * @return {boolean}
 */
Motion.prototype.hasDOF = function(dofName)
{
	return this.tracks.hasOwnProperty(dofName);
};

/**
 * get data for the specified DOF at the specified time
 * @param {string} dofName
 * @param {number} time
 * @param {Interpolators.BaseInterpolator} interpolator
 * @return {number[]}
 */
Motion.prototype.getDOFDataAtTime = function(dofName, time, interpolator)
{
	if (this.tracks.hasOwnProperty(dofName))
	{
		return this.tracks[dofName].getDataAtTime(time, interpolator);
	}
	else
	{
		return null;
	}
};

/**
 * get pose data for this motion at the specified time
 * @param {number} time
 * @param {InterpolatorSet} interpolatorSet DOF interpolators to use
 * @param {Pose} [inplacePose] if specified, store the result in this pose
 * @return {Pose} the requested pose data (inplacePose if specified)
 */
Motion.prototype.getPoseAtTime = function(time, interpolatorSet, inplacePose)
{
	if (inplacePose === undefined || inplacePose === null)
	{
		inplacePose = new Pose(this.getName()+" pose sample", Object.keys(this.tracks));
	}

	if (typeof time !== 'number'){
		throw new Error("getPoseAtTime expects time as a number value in seconds");
	}

	var dofNames = inplacePose.getDOFNames();
	for (var dofIndex=0; dofIndex<dofNames.length; dofIndex++)
	{
		var dofName = dofNames[dofIndex];
		if (this.tracks.hasOwnProperty(dofName))
		{
			var interpolator = interpolatorSet.getInterpolator(dofName);
			if (interpolator === null)
			{
				throw new Error("no interpolator provided for DOF name: "+dofName);
			}
			else
			{
				var sample = this.tracks[dofName].getDataAtTime(time, interpolator);
				if (sample !== null)
				{
					inplacePose.set(dofName, sample);
				}
			}
		}
	}

	return inplacePose;
};

Motion.prototype.toString = function(){
	var s = "Motion "+this.getName()+" length:"+this.getDuration();
	var dofs = this.getDOFs();
	for(var i = 0; i < dofs.length; i++){
		s+="\n\t"+this.tracks[dofs[i]].toString();
	}
	return s;
};

/**
 * Convenience constructor to make a static "Motion" from a single pose.
 * Motion will have 1 keyframe at zero, and duration of passed in duration value.
 * Motion will have the dofs onDOFs if provided, otherwise will have all the
 * dofs present in pose.
 *
 * @param {string} name
 * @param {Pose} pose
 * @param {number} duration
 * @param {string[]} [onDOFs] - use only these DOFs (Defaults to all dofs in pose)
 * @return {Motion}
 */
Motion.createFromPose = function(name, pose, duration, onDOFs){
	var motion = new Motion(name);

	if(onDOFs == null){ //null or undefined (eqnull)
		onDOFs = pose.getDOFNames();
	}

	for (var i = 0; i < onDOFs.length; i++) {
		var dofName = onDOFs[i];
		var value = pose.get(dofName);
		var dataNew = new TimestampedBuffer();
		dataNew.append(0, value);
		motion.addTrack(new MotionTrack(dofName, dataNew, duration));
	}

	return motion;
};

/**
 * Convenience constructor to make a "Motion" from a series of poses.
 * Motion will have a keyframe at each time in times, and duration of passed in duration value.
 * Motion will have the dofs onDOFs if provided, otherwise will have all the
 * dofs present in the first pose in poses.
 *
 * @param {string} name
 * @param {Pose[]} poses
 * @param {number[]} times
 * @param {number} duration
 * @param {string[]} [onDOFs] - use only these DOFs (Defaults to all dofs in pose)
 * @return {Motion}
 */
Motion.createFromPoses = function(name, poses, times, duration, onDOFs){
	var motion = new Motion(name);

	if(onDOFs == null){ //null or undefined (eqnull)
		onDOFs = poses[0].getDOFNames();
	}

	for (var i = 0; i < onDOFs.length; i++) {
		var dofName = onDOFs[i];
		var dataNew = new TimestampedBuffer();
		for(var j = 0; j < times.length; j++) {
			var value = poses[j].get(dofName);
			dataNew.append(times[j], value);
		}
		motion.addTrack(new MotionTrack(dofName, dataNew, duration));
	}

	return motion;
};

/**
 * Convenience constructor to make a static "Motion" from a single DOF values object.
 * Motion will have 1 keyframe at zero, and duration of passed in duration value.
 * Motion will have the dofs onDOFs if provided, otherwise will have all the
 * dofs present in the DOF values object.
 *
 * @param {string} name
 * @param {Object.<string, Object>} dofValues
 * @param {number} duration
 * @param {string[]} [onDOFs] - use only these DOFs (Defaults to all dofs in dofValues object)
 * @return {Motion}
 */
Motion.createFromDOFValues = function(name, dofValues, duration, onDOFs){
	var motion = new Motion(name);

	if(onDOFs == null){ //null or undefined (eqnull)
		onDOFs = Object.keys(dofValues);
	}

	for (var i = 0; i < onDOFs.length; i++) {
		var dofName = onDOFs[i];
		var value = dofValues[dofName];
		var dataNew = new TimestampedBuffer();
		dataNew.append(0, value);
		motion.addTrack(new MotionTrack(dofName, dataNew, duration));
	}

	return motion;
};

/**
 * Convenience constructor to make a "Motion" from a series of DOF values objects.
 * Motion will have a keyframe at each time in times, and duration of passed in duration value.
 * Motion will have the dofs onDOFs if provided, otherwise will have all the
 * dofs present in the first DOF values object in the list.
 *
 * @param {string} name
 * @param {Array.<Object.<string, Object>>} dofValuesList
 * @param {number[]} times
 * @param {number} duration
 * @param {string[]} [onDOFs] - use only these DOFs (Defaults to all dofs in the first DOF values object)
 * @return {Motion}
 */
Motion.createFromDOFValuesList = function(name, dofValuesList, times, duration, onDOFs){
	var motion = new Motion(name);

	if(onDOFs == null){ //null or undefined (eqnull)
		onDOFs = Object.keys(dofValuesList[0]);
	}

	for (var i = 0; i < onDOFs.length; i++) {
		var dofName = onDOFs[i];
		var dataNew = new TimestampedBuffer();
		for(var j = 0; j < times.length; j++) {
			var value = dofValuesList[j][dofName];
			dataNew.append(times[j], value);
		}
		motion.addTrack(new MotionTrack(dofName, dataNew, duration));
	}

	return motion;
};

export default Motion;