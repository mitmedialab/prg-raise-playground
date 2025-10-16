"use strict";

import LayerCombiner from "./LayerCombiner.js";
import Pose from "../../ifr-motion/base/Pose.js";
import LayerState from "./LayerState.js";
import Time from "../../ifr-core/Time.js";
import slog from "../../ifr-core/SLog.js";

/**
 * @param {RobotInfo} robotInfo
 * @constructor
 */
class SimpleLayerCombiner extends LayerCombiner {
	constructor(robotInfo) {
		super();

		/** @type {SampleCombiner[]} */
		this.sampleCombiners = [];
		/** @type {string[]} */
		this.layerNames = [];

		/** @type {string[]} */
		this.dofNames = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames();
		/** @type {DOFInfo[]} */
		this.dofInfoList = [];
		for (let dofIndex=0; dofIndex<this.dofNames.length; dofIndex++) {
			this.dofInfoList.push(robotInfo.getDOFInfo(this.dofNames[dofIndex]));
		}
	}

	/**
	 * @param {string} layerName
	 * @param {SampleCombiner} sampleCombiner
	 */
	addSampleCombiner(layerName, sampleCombiner) {
		this.layerNames.push(layerName);
		this.sampleCombiners.push(sampleCombiner);
	}

	/**
	 * @param {number[]} layerIndices
	 * @param {LayerState[]} layerStates
	 * @returns {LayerState}
	 * @override
	 */
	combineLayers(layerIndices, layerStates) {
		if (layerStates.length !== this.sampleCombiners.length) {
			slog.warn("Layer state count doesn't match combiner count");
		}

		// Create a new combined layer state with proper Time (0 seconds, 0 microseconds)
		const combinedPose = new Pose("combined", this.dofNames);
		const combinedState = new LayerState(new Time(0, 0), combinedPose);

		// combine
		for (let dofIndex=0; dofIndex<this.dofNames.length; dofIndex++) {
			let combinedValue = null;

			// iterate through layers for this dof
			for (let layerIndex=0; layerIndex<layerStates.length; layerIndex++) {
				const value = layerStates[layerIndex].getPose().getByIndex(dofIndex);
				if (value !== null) {
					if (combinedValue === null) {
						// this is the first layer with data for this dof
						combinedValue = value.slice();
					}
					else {
						// there's existing data and this layer also has data
						if (layerIndex < this.sampleCombiners.length && this.sampleCombiners[layerIndex] !== null) {
							// Only combine if we have a valid sample combiner (null means no combination)
							combinedValue = this.sampleCombiners[layerIndex].combine(combinedValue, value, dofIndex, this.dofInfoList[dofIndex]);
						}
						// If sample combiner is null, just keep the first value (no combination)
					}
				}
			}

			if (combinedValue !== null) {
				combinedState.getPose().setByIndex(dofIndex, combinedValue);
			}
		}

		return combinedState;
	}
}

export default SimpleLayerCombiner;