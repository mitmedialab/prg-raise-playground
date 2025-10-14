/**
 * @file Extra math functions/wrappers for THREE math access.
 */

import THREE from "@jibo/three";

const ExtraMath = {};

ExtraMath.convertDirectionLocalToWorld = (function(){

	/** {THREE.Quaternion} */
	let worldQuaternion = null;

	/**
	 * Wrapper for converting a direction Vector3 from local to a THREE Object3D to a world direction.
	 *
	 * @param {THREE.Object3D} frame - localDirection is in this frame
	 * @param {THREE.Vector3} localDirection - local direction
	 * @param {THREE.Vector3} inplaceResult - (may be null or omitted or the same instance as direction)
	 */
	return function(frame, localDirection, inplaceResult){
		if(worldQuaternion === null){
			worldQuaternion = new THREE.Quaternion();
		}
		if(inplaceResult === undefined || inplaceResult === null){
			inplaceResult = new THREE.Vector3();
		}
		frame.getWorldQuaternion(worldQuaternion);
		return inplaceResult.copy(localDirection).applyQuaternion(worldQuaternion);
	};
}());

/**
 * Find a Vector3 orthogonal to the given Vector3.
 *
 * @param {THREE.Vector3} direction
 * @param {THREE.Vector3} inplaceResult - (may be null or omitted or the same instance as direction)
 */
ExtraMath.findOrthogonal = function(direction, inplaceResult){
	if(inplaceResult === undefined || inplaceResult === null){
		inplaceResult = new THREE.Vector3();
	}
	const ax = Math.abs(direction.x);
	const ay = Math.abs(direction.y);
	const az = Math.abs(direction.z);

	//works as long as one of the two being swapped is non zero
	if(ax >= ay && ax >= az){ //x is biggest, involve it
		inplaceResult.set(direction.y, -direction.x, 0);
	}else{ //y or z is biggest, involve them
		inplaceResult.set(0, direction.z, -direction.y);
	}
	return inplaceResult;
};


ExtraMath.quatFromAxisAngle = (function(){

	let normalizedAxis = null;

	/**
	 * Axis/Angle quaternion construction wrapper that doesn't require axis to be normalized.
	 *
	 * @param {THREE.Vector3} axis - rotational axis, doesn't need to be normalized
	 * @param {number} angle
	 * @param {THREE.Quaternion} inplaceQuaternion - optional inplace quaternion to fill in
	 * @returns {Quaternion}
	 */
	return function(axis, angle, inplaceQuaternion){

		if(normalizedAxis === null){
			normalizedAxis = new THREE.Vector3();
		}
		if(inplaceQuaternion === null){
			inplaceQuaternion = new THREE.Quaternion();
		}

		normalizedAxis.copy(axis).normalize();
		return inplaceQuaternion.setFromAxisAngle(normalizedAxis, angle);
	};
}());

ExtraMath.toString = function(vec3){
	return vec3!=null?("("+vec3.x+", "+vec3.y+", "+vec3.z+")"):"null";
};


export default ExtraMath;
