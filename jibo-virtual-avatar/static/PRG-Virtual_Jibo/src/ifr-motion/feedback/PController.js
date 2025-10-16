"use strict";

import Bakery from "../../ifr-core/Bakery.js";
import CyclicMath from "../base/CyclicMath.js";

const PController = function(){
	/** @type {Time} */
	this._targetTime = null;
	/** @type {number} */
	this._targetPosition = null;
	/** @type {number} */
	this._targetVelocity = null;

	/** @type {Time} */
	this._lastObservationTime = null;
	/** @type {number} */
	this._lastObservedPosition = null;
	/** @type {number} */
	this._lastObservedVelocity = null;
	/** @type {number} */
	this._lastReportedTargetVelocity = null;

	/** @type {number} */
	this._commandVelocity = 0;
	/** @type {number} */
	this._commandAcceleration = 1;

	/** @type {number} */
	this._lastError = 0;

	this._window = "FeedbackController";
};

PController.prototype.setTarget = function(time, position, velocity){
	this._targetTime = time;
	this._targetPosition = position;
	this._targetVelocity = velocity;
};

PController.prototype.acceptFeedback = function(receivedTime, measuredPosition, measuredVelocity, targetVelocity){
	this._lastObservationTime = receivedTime;
	this._lastObservedPosition = measuredPosition;
	this._lastObservedVelocity = measuredVelocity;
	this._lastReportedTargetVelocity = targetVelocity;
};

/**
 *
 * @param {Time} time
 */
PController.prototype.calculateForTime = function(time){
	if(this._lastObservationTime !== null && this._targetTime !== null){
		const targetElapsed = time.subtract(this._targetTime);
		const currentTarget = this._targetPosition + this._targetVelocity * targetElapsed;

		const pGain = Bakery.getFloat("P Gain", 0, 10, 2, this._window);
		const dGain = Bakery.getFloat("D Gain", 0, 10, 0, this._window);

		let useActual = this.predictedPosition(time);
		useActual = CyclicMath.closestEquivalentRotation(useActual, currentTarget);

		const error = currentTarget - useActual;
		const dError = error - this._lastError;

		let commandVelocity = pGain * error + dGain * dError;

		this._lastError = error;

		const maxVel = Bakery.getFloat("P Gain Vel Cap", 0, 100, 100, this._window);

		commandVelocity = Math.max(-maxVel, Math.min(maxVel, commandVelocity));

		this._commandVelocity = commandVelocity;
		this._commandAcceleration = Bakery.getFloat("Advertise Accel Limit", 0, 50, 30, this._window);

	}
};

/**
 *
 * @param {Time} time
 */
PController.prototype.predictedPosition = function(time){ // eslint-disable-line no-unused-vars
	return this._lastObservedPosition; //TODO
};


PController.prototype.getCommandVelocity = function(){
	return this._commandVelocity;
};

PController.prototype.getCommandAcceleration = function(){
	return this._commandAcceleration;
};

/**
 *
 * @param {Time} timeSent
 * @param {number} commandVelocity
 * @param {number} velocityLimit
 */
PController.prototype.noteCommandSent = function(timeSent, commandVelocity, velocityLimit){ // eslint-disable-line no-unused-vars
	//TODO
};

export default PController;