"use strict";

import Pose from "../../ifr-motion/base/Pose.js";
import DOFGlobalAlignment from "../../ifr-motion/base/DOFGlobalAlignment.js";
import CyclicMath from "../../ifr-motion/base/CyclicMath.js";
import slog from "../../ifr-core/SLog.js";
import TimelineEventDispatcher from "./TimelineEventDispatcher.js";
import LayerState from "./LayerState.js";

/**
 * @param {string} name
 * @param {RobotInfo} robotInfo
 * @param {Clock} clock
 * @param {LayerCombiner} layerCombiner
 * @param {string} modalityName
 *
 * @constructor
 */
class MotionTimeline {
	constructor(name, robotInfo, clock, layerCombiner, modalityName) {
		/** @type {string} */
		this._name = name;

		/** @type {Array.<MotionGenerator[]>} */
		this._layers = [];

		/** @type {string[]} */
		this._layerNames = [];
		/** @type {Object.<string, number>} */
		this._layerNameToIndex = {};

		/** @type {RobotInfo} */
		this._robotInfo = robotInfo;

		/** @type {string[]} */
		this._dofNames = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames();
		/** @type {Object.<string, number>} */
		this._dofNamesToIndices = robotInfo.getKinematicInfo().getDefaultPose().getDOFNamesToIndices();

		/**
		 * current state for each layer
		 * @type {Array.<LayerState>}*/
		this._layerStates = [];
		/**
		 * previous state for each layer
		 * @type {Array.<LayerState>}*/
		this._previousLayerStates = [];

		/**
		 * full combined system state
		 * @type {LayerState} */
		this._systemState = new LayerState(clock.currentTime(), robotInfo.getKinematicInfo().getDefaultPose().getCopy());
		/**
		 * previous combined system state
		 * @type {LayerState}*/
		this._previousSystemState = this._systemState.getCopy();

		/** @type {Object} */
		this._blackboard = {};

		/** @type {Array.<*>} */
		this._outputs = [];

		/** @type {Clock} */
		this._clock = clock;

		/** @type {LayerCombiner} */
		this._layerCombiner = layerCombiner;

		/** @type {string} */
		this._modalityName = modalityName;

		/** @type {DOFGlobalAlignment} */
		this._dofAlignment = new DOFGlobalAlignment(this._robotInfo.getKinematicInfo().getFullKinematicGroup(), null);

		/** @type {string[]} */
		var sortedDOFNames = this._dofNames.slice(0);
		sortedDOFNames = this._dofAlignment.sortDOFsByDepth(sortedDOFNames);
		/** @type {number[]} */
		this._sortedDOFIndices = [];
		var dofIndex;
		for (dofIndex=0; dofIndex<sortedDOFNames.length; dofIndex++)
		{
			this._sortedDOFIndices.push(this._dofNamesToIndices[sortedDOFNames[dofIndex]]);
		}

		/** @type {Array.<boolean[]>} */
		this._layerDOFFlags = [];

		/** @type {DOFInfo[]} */
		this._dofInfoList = [];
		for (dofIndex=0; dofIndex<this._dofNames.length; dofIndex++)
		{
			this._dofInfoList.push(this._robotInfo.getDOFInfo(this._dofNames[dofIndex]));
		}

		/** @type {number} */
		this._minimumUpdateDelay = 0.01;
	}

	/**
	 * @param {string} modality
	 *
	 * @return {MotionTimeline}
	 */
	getModalityDelegate(modality)
	{
		if (modality === this._modalityName)
		{
			return this;
		}
		else
		{
			return null;
		}
	}

	/**
	 * @return {Clock}
	 */
	getClock()
	{
		return this._clock;
	}

	/**
	 * @return {string}
	 */
	getName()
	{
		return this._name;
	}

	/**
	 * @param {string} layerName
	 * @param {string[]} [dofs]
	 */
	createLayer(layerName, dofs)
	{
		if (!this._layerNameToIndex.hasOwnProperty(layerName))
		{
			if (dofs == null) { //null or undefined (eqnull)
				dofs = this._dofNames;
			}

			var layerIndex = this._layers.length;
			this._layers.push([]);
			this._layerNames.push(layerName);
			this._layerNameToIndex[layerName] = layerIndex;

			var initialPose = this._robotInfo.getKinematicInfo().getDefaultPose();
			var pose = new Pose(layerName + "_pose", dofs.slice(0));
			pose.setPose(initialPose);

			var state = new LayerState(this._clock.currentTime(), pose);
			this._layerStates.push(state);
			this._previousLayerStates.push(state.getCopy());

			var dofFlags = new Array(this._dofNames.length).fill(false);
			for (var i=0; i<dofs.length; i++)
			{
				var dofIndex = this._dofNamesToIndices[dofs[i]];
				dofFlags[dofIndex] = true;
			}
			this._layerDOFFlags.push(dofFlags);
		}
		else
		{
			slog.error("Not creating Timeline layer "+layerName+" since we already have one!");
		}
	}

	/**
	 * @return {Array.<string>}
	 */
	getLayerNames()
	{
		return this._layerNames.slice(0);
	}

	/**
	 * @return {LayerCombiner}
	 */
	getLayerCombiner()
	{
		return this._layerCombiner;
	}

	/**
	 * get the current combined state for the timeline.
	 * the state will combine all layers by default, or optionally just a
	 * specified subset of layers.
	 * @param {string[]} [layerNames] - the subset of layers to combine (defaults to all layers)
	 * @return {LayerState}
	 */
	getCurrentState(layerNames)
	{
		if (!layerNames)
		{
			return this._systemState;
		}

		/** @type {LayerState[]} */
		var layerStates = [];
		/** @type {number[]} */
		var layerIndices = [];
		var i, layerIndex;
		for (i=0; i<layerNames.length; i++)
		{
			layerIndex = this._layerNameToIndex[layerNames[i]];
			if (layerIndex !== undefined)
			{
				layerStates.push(this._layerStates[layerIndex]);
				layerIndices.push(layerIndex);
			}
			else
			{
				slog.error("MotionTimeline: requested state for unknown layer: "+layerNames[i]);
				return null;
			}
		}

		var currentState = this._layerCombiner.combineLayers(layerIndices, layerStates);

		// calculate velocity
		if (currentState !== null)
		{
			/** @type {LayerState[]} */
			var previousLayers = null;
			if (currentState.getTime().subtract(this._previousLayerStates[layerIndices[0]].getTime()) >= this._minimumUpdateDelay)
			{
				previousLayers = this._previousLayerStates;
			}

			if (previousLayers !== null)
			{
				/** @type {LayerState[]} */
				var previousLayerStates = [];
				for (i=0; i<layerIndices.length; i++)
				{
					previousLayerStates.push(previousLayers[layerIndices[i]]);
				}

				var previousState = this._layerCombiner.combineLayers(layerIndices, previousLayerStates);
				if (previousState !== null)
				{
					this.computeVelocity(previousState, currentState);
				}
			}
		}

		return currentState;
	}

	/**
	 * @param {MotionGenerator} motionGenerator
	 * @param {string} layerName
	 * @return {MotionGenerator} - the motion generator, or null if add failed
	 */
	add(motionGenerator, layerName)
	{
		var layerIndex = this._layerNameToIndex[layerName];
		if (layerIndex === undefined)
		{
			slog.error("MotionTimeline: skipping add on unknown layer: "+layerName);
			return null;
		}

		var startTime = motionGenerator.getStartTime();
		var dofIndices = motionGenerator.getDOFIndices();

		var insertAt = 0;
		var intoLayer = this._layers[layerIndex];
		var i = 0;

		while (i < intoLayer.length)
		{
			//iterate over clips in this layer.  find the spot where we should be inserted
			//crop existing clips if necessary, and delete them if the crop makes them empty

			var clip = intoLayer[i];
			if (clip.endsAfter(startTime))
			{
				//clip may need to be truncated where it overlaps with newClip
				clip.cropEnd(startTime, dofIndices);
			}
			if (!clip.isEmpty())
			{
				i++;
			}
			else
			{
				intoLayer.splice(i, 1); //remove the clip
				clip.notifyRemoved();
			}

			if (startTime.isGreaterOrEqual(clip.getStartTime()))
			{
				insertAt = i; //we can be after "clip".  insertAt will advance until we cannot be after the "clip"
			}
		}

		if (!motionGenerator.isEmpty())
		{
			intoLayer.splice(insertAt, 0, motionGenerator);
		}
		else
		{
			//console.log("Immediately removing new clip "+newClip.getName()+" since it has zero duration");
			motionGenerator.notifyRemoved();
			motionGenerator = null;
		}

		return motionGenerator;
	}

	/**
	 * Remove any clips that end on or before cullToTime.
	 *
	 * @param {jibo.animate.Time} cullToTime
	 */
	cullUpToTime(cullToTime)
	{
		var li, ci;
		for(li = 0; li < this._layers.length; li++) {
			var layer = this._layers[li];
			ci = 0;
			while(ci < layer.length && cullToTime.isGreater(layer[ci].getStartTime())){
				var clip = layer[ci];
				if(!clip.endsAfter(cullToTime)){
					layer.splice(ci, 1); //remove from layer, don't need to increase index
					clip.notifyRemoved();
				}else{
					ci++;
				}
			}
		}
	}

	/**
	 * @param {jibo.animate.Time} currentTime
	 */
	render(currentTime)
	{
		var layerIndex, sortedDOFIndex, dofIndex, clipIndex;
		var layer, clip;
		/** @type {number[]} */
		var newDOFState;
		/** @type {MotionGenerator} */
		var generatorForDOF;
		///** @type {jibo.animate.Time} */
		var previousLayerRenderTime;

		// swap the current and previous states
		var tempState = this._previousSystemState;
		this._previousSystemState = this._systemState;
		this._systemState = tempState;
		this._systemState.setTime(currentTime);
		for (layerIndex = 0; layerIndex < this._layers.length; layerIndex++)
		{
			tempState = this._previousLayerStates[layerIndex];
			this._previousLayerStates[layerIndex] = this._layerStates[layerIndex];
			this._layerStates[layerIndex] = tempState;
			this._layerStates[layerIndex].setTime(currentTime);
		}

		// clear the blackboard
		this._blackboard = {};

		// render dof-by-dof in skeleton-sorted order

		for (sortedDOFIndex = 0; sortedDOFIndex < this._sortedDOFIndices.length; sortedDOFIndex++)
		{
			dofIndex = this._sortedDOFIndices[sortedDOFIndex];

			for (layerIndex = 0; layerIndex < this._layers.length; layerIndex++)
			{
				if (this._layerDOFFlags[layerIndex][dofIndex])
				{
					layer = this._layers[layerIndex];
					previousLayerRenderTime = this._previousLayerStates[layerIndex].getTime();

					/** @type {MotionGenerator} */
					generatorForDOF = null;

					clipIndex = 0;
					while (clipIndex < layer.length && currentTime.isGreaterOrEqual(layer[clipIndex].getStartTime()))
					{
						clip = layer[clipIndex];
						if (clip.dofEndsAfter(dofIndex, previousLayerRenderTime))
						{
							generatorForDOF = clip;
						}
						clipIndex++;
					}

					/** @type {number[]} */
					newDOFState = null;
					if (generatorForDOF)
					{
						newDOFState = generatorForDOF.getDOFState(dofIndex, this._systemState, this._blackboard);

						// check for invalid dof states
						if (!(newDOFState instanceof Array) || newDOFState.length === 0)
						{
							slog.warn("MotionTimeline: generator "+generatorForDOF.getName()+" on layer "+this._layerNames[layerIndex]+" generated non-array or empty value for "+this._dofNames[dofIndex]+":");
							slog.warn("MotionTimeline: generated value: ("+newDOFState+")");
							newDOFState = null;
						}
						else if (this._dofInfoList[dofIndex].isMetric() && (!Number.isFinite(newDOFState[0]) || (newDOFState.length > 1 && !Number.isFinite(newDOFState[1]))))
						{
							slog.warn("MotionTimeline: generator "+generatorForDOF.getName()+" on layer "+this._layerNames[layerIndex]+" generated non-finite value for "+this._dofNames[dofIndex]+":");
							slog.warn("MotionTimeline: generated value: ("+newDOFState+")");
							newDOFState = null;
						}
					}

					if (newDOFState === null)
					{
						// use the state from the previous tick
						newDOFState = this._previousLayerStates[layerIndex].getDOFStateByIndex(dofIndex);
					}

					this._layerStates[layerIndex].setDOFStateByIndex(dofIndex, newDOFState);

					// update partial render state
					if (layerIndex === 0)
					{
						this._systemState.setDOFStateByIndex(dofIndex, newDOFState);
					}
					else
					{
						this._layerCombiner.incrementState(this._systemState, layerIndex, this._layerStates[layerIndex], dofIndex);
					}
				}
			}
		}

		// compute the velocity for the current state
		this.computeVelocity(this._previousSystemState, this._systemState);
	}

	addOutput(output)
	{
		this._outputs.push(output);
	}

	removeOutput(output){
		var outputIndex = this._outputs.indexOf(output);
		if (outputIndex > -1){
			this._outputs.splice(outputIndex, 1);
		}
	}

	/**
	 * @return {Object[]}
	 */
	getOutputs()
	{
		return this._outputs;
	}

	/**
	 * compute velocity between two layer states, storing the result in the second state
	 * @param {LayerState} previousLayerState
	 * @param {LayerState} currentLayerState
	 */
	computeVelocity(previousLayerState, currentLayerState)
	{
		var elapsedTime = currentLayerState.getTime().subtract(previousLayerState.getTime());
		var previousPose = previousLayerState.getPose();
		var currentPose = currentLayerState.getPose();
		var dofIndices = currentPose.getDOFIndices();

		for (var d=0; d<dofIndices.length; d++)
		{
			var dofIndex = dofIndices[d];
			var dofInfo = this._dofInfoList[dofIndex];
			if (dofInfo.isMetric())
			{
				var currentValue = currentPose.getByIndex(dofIndex, 0);
				var previousValue = previousPose.getByIndex(dofIndex, 0);
				if (dofInfo.isCyclic())
				{
					currentValue = CyclicMath.closestEquivalentRotation(currentValue, previousValue);
				}
				var velocity = (currentValue - previousValue) / elapsedTime;
				//if(isNaN(velocity)){
				//	slog.error("MotionTimeline: got NaN velocity for "+dofName+" from "+previousValue+" to "+currentValue+" over time "+elapsedTime);
				//}
				currentPose.setByIndex(dofIndex, velocity, 1);
			}
		}
	}

	update()
	{
		/** @type {jibo.animate.Time} */
		var currentTime = this._clock.currentTime();
		if (currentTime.subtract(this._systemState.getTime()) < this._minimumUpdateDelay)
		{
			// update too soon, return!
			return;
		}

		//var layerNames = this._layerNames;
		var layerIndex, clipIndex;
		var layer;
		var clip;

		// notify update started
		for (layerIndex=0; layerIndex<this._layers.length; layerIndex++)
		{
			layer = this._layers[layerIndex];
			for (clipIndex=0; clipIndex<layer.length; clipIndex++)
			{
				clip = layer[clipIndex];
				clip.notifyUpdateStarted(currentTime);
			}
		}

		// render
		this.render(currentTime);

		// update outputs
		for (var outputIndex=0; outputIndex<this._outputs.length; outputIndex++)
		{
			var out = this._outputs[outputIndex];
			out.handleOutput(currentTime, this._systemState.getPose(), this._blackboard);
		}

		// notify update finished
		for (layerIndex=0; layerIndex<this._layers.length; layerIndex++)
		{
			layer = this._layers[layerIndex];
			for (clipIndex=0; clipIndex<layer.length; clipIndex++)
			{
				clip = layer[clipIndex];
				clip.notifyUpdateFinished(currentTime);
			}
		}

		this.cullUpToTime(currentTime);

		TimelineEventDispatcher.dispatchQueuedEvents();
	}

	/**
	 * @param {string} layerName
	 * @return {string[]}
	 */
	getDOFsForLayer(layerName)
	{
		var layerIndex = this._layerNameToIndex[layerName];
		if (layerIndex !== undefined)
		{
			return this._layerStates[layerIndex].getDOFNames();
		}
		else
		{
			return null;
		}
	}
}

export default MotionTimeline;
