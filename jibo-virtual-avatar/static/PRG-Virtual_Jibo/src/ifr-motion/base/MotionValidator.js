"use strict";

const MotionValidator = {};

/**
 * Check if the data at each time key exists (is not null, is not undefined, is not a zero length array)
 *
 * @param {Motion} motion - motion to validate
 * @param {string[]} [onDOFs] - if present, check for the existence of these dofs (and keys for these dofs specifically). otherwise check those defined in motion.
 */
MotionValidator.valuesExist = function(motion, onDOFs){
	/** @type {Object.<string, MotionTrack>} */
	var tracks = motion.getTracks();
	var keys;
	if(onDOFs == null){
		keys = Object.keys(tracks);
	}else{
		keys = onDOFs;
	}
	for(var ki = 0; ki < keys.length; ki++){
		var data = tracks[keys[ki]].getMotionData();
		if(data == null){
			throw new Error("Error, motion ("+motion.getName()+") has null/undefined track ("+keys[ki]+").");
		}
		for(var si = 0; si < data.size(); si++) {
			var sample = data.getData(si);
			if (sample == null || (Array.isArray(sample) && sample.length < 1)) { //null or undefined (eqnull)
				throw new Error("Error, motion ("+motion.getName()+") has null/undefined/empty keys ("+keys[ki]+").");
			}
		}
	}
};

export default MotionValidator;