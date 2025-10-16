"use strict";

/**
 * @constructor
 */
const LookatNodeDistanceReport = function(){

	/** @type{number} */
	this.highestDistanceHoldToFiltered = 0;

	/** @type{number} */
	this.highestDistanceHoldToOptimal = 0;

	/** @type{number} */
	this.highestDistanceOptimalToFiltered = 0;

	/** @type{number} */
	this.highestVelocityFiltered = 0;
};

/**
 * @param {Pose} holdPose
 * @param {Pose} optimalPose
 * @param {Pose} filteredOutput
 */
LookatNodeDistanceReport.prototype.compute = function(holdPose, optimalPose, filteredOutput){

	this.highestDistanceHoldToFiltered = 0;

	this.highestDistanceHoldToOptimal = 0;

	this.highestDistanceOptimalToFiltered = 0;

	this.highestVelocityFiltered = 0;

	var dofIndices = holdPose.getDOFIndices();
	for(var i = 0; i < dofIndices.length; i++){
		var index = dofIndices[i];

		var distanceHoldToFiltered = Math.abs(holdPose.getByIndex(index,0) - filteredOutput.getByIndex(index,0));
		var distanceHoldToOptimal = Math.abs(holdPose.getByIndex(index,0) - optimalPose.getByIndex(index,0));
		var distanceOptimalToFiltered = Math.abs(optimalPose.getByIndex(index,0) - filteredOutput.getByIndex(index,0));
		var velocityFiltered = Math.abs(filteredOutput.getByIndex(index,1));

		if(distanceHoldToFiltered > this.highestDistanceHoldToFiltered){
			this.highestDistanceHoldToFiltered = distanceHoldToFiltered;
		}
		if(distanceHoldToOptimal > this.highestDistanceHoldToOptimal){
			this.highestDistanceHoldToOptimal = distanceHoldToOptimal;
		}
		if(distanceOptimalToFiltered > this.highestDistanceOptimalToFiltered){
			this.highestDistanceOptimalToFiltered = distanceOptimalToFiltered;
		}
		if(velocityFiltered > this.highestVelocityFiltered){
			this.highestVelocityFiltered = velocityFiltered;
		}

	}
};


export default LookatNodeDistanceReport;