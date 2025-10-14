"use strict";

const CyclicMath = function(){

};

/**
 * Return the angle whose value is closest to "referenceAngle" and
 * with the same angular position as "angle"
 *
 * @param {number} angle
 * @param {number} referenceAngle
 */
CyclicMath.closestEquivalentRotation = function(angle, referenceAngle){
	const delta = referenceAngle - angle;
	const addRevolutions = Math.floor((delta + Math.PI) / (Math.PI*2));
	const converted = angle + addRevolutions*Math.PI*2;
	return converted;
};

export default CyclicMath;