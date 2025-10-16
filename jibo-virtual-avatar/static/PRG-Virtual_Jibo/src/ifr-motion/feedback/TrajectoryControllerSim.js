"use strict";

import AccelPlanner from "../base/AccelPlanner.js";
import Clock from "../../ifr-core/Clock.js";
import CyclicMath from "../base/CyclicMath.js";
import slog from "../../ifr-core/SLog.js";

/**
 *
 * All arguments optional. Initial position/velocity can be provided here.
 * If this plan is sampled before any updateCommand's are issued, it will
 * be traveling at initialVelocity from initialPosition with zero acceleration.
 *
 * @param {number} [initialPosition] - defaults to 0
 * @param {number} [initialVelocity] - defaults to 0
 * @param {Time} [initialTime] - defaults to current time
 * @constructor
 */
const TrajectoryControllerSim = function(initialPosition, initialVelocity,
										initialTime){
	if(initialPosition == null){ //null or undefined (eqnull)
		initialPosition = 0;
	}
	if(initialVelocity == null){
		initialVelocity = 0;
	}
	if(initialTime == null){
		initialTime = Clock.currentTime();
	}
	/** @type {AccelPlanner} */
	this._planner = new AccelPlanner();
	/** @type {AccelPlan} */
	this._plan = this._planner.computeWithZeroAccel(initialVelocity);
	/** @type {Time} */
	this._planStartTime = initialTime;
	/** @type {number} */
	this._planStartPosition = initialPosition;
};

/**
 *
 * @param {number} targetPosition
 * @param {number} targetVelocity
 * @param {number} interceptInSeconds
 * @param {number} maxAcceleration
 * @param {number} maxVelocity
 * @param {Time} [currentTime] - time to activate command (current time used if omitted)
 */
TrajectoryControllerSim.prototype.updateCommand = function(targetPosition, targetVelocity, interceptInSeconds,
															maxAcceleration, maxVelocity,
															currentTime){
	if(currentTime == null){ //null or undefined (eqnull)
		currentTime = Clock.currentTime();
	}

	const tDelta = currentTime.subtract(this._planStartTime);

	const currentPosition = this._plan.displacementAtTime(tDelta) + this._planStartPosition;
	const currentVelocity = this._plan.velocityAtTime(tDelta);

	targetPosition = CyclicMath.closestEquivalentRotation(targetPosition, currentPosition);

	this._plan = this._planner.computeWithMaxAccel(currentVelocity, targetVelocity,
													targetPosition - currentPosition,
													maxAcceleration, interceptInSeconds);
	if(!this._plan.isConsistent()){
		slog.error("Inconsistent plan with inputs: " +
			"\n\tcurrentVelocity:"+currentVelocity+" " +
			"\n\ttargetVelocity:"+targetVelocity+" " +
			"\n\tpDelta:"+(targetPosition - currentPosition)+" " +
			"\n\tmaxAcceleration:"+maxAcceleration+" " +
			"\n\tmaxVelocity:"+maxVelocity);
		this.plan = this._planner.computeWithMaxAccel(0, 0, 0, 1, 1);
	}
	this._planStartTime = currentTime;
	this._planStartPosition = currentPosition;
};

/**
 * @param {Time} [currentTime] - time at which to get position (current time used if omitted)
 * @return {number}
 */
TrajectoryControllerSim.prototype.getPosition = function(currentTime){
	if(currentTime == null){ //null or undefined (eqnull)
		currentTime = Clock.currentTime();
	}

	const tDelta = currentTime.subtract(this._planStartTime);

	const currentPosition = this._plan.displacementAtTime(tDelta) + this._planStartPosition;
	return currentPosition;
};

/**
 * @param {Time} [currentTime] - time at which to get velocity (current time used if omitted)
 * @return {number}
 */
TrajectoryControllerSim.prototype.getVelocity = function(currentTime){
	if(currentTime == null){ //null or undefined (eqnull)
		currentTime = Clock.currentTime();
	}

	const tDelta = currentTime.subtract(this._planStartTime);

	const currentVelocity = this._plan.velocityAtTime(tDelta);
	return currentVelocity;
};

export default TrajectoryControllerSim;