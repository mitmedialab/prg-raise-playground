"use strict";

import slog from "../../ifr-core/SLog.js";
import LookatMotionGenerator from "./LookatMotionGenerator.js";
import TimelineEventDispatcher from "./TimelineEventDispatcher.js";

const channel = "LOOKAT";

/**
 * @param {LookatMotionGenerator} generator
 * @constructor
 */
class LayerStatus {
	constructor(generator) {
		this.generator = generator;
		this.layerHasStarted = false;
		this.layerHasStopped = false;
		this.layerHasRemoved = false;
	}
}

/**
 * @param {AnimationUtilities} animUtils
 * @param {MotionLookat} lookat
 * @param {jibo.animate.Time} startTime
 * @param {THREE.Vector3} target
 * @param {boolean} continuous
 * @param {LookatOrientationStatusReporter} orientationReporter
 * @constructor
 */
class LookatMultiLayerStatusManager {
	constructor(animUtils, lookat, startTime, target, continuous, orientationReporter) {
		/** @type {AnimationUtilities} */
		this._animUtils = animUtils;

		/** @type {Map<LookatMotionGenerator,LayerStatus>} */
		this._layerStatuses = new Map();

		this._clipStartedHandler = null;
		this._clipStoppedHandler = null;
		this._clipRemovedHandler = null;
		this._targetReachedHandler = null;
		this._targetSupersededHandler = null;

		/** @type {THREE.Vector3} */
		this._waitingToNotifyOnTarget = null;

		/** @type {MotionLookat} */
		this._lookat = lookat;

		/** @type {jibo.animate.Time} */
		this._startTime = startTime;

		/** @type {THREE.Vector3} */
		this._target = null;
		/** @type {boolean} */
		this._continuous = continuous;

		/** @type {LookatOrientationStatusReporter} */
		this._orientationReporter = orientationReporter;


		/** @type {boolean} */
		this._haveSentStart = false;

		var dofCount = this._animUtils.dofIndicesToNames.length;
		/**
		 * This is an array of booleans (active) indexed by global DOF index
		 * @type {boolean[]}
		 */
		this._activeDOFMask = new Array(dofCount).fill(false);

		this.setTarget(target);
	}

	/**
	 * Create generator to render nodes on a particular layer with the provided dofs.
	 *
	 * @param {string[] }dofNames
	 * @return {LookatMotionGenerator}
	 */
	createGenerator(dofNames){
		var gen = new LookatMotionGenerator(this._animUtils, this._lookat, this._startTime, this._target, dofNames, this, this._orientationReporter);
		this._layerStatuses.set(gen, new LayerStatus(gen));
		//set that generator's events to come back to us for filtering/passing on to eventual listeners
		gen.setHandlers(
			this.handleStarted.bind(this, gen),
			this.handleStopped.bind(this, gen),
			this.handleRemoved.bind(this, gen),
			null);
		return gen;
	}


	setHandlers(clipStartedHandler, clipStoppedHandler, clipRemovedHandler,
																targetReachedHandler, targetSupersededHandler){
		this._clipStartedHandler = clipStartedHandler;
		this._clipStoppedHandler = clipStoppedHandler;
		this._clipRemovedHandler = clipRemovedHandler;
		this._targetReachedHandler = targetReachedHandler;
		this._targetSupersededHandler = targetSupersededHandler;
	}

	/**
	 *
	 * @param {THREE.Vector3} newTarget
	 */
	setTarget(newTarget) {
		var iter = this._layerStatuses.keys(); //removing for of for optimizer
		var nextVal;
		while(!(nextVal = iter.next()).done){
			nextVal.value.setTarget(newTarget);
			//this._layerStatuses.get(gen)._targetReached = false;
		}
		if(this._waitingToNotifyOnTarget != null && this._targetSupersededHandler != null){
			TimelineEventDispatcher.queueEvent(this._targetSupersededHandler, [this._waitingToNotifyOnTarget]);
		}
		this._waitingToNotifyOnTarget = newTarget.clone();
		this._target = this._waitingToNotifyOnTarget;
	}

	/**
	 *
	 * @param {LookatMotionGenerator} generator
	 * @param {jibo.animate.Time} currentTime
	 * @return {boolean} true if generator should truncate to current time (end now naturally)
	 */
	handleUpdateFinishedForGenerator(generator, currentTime){
		//first check if we can skip this whole check;
		//if we are continuous and not waiting to notify on a target, we don't need to know, we won't truncate
		if(this._continuous && this._waitingToNotifyOnTarget===null){
			return false;
		}

		var iter = this._layerStatuses.keys(); //removing for of for optimizer
		var nextVal;
		while(!(nextVal = iter.next()).done){
			var gen = nextVal.value;
			var dofIndices = gen.getDOFIndices();
			for (var i = 0; i < dofIndices.length; i++) {
				this._activeDOFMask[dofIndices[i]] = gen.dofEndsAfter(dofIndices[i], currentTime);
			}
		}

		/** @type {boolean} */
		var reachedTarget = this._lookat.getHoldReached(this._activeDOFMask);

		if(reachedTarget && this._waitingToNotifyOnTarget!=null){
			//reachedTarget is actually a global state, across all layers.
			//so, we can safely notify now, don't need all layers to report this status
			if(this._targetReachedHandler != null){
				TimelineEventDispatcher.queueEvent(this._targetReachedHandler, [this._waitingToNotifyOnTarget]);
			}
			this._waitingToNotifyOnTarget = null;
		}

		if(reachedTarget && !this._continuous){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Returns the indices of all DOFs with motion data past the given time.
	 * @param {jibo.animate.Time} time - The query time.
	 * @return {number[]} - A list of active DOF indices.
	 */
	getActiveDOFIndices(time){
		var activeDOFIndices = [];

		var iter = this._layerStatuses.keys();
		var nextVal;
		while(!(nextVal = iter.next()).done){
			var gen = nextVal.value;
			var dofIndices = gen.getDOFIndices();
			for (var i = 0; i < dofIndices.length; i++) {
				if(gen.dofEndsAfter(dofIndices[i], time)){
					activeDOFIndices.push(dofIndices[i]);
				}
			}
		}

		return activeDOFIndices;
	}

	/**
	 * Called by each generator when they start.  We will pass through 1 started when
	 * at least one has started and all have been either started or removed.
	 */
	handleStarted(generator){
		var genStatus = this._layerStatuses.get(generator);
		genStatus.layerHasStarted = true;
		if(this._clipStartedHandler) {
			var allStartedOrRemoved = true;
			for (var genStatusI of this._layerStatuses.values()) {
				if (!(genStatusI.layerHasStarted || genStatusI.layerHasRemoved)) {
					allStartedOrRemoved = false;
				}
			}
			if (allStartedOrRemoved) {
				TimelineEventDispatcher.queueEvent(this._clipStartedHandler, []);
				this._haveSentStart = true;
			}
		}
	}

	/**
	 * Called by each generator when/if they stopped
	 *
	 * Each clip will be either removed exactly once and stopped at most once.  We will
	 * pass through a single stop if it comes in on the last active (not stopped or removed) layer.
	 *
	 * @param {LookatMotionGenerator} generator - the generator sending this event
	 * @param {boolean} interrupted
	 */
	handleStopped(generator, interrupted){
		var genStatus = this._layerStatuses.get(generator);
		if(genStatus.layerHasStopped){
			slog(channel, "LookatMultiLayerStatManager: getting stop event for stopped layer "+generator);
		}
		genStatus.layerHasStopped = true;
		if(this._clipStoppedHandler) {
			var allFinished = true;
			for (var genStatusI of this._layerStatuses.values()) {
				if (!(genStatusI.layerHasStopped || genStatusI.layerHasRemoved)) {
					allFinished = false;
				}
			}
			if(allFinished) {
				TimelineEventDispatcher.queueEvent(this._clipStoppedHandler, [interrupted]);
			}
		}
	}

	/**
	 * Called by each generator when/if they are removed.
	 *
	 * Each clip will be either removed exactly once and stopped at most once.  We will
	 * pass through a single "remove" when all have been removed.
	 *
	 * @param {LookatMotionGenerator} generator - the generator sending this event
	 * @param {boolean} started
	 * @param {boolean} stopped
	 */
	handleRemoved(generator, started, stopped){
		var genStatus = this._layerStatuses.get(generator);
		genStatus.layerHasRemoved = true;
		var genStatusI = null;

		//check if we need to start, which could happen if one layer already started then a second layer
		//removes without starting
		if(!this._haveSentStart && this._clipStartedHandler){
			//should send start if there will be no more starts and we have started at least once
			//all clips removed or started
			var noMoreStartsRemain = true;
			for(genStatusI of this._layerStatuses.values()) {
				if (!(genStatusI.layerHasRemoved || genStatusI.layerHasStarted)) {
					noMoreStartsRemain = false;
				}
			}
			if(noMoreStartsRemain){
				TimelineEventDispatcher.queueEvent(this._clipStartedHandler,[]);
				this._haveSentStart = true;
			}
		}

		if(this._clipRemovedHandler){
			var allRemoved = true;
			for (genStatusI of this._layerStatuses.values()) {
				if (!genStatusI.layerHasRemoved) {
					allRemoved = false;
				}
			}
			if(allRemoved) {
				TimelineEventDispatcher.queueEvent(this._clipRemovedHandler, [started, stopped]);
			}
		}
	}
}

export default LookatMultiLayerStatusManager;