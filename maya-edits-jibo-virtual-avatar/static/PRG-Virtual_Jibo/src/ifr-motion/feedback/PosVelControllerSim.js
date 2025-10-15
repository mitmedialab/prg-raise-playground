"use strict";

import TrajectoryControllerSim from "./TrajectoryControllerSim.js";

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
 * @extends TrajectoryControllerSim
 */
const PosVelControllerSim = function(initialPosition, initialVelocity, initialTime){

	TrajectoryControllerSim.call(this, initialPosition, initialVelocity, initialTime);

};

PosVelControllerSim.prototype = Object.create(TrajectoryControllerSim.prototype);
PosVelControllerSim.prototype.constructor = PosVelControllerSim;

/**
 *
 * @param {number} targetPosition
 * @param {number} targetVelocity
 * @param {number} maxAcceleration
 * @param {number} maxVelocity
 * @param {Time} [currentTime] - time to activate command (current time used if omitted)
 * @override
 */
PosVelControllerSim.prototype.updateCommand = function(targetPosition, targetVelocity, maxAcceleration, maxVelocity, currentTime){

	const interceptInSeconds = 0.1;
	TrajectoryControllerSim.prototype.updateCommand.call(this, targetPosition, targetVelocity, interceptInSeconds, maxAcceleration, maxVelocity, currentTime);

};

export default PosVelControllerSim;