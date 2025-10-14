"use strict";

import BaseMotionGenerator from "./BaseMotionGenerator.js";
import RelativeTimeClip from "../../ifr-motion/base/RelativeTimeClip.js";

/**
 * Wraps a motion generator to enable varying its playback speed.
 * @param {AnimationUtilities} animUtils
 * @param {MotionGenerator} generator - motion generator to wrap
 * @param {number} initialSpeed - initial speed
 * @constructor
 * @extends BaseMotionGenerator
 */
class VariableSpeedMotionGenerator extends BaseMotionGenerator {
	constructor(animUtils, generator, initialSpeed) {
		super(animUtils, generator.getName(), generator.getStartTime());
		this._initWithDOFIndices(generator.getDOFIndices(), null);

		/** @type {MotionGenerator} */
		this._generator = generator;
		/** @type {RelativeTimeClip} */
		this._clip = new RelativeTimeClip(0, Number.MAX_VALUE, initialSpeed);

		/** @type {jibo.animate.Time} */
		this._latestUpdateTime = generator.getStartTime();
		/** @type {jibo.animate.Time} */
		this._latestSpeedChangeTime = generator.getStartTime();
		/** @type {jibo.animate.Time} */
		this._generatorTimeAtLatestUpdate = generator.getStartTime();

		/** @type {jibo.animate.Time} */
		this._latestMapInputTime = null;
		/** @type {jibo.animate.Time} */
		this._latestMapOutputTime = null;
	}

	/**
	 * @returns {number}
	 */
	getSpeed() {
		return this._clip.getSpeed();
	}

	/**
	 * @param {number} newSpeed - new speed
	 */
	setSpeed(newSpeed) {
		var sourceTimeAtLatestUpdate = this._generatorTimeAtLatestUpdate.subtract(this._startTime);
		this._clip = new RelativeTimeClip(sourceTimeAtLatestUpdate, this._clip.getOutPoint(), newSpeed);
		this._latestSpeedChangeTime = this._latestUpdateTime;
	}

	/**
	 * Maps the specified time into the frame of the generator.
	 * @param {jibo.animate.Time} time
	 * @returns {jibo.animate.Time}
	 * @override
	 */
	_mapTime(time) {
		if (this._latestMapInputTime !== null && this._latestMapInputTime.equals(time)) {
			return this._latestMapOutputTime;
		}

		var generatorTime = null;
		if (time.isGreater(this._startTime)) {
			var elapsedTime = time.subtract(this._latestSpeedChangeTime);
			var sourceTime = this._clip.getSourceTime(elapsedTime);
			generatorTime = this._startTime.add(sourceTime);
		} else {
			// don't map times before start time
			generatorTime = time;
		}

		this._latestMapInputTime = time;
		this._latestMapOutputTime = generatorTime;
		return generatorTime;
	}

	/**
	 * Returns true if this generator ends after the given time.
	 * @param {jibo.animate.Time} time
	 * @returns {boolean}
	 * @override
	 */
	endsAfter(time) {
		if (BaseMotionGenerator.prototype.endsAfter.call(this, time)) {
			// map time and ask generator
			return this._generator.endsAfter(this._mapTime(time));
		} else {
			return false;
		}
	}

	/**
	 * Returns true if this generator has data for the specified DOF past the given time.
	 * @param {number} dofIndex
	 * @param {jibo.animate.Time} time
	 * @returns {boolean}
	 * @override
	 */
	dofEndsAfter(dofIndex, time) {
		if (BaseMotionGenerator.prototype.dofEndsAfter.call(this, dofIndex, time)) {
			// map time and ask generator
			return this._generator.dofEndsAfter(dofIndex, this._mapTime(time));
		} else {
			return false;
		}
	}

	/**
	 * Force this motion to end the specified tracks at or before cropTime.  If a track
	 * already ends before cropTime it is unchanged.  If a track starts after
	 * cropTime it is completely removed.
	 *
	 * @param {jibo.animate.Time} cropTime - crop to end at this time if necessary
	 * @param {number[]} dofIndices - crop tracks for these dofs
	 * @override
	 */
	cropEnd(cropTime, dofIndices) {
		BaseMotionGenerator.prototype.cropEnd.call(this, cropTime, dofIndices);

		// also crop underlying generator
		this._generator.cropEnd(this._mapTime(cropTime), dofIndices);
	}

	/**
	 * @param {jibo.animate.Time} currentTime
	 * @override
	 */
	notifyUpdateStarted(currentTime) {
		var generatorTime = this._mapTime(currentTime);

		this._generator.notifyUpdateStarted(generatorTime);

		if (currentTime.isGreater(this._startTime)) {
			this._latestUpdateTime = currentTime;
			this._generatorTimeAtLatestUpdate = generatorTime;
		}
	}

	/**
	 * @param {jibo.animate.Time} currentTime
	 * @override
	 */
	notifyUpdateFinished(currentTime) {
		this._generator.notifyUpdateFinished(this._mapTime(currentTime));
	}

	/**
	 * @override
	 */
	notifyRemoved() {
		this._generator.notifyRemoved();
	}

	/**
	 * @param {number} dofIndex
	 * @param {LayerState} partialRender
	 * @param {Object} blackboard
	 * @returns {number[]}
	 * @virtual
	 */
	getDOFState(dofIndex, partialRender, blackboard) {
		return this._generator.getDOFState(dofIndex, partialRender, blackboard);
	}
}

export default VariableSpeedMotionGenerator;