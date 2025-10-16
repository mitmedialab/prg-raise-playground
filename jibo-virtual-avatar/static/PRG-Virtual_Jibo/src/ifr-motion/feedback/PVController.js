"use strict";

import Bakery from "../../ifr-core/Bakery.js";
import PController from "./PController.js";

/**
 *
 * @constructor
 * @extends PController
 */
const PVController = function(){
	PController.call(this);

	/** @type {number} */
	this._commandVelocityPVC = 0;
};

PVController.prototype = Object.create(PController.prototype);
PVController.prototype.constructor = PVController;


/**
 * @param {Time} time
 * @override
 */
PVController.prototype.calculateForTime = function(time){
	if(this._lastObservationTime !== null && this._targetTime !== null){
		PController.prototype.calculateForTime.call(this, time);

		if(Bakery.getBoolean("Use Velocity", true, this._window)){
			this._commandVelocityPVC = this._commandVelocity + this._targetVelocity;
		}else{
			this._commandVelocityPVC = this._commandVelocity;
		}
	}
};

/**
 * @override
 * @returns {number}
 */
PVController.prototype.getCommandVelocity = function(){
	return this._commandVelocityPVC;
};

export default PVController;

