"use strict";

import THREE from "@jibo/three";
import slog from "../../ifr-core/SLog.js";
import ExtraMath from "../../ifr-geometry/ExtraMath.js";

const channel = "LOOKAT";

const epsilon = 0.001; //TODO: THREE has a high epsilon for converting quaternions to axis angle, ours could decrease if we switched implementation there
const epsilonSquared = epsilon*epsilon;
let visHelper = null;

const PointReport = function(){
	/**
	 * value 0 to PI/2 representing angle from target vec to axis (0 means solution arbitrary)
	 * @type {?number} */
	this._angleToAxis = null;
	this._distanceToTarget = null;
};

const PointADOF = {name:"PointADOF"};

PointADOF.PointReport = PointReport;

PointADOF.setVisHelper = function(useVisHelper){
	visHelper = useVisHelper;
};

/**
 * Find unsigned distance between "angle" and closest multiple of PI
 *
 * Find the min angle between a direction vector and a line (i.e., should always be 0 to PI/2)
 * @param angle - angle from a direction vector to a line
 */
const minAngleToLine = function(angle){
	angle = Math.abs(angle % Math.PI); //now between 0 and PI
	angle = Math.abs(Math.PI/2 - angle); //now between 0==ortho and PI/2==aligned
	angle = Math.PI/2 - angle; //now between 0==aligned, PI/2==ortho
	return angle;
};

/**
 * @param {number} original
 * @param {number} min
 * @param {number} max
 * @returns {number} value cyclically equivalent to original.  between min/max if possible, otherwise original is returned.
 */
// eslint-disable-next-line no-unused-vars
const replaceWithInLimitEquivalentIfPossible = function(original, min, max){
	var diff, numCircles, testOriginal;
	if(original > max){
		diff = original - max;
		numCircles = Math.ceil(diff / (Math.PI*2));
		testOriginal = original - (Math.PI*2)*numCircles;
		if(testOriginal >= min){
			return testOriginal;
		}else{
			return original;
		}
	}else if(original < min){
		diff = min - original;
		numCircles = Math.ceil(diff / (Math.PI*2));
		testOriginal = original + (Math.PI*2)*numCircles;
		if(testOriginal <= max){
			return testOriginal;
		}else{
			return original;
		}
	}else{
		return original;
	}
};


/**
 *
 * @param {THREE.Vector4} axisAngleV4 - rotational axis in XYZ (normalized), rotation magnitude in radians in W
 * @param {THREE.Vector3} referenceAxisV3 - assumed to be normalized
 * @return {number}
 */
const correctAngleSign = function(axisAngleV4, referenceAxisV3){
	var calculatedAxis = new THREE.Vector3().copy(axisAngleV4);
	var angleNow = calculatedAxis.angleTo(referenceAxisV3);
	var angleInv = calculatedAxis.multiplyScalar(-1).angleTo(referenceAxisV3);
	if(angleNow <= angleInv){
		//ok
		if(angleNow > 0.1 && minAngleToLine(axisAngleV4.w) > epsilon){ //expect arbitrary axes for singular rotations
			slog(channel, "Error, computed axis ("+calculatedAxis.x+", "+calculatedAxis.y+", "+calculatedAxis.z+") not so close ("+angleNow+") to references axis ("+referenceAxisV3.x+", "+referenceAxisV3.y+", "+referenceAxisV3.z+"), angle = "+axisAngleV4.w);
			return null;
		}
		return axisAngleV4.w;
	}else {
		//use inverse
		if(angleInv > 0.1 && minAngleToLine(axisAngleV4.w) > epsilon){ //expect arbitrary axes for singular rotations
			slog(channel, "Error, computed axis ("+calculatedAxis.x+", "+calculatedAxis.y+", "+calculatedAxis.z+") not so close ("+angleNow+") to references axis ("+referenceAxisV3.x+", "+referenceAxisV3.y+", "+referenceAxisV3.z+"), angle = "+axisAngleV4.w);
			return null;
		}
		return -axisAngleV4.w;
	}
};


/**
 * Gets the angle between forward and target, with all restricted to the plane provided
 * All are in the local coordinate space of transform (except target).  angleOrigin can be used
 * to change the origin point from which the ray to target is defined if that point is not the origin
 * of transform.
 *
 * @param transform - the transform that all the params in the coordinate system of
 * @param targetPosWorld - world space target
 * @param angleOrigin - local origin to calculate angle from
 * @param angleForward - local forward dir to calculate angel from
 * @param anglePlaneNormal - local plane normal to restrict angle to (also defines sign of result using RHR)
 * @param {PointReport} [pointReport] - inplace arg to return metadata about computation
 * @returns {?number} angle between angleForward and line from angleOrigin to targetPosWorld, with all projected onto anglePlaneNormal.  anglePlaneNormal defines sign of result using RHR
 */
PointADOF.getRelativeAngle = function(transform, targetPosWorld,
										angleOrigin, angleForward, anglePlaneNormal, pointReport){
	if(angleOrigin == null){
		angleOrigin = new THREE.Vector3(0,0,0);
	}

	var localTarget = transform.worldToLocal(new THREE.Vector3().copy(targetPosWorld));

	//wa may want to have params to subtract off local trans/rot
	//take local rotation out of localTarget
	//var localRotation = new THREE.Quaternion().copy(transform.quaternion);
	//localTarget.applyQuaternion(localRotation);

	//take local translation out of localTarget
	//var localTranslation = new THREE.Quaternion().copy(transform.position);
	//localTarget.sub(localTranslation);

	/** @type {THREE.Vector3} */
	var originToLocalTarget = (new THREE.Vector3().copy(localTarget)).sub(angleOrigin);

	if(pointReport){
		pointReport._angleToAxis = minAngleToLine(originToLocalTarget.angleTo(anglePlaneNormal));
		pointReport._distanceToTarget = originToLocalTarget.length();
	}

	var forwardProjected = new THREE.Vector3().copy(angleForward).projectOnPlane(anglePlaneNormal);
	var originToLocalTargetProjected = new THREE.Vector3().copy(originToLocalTarget).projectOnPlane(anglePlaneNormal);

	if(forwardProjected.lengthSq() < epsilonSquared){
		slog(channel, "Error getting relative angle, forward too close to plane normal ("+anglePlaneNormal.x+", "+anglePlaneNormal.y+", "+anglePlaneNormal.z+") too close to axis ("+anglePlaneNormal.x+", "+anglePlaneNormal.y+", "+anglePlaneNormal.z+")");
		return null;
	}
	if(originToLocalTargetProjected.lengthSq() < epsilonSquared){
		slog(channel, "Error getting relative angle, target dir too close to plane normal ("+anglePlaneNormal.x+", "+anglePlaneNormal.y+", "+anglePlaneNormal.z+") too close to axis ("+originToLocalTargetProjected.x+", "+originToLocalTargetProjected.y+", "+originToLocalTargetProjected.z+")");
		return null;
	}

	originToLocalTargetProjected.normalize();
	forwardProjected.normalize();

	//arguments must be normalized
	var rotationNeededQuaternion = new THREE.Quaternion().setFromUnitVectors(forwardProjected, originToLocalTargetProjected);
	var axisAngleV4 = new THREE.Vector4().setAxisAngleFromQuaternion(rotationNeededQuaternion);
	var signedAngle = correctAngleSign(axisAngleV4, anglePlaneNormal);

	if(visHelper !== null && visHelper.shouldDraw(this)){

		visHelper.drawRayLocal(this, "RelativeAngle:Forward", transform, angleOrigin, angleForward, new THREE.Color(1, 0, 0));

		visHelper.drawLineLocal(this, "RelativeAngle:Target", transform, angleOrigin, new THREE.Vector3().copy(angleOrigin).add(originToLocalTarget), new THREE.Color(0.6, 0.6, 0));

		visHelper.drawLineLocal(this, "RelativeAngle:FlatTarget", transform, angleOrigin, new THREE.Vector3().copy(angleOrigin).add(originToLocalTargetProjected), new THREE.Color(0, 1, 1));

		visHelper.drawRayLocal(this, "RelativeAngle:AxisOfRotation", transform, angleOrigin, anglePlaneNormal, new THREE.Color(0.5, 1, 0));
		visHelper.drawPlaneLocal(this, "RelativeAngle:PlaneOfRotation", transform, angleOrigin, anglePlaneNormal, new THREE.Color(1, 0, 1));
	}

	return signedAngle;
};

/**
 * This function defines an internal point in the coordinate system of transform by displacing
 * along -forward by internalDistanceToCenter.  Then, the intersection of a line between this point
 * and target is computed in the plane defined by angleOrigin and angleForward. All values restricted to
 * the plane defined by anglePlaneNormal.  anglePlaneNormal also defines the sign of the result (+ in RHR direction)
 *
 *
 * @param transform - the transform that all the params in the coordinate system of
 * @param targetPosWorld - world space target
 * @param angleOrigin - local origin to calculate angle from
 * @param angleForward - local forward dir to calculate angel from
 * @param anglePlaneNormal - local plane normal to restrict angle to
 * @param internalDistanceToCenter - distance behind the origin (-forward) to place the eye center
 * @param {PointReport} [pointReport] - inplace arg to return metadata about computation
 * @returns {?number}
 */
PointADOF.planeIntersectFromRear = function(transform, targetPosWorld,
											angleOrigin, angleForward, anglePlaneNormal,
											internalDistanceToCenter, pointReport) {
	if(angleOrigin == null){
		angleOrigin = new THREE.Vector3(0,0,0);
	}

	var internalOrigin = new THREE.Vector3().copy(angleForward).normalize().multiplyScalar(-internalDistanceToCenter).add(angleOrigin);

	var angle = PointADOF.getRelativeAngle(transform, targetPosWorld,
		internalOrigin, angleForward, anglePlaneNormal, pointReport);

	if(angle != null){
		var displacement;
		if(angle >= Math.PI/2){
			//slog(channel, "Cannot compute exact plane intersect, ray will not intersect plane");
			displacement = Number.POSITIVE_INFINITY;
		}else if(angle <= -Math.PI/2){
			//slog(channel, "Cannot compute exact plane intersect, ray will not intersect plane");
			displacement =  Number.NEGATIVE_INFINITY;
		}else{
			displacement = Math.tan(angle) * internalDistanceToCenter;
		}

		if(visHelper !== null && visHelper.shouldDraw(this)){

			var localTarget = transform.worldToLocal(new THREE.Vector3().copy(targetPosWorld));

			visHelper.drawLineLocal(this, "PlaneIntersectFromRear:InternalToTarget", transform, internalOrigin, localTarget, new THREE.Color(1, 1, 0));
		}

		return displacement;

	}else{
		slog(channel, "Plane intersect error, could not get angle");
		return null;
	}
};


/**
 * Computes the world-space ray towards the target given the result of two orthogonal "planeIntersectFromRear" dofs.
 *
 * I.e., you know the point on a 2D plane, computed for a given target via two separate dofs that each
 * rely on planeIntersectFromRear to compute their axis of the plane.  This function will compute the ray
 * to target that resulted in the given point.
 *
 * @param {THREE.Object3D} transform - the transform that all the params in the coordinate system of
 * @param {THREE.Vector3} angleOrigin - local origin to calculate angle from
 * @param {THREE.Vector3} angleForward - local forward dir to calculate angel from
 * @param {number} dofValue1 - the dof value defining one axis of the point on the plane
 * @param {THREE.Vector3} anglePlaneNormal1 - local plane normal to restrict angle to for the first dof (also defines positive direction)
 * @param {number} internalDistanceToCenter1 - distance behind the origin (-forward) to place the eye center for the first dof
 * @param {number} dofValue2 - the dof value defining the second axis of the point on the plane
 * @param {THREE.Vector3} anglePlaneNormal2 - local plane normal to restrict angle to for the second dof (also defines positive direction)
 * @param {number} internalDistanceToCenter2 - distance behind the origin (-forward) to place the eye center for the second dof
 * @param {THREE.Vector3} inplaceOrigin - inplace value to hold resulting origin
 * @param {THREE.Vector3} inplaceDirection - inplace value to hold resulting direction
 * @returns {boolean} true for success
 */
PointADOF.vectorFromPlaneIntersections = function(transform, angleOrigin, angleForward,
												dofValue1, anglePlaneNormal1, internalDistanceToCenter1,
												dofValue2, anglePlaneNormal2, internalDistanceToCenter2,
												inplaceOrigin, inplaceDirection) {
	if(angleOrigin == null){
		angleOrigin = new THREE.Vector3(0,0,0);
	}


	//this order for the cross product will make the positive direction in the same
	// direction as produced by getRelativeAngle/planeIntersectFromRear

	/** @type {THREE.Vector3} */
	var posDir1 = new THREE.Vector3().crossVectors(anglePlaneNormal1, angleForward);

	if(posDir1.lengthSq() < epsilonSquared){
		slog(channel, "vectorFromPlaneIntersections error, forward ("+ExtraMath.toString(angleForward)+")and normal1 ("+ExtraMath.toString(anglePlaneNormal1)+") are not orthogonal");
		return false;
	}
	posDir1.setLength(dofValue1);

	/** @type {THREE.Vector3} */
	var posDir2 = new THREE.Vector3().crossVectors(anglePlaneNormal2, angleForward);

	if(posDir2.lengthSq() < epsilonSquared){
		slog(channel, "vectorFromPlaneIntersections error, forward ("+ExtraMath.toString(angleForward)+")and normal2 ("+ExtraMath.toString(anglePlaneNormal2)+") are not orthogonal");
		return false;
	}
	posDir2.setLength(dofValue2);

	//in local space
	inplaceOrigin.copy(angleOrigin).add(posDir1).add(posDir2);


	//the direction will be a vector that would project as (a) on anglePlaneNormal1 and (b) on anglePlaneNormal2
	//
	// a) (angleOrigin - angleForward*internalDistanceToCenter1) -> (angleOrigin + posDir1)
	//       -angleForward*internalDistanceToCenter1 -> posDir1
	// b) (angleOrigin - angleForward*internalDistanceToCenter2) -> (angleOrigin + posDir2)
	//       -angleForward*internalDistanceToCenter2) -> posDir2
	// we assume that anglePlaneNormal1 and anglePlaneNormal2 are orthogonal

	//in local space
	posDir1.divideScalar(internalDistanceToCenter1);
	posDir2.divideScalar(internalDistanceToCenter2);
	inplaceDirection.copy(angleForward).normalize().add(posDir1).add(posDir2);

	transform.localToWorld(inplaceOrigin);
	ExtraMath.convertDirectionLocalToWorld(transform, inplaceDirection.normalize(), inplaceDirection);

	return true;
};

/**
 *
 * @param {RotationControl} rotationControl
 * @param {THREE.Object3D} transform
 * @param {THREE.Vector3} forward
 * @param {THREE.Vector3} targetPosWorld
 * @param {PointReport} [pointReport] - inplace arg to return metadata about computation
 * @return {number} closest dof value or null if cannot be computed (singularity)
 */
PointADOF.pointDOF = function(rotationControl, transform, forward, targetPosWorld, pointReport){
	var localTarget = transform.worldToLocal(new THREE.Vector3().copy(targetPosWorld));
	var localRotation = new THREE.Quaternion().copy(transform.quaternion);

	//take current rotation out of localTarget
	localTarget.applyQuaternion(localRotation);

	//rotate axis by initial so we have local-space axis
	var initialRotation = rotationControl.getInitialRotation(new THREE.Quaternion());
	var axis = rotationControl.getRotationalAxis(new THREE.Vector3());
	axis.applyQuaternion(initialRotation);

	//rotate forward so angles will reflect difference between "forward after initial-rot" and target
	var forwardRotated = new THREE.Vector3().copy(forward).applyQuaternion(initialRotation);

	if(pointReport){
		pointReport._angleToAxis = minAngleToLine(localTarget.angleTo(axis));
		pointReport._distanceToTarget = localTarget.length();
	}

	//remove non-axial components of directions
	var forwardProjected = new THREE.Vector3().copy(forwardRotated).projectOnPlane(axis);
	var localProjected = new THREE.Vector3().copy(localTarget).projectOnPlane(axis);

	//check for degenerate cases
	if(forwardProjected.lengthSq() < epsilonSquared || localProjected.lengthSq() < epsilonSquared){
		slog(channel, "Error pointing DOF, Forward length:"+forwardProjected.length()+" local length:"+localProjected.length());
		return null;
	}

	forwardProjected.normalize();
	localProjected.normalize();

	//find out how much rotation this quaternion represents around our given axis
	var rotationNeededQuaternion = new THREE.Quaternion().setFromUnitVectors(forwardProjected, localProjected);
	var axisAngleV4 = new THREE.Vector4().setAxisAngleFromQuaternion(rotationNeededQuaternion);
	var dofValue = correctAngleSign(axisAngleV4, axis);

	if(visHelper !== null && visHelper.shouldDraw(this)){

		visHelper.drawRayLocal(this, "PointAt:CurForwardDir", transform, null, forward, new THREE.Color(1, 0, 0));

		var axisRaw = rotationControl.getRotationalAxis(new THREE.Vector3());
		//ok to draw axis using current transform internal rotation since it is initial + axis-angle, and axis-angle portion won't affect axis
		visHelper.drawRayLocal(this, "PointAt:AxisOfRotation", transform, null, axisRaw, new THREE.Color(1, 1, 0));
		visHelper.drawPlaneLocal(this, "PointAt:PlaneOfRotation", transform, null, axisRaw, new THREE.Color(1, 0, 1));

		var forwardInitial = new THREE.Vector3().copy(forward);
		forwardInitial.applyQuaternion(initialRotation);
		forwardInitial.applyQuaternion(new THREE.Quaternion().copy(localRotation).inverse()); //undo the current frame influence when going local to world
		visHelper.drawRayLocal(this, "PointAt:InitForwardDir", transform, null, forwardInitial, new THREE.Color(0, 1, 1));

		var dofValueRotation = new THREE.Quaternion().setFromAxisAngle(axis, dofValue);
		var dofDir = new THREE.Vector3().copy(forwardRotated).applyQuaternion(dofValueRotation);
		dofDir.applyQuaternion(new THREE.Quaternion().copy(localRotation).inverse()); //undo the current frame influence when going local to world
		visHelper.drawRayLocal(this, "PointAt:FlatTargetVec", transform, null, dofDir, new THREE.Color(0,1,1));
	}

	return dofValue;
};



/**
 *
 * The first of the generated answers will be the one where the normal is on the side of "axis cross target";
 * that is, the lowest part of the plane will point down on that side.  Robot will "lean left" wrt the target
 * if the dof in question is vertical.
 *
 * @param {RotationControl} rotationControl
 * @param {THREE.Object3D} transform
 * @param {THREE.Vector3} planeNormal - would be plane normal if angleAbovePlaneForIntersection == 0, otherwise axis of cone
 * @param {number} distanceAlongDOFAxisToPlane - cone/plane is mounted this far along dof axis
 * @param {THREE.Vector3} targetPosWorld
 * @param {number} angleAbovePlaneForIntersection - angle of cone; 0 means a flat plane, positive values "raise" plane where up is the axis of control.
 * @param {boolean} approximateVerticalToLinear - if true, instead of "true" angle, imagine that linear axis rotation created linear vertical angle change
 * @param {PointReport} [pointReport] - inplace arg to return metadata about computation
 * @return {number[]} 1 or 2 points that cause cone to touch target or come as close as possible.
 */
PointADOF.pointDOFToIntersectConeWithPoint = function(rotationControl, transform, planeNormal,
														distanceAlongDOFAxisToPlane, targetPosWorld,
														angleAbovePlaneForIntersection, approximateVerticalToLinear,
														pointReport){
	var localTarget = transform.worldToLocal(new THREE.Vector3().copy(targetPosWorld));
	var localRotation = new THREE.Quaternion().copy(transform.quaternion);

	//take current rotation out of localTarget
	localTarget.applyQuaternion(localRotation);

	//rotate axis by initial so it's in true local space
	var initialRotation = rotationControl.getInitialRotation(new THREE.Quaternion());
	var axis = rotationControl.getRotationalAxis(new THREE.Vector3());
	var rotatedAxis = new THREE.Vector3().copy(axis).applyQuaternion(initialRotation);

	if(planeNormal.angleTo(axis) > Math.PI/2.0){
		//same plane, but makes trig assumptions simpler
		planeNormal = new THREE.Vector3().copy(planeNormal).multiplyScalar(-1);
	}

	//move localTarget to account for distanceAlongDOFAxisToPlane
	if(distanceAlongDOFAxisToPlane !== 0){
		var transVec = new THREE.Vector3().copy(rotatedAxis);
		transVec.multiplyScalar(distanceAlongDOFAxisToPlane/transVec.length());
		localTarget.sub(transVec);
	}

	//move localTarget to account for cone angle above plane
	if(angleAbovePlaneForIntersection !== 0){
		var bendForPlaneModAxis = new THREE.Vector3().crossVectors(rotatedAxis, localTarget).normalize();
		//applyAxisAngle REQUIRES normalize angle!!
		localTarget.applyAxisAngle(bendForPlaneModAxis, angleAbovePlaneForIntersection);
	}

	if(visHelper !== null && visHelper.shouldDraw(this)){
		//these will draw on "current" rotation of transform, before
		var normalStart = new THREE.Vector3().copy(axis).setLength(distanceAlongDOFAxisToPlane);

		visHelper.drawRayLocal(this, "Plane:Normal", transform, normalStart, planeNormal, new THREE.Color(1, 1, 1));

		var planeStart = new THREE.Vector3().copy(axis).setLength(distanceAlongDOFAxisToPlane);

		visHelper.drawConeLocal(this, "Plane:Surface", transform, planeStart, planeNormal, angleAbovePlaneForIntersection, new THREE.Color(1, 0, 1));
	}

	//we want the normal after the initial rot, ready to be rotated around axis
	var normalPostInitialRot = new THREE.Vector3().copy(planeNormal).applyQuaternion(initialRotation);

	//angle between axis and normal, after initial rotation on both
	var axisToNormalAngle = rotatedAxis.angleTo(normalPostInitialRot);

	if(axisToNormalAngle < epsilon){
		//planeNormal has already been replaced with opposite vector to be close to axis if necessary (above)
		//thus, angle should be between 0 and PI/2, don't need to also check against angles near PI for degeneracy
		slog(channel, "Error, plane normal ("+planeNormal.x+", "+planeNormal.y+", "+planeNormal.z+") too close to axis ("+axis.x+", "+axis.y+", "+axis.z+")");
		return null;
	}

	//here we look at the joint from the "side", that is, on a plane defined by the rotational axis and the target
	//we then decide, form this side view, what would the angle of the normal be (wrt axis) that would achieve the target
	//once we know that, we can compute the rotation of the axis that would achieve that normal angle in this projection
	//this is done in 2 parts.
	//   first the angle computed is how far axis must rotate for normal to achieve target from the "back" position
	//      "back" is the position where normal lines up with axis from this projection

	//what the normal would be, if the plane did intersect the target, projected onto the plane defined by axis and localTarget
	//PI/2 - (angle from axis to target) because "(angle from axis to target)" would be the plan itself, and we want the normal
	//positive angles lean off the left of axis on the plane; since we're rotating around axis from the "back", we'll want positive
	//rotations to get us over there
	var normalAngleProjected = Math.PI/2.0 - rotatedAxis.angleTo(localTarget);

	//the top side of a triangle on above plane defined by axis (length 1) and a hypotenuse starting at axis origin and with angle normalAngleProjected
	var dTopProjected = Math.tan(normalAngleProjected);

	//same style triangle, but with angle for actual normal
	var dTopNormal = Math.tan(axisToNormalAngle);


	//how far we need to rotate the normal from it's start so its projection would line up with normalAngleProjected
	//think unit circle: we are rotating a line of length dTopNormal until its projection on y = dTopProjected
	//(or in this case rotating dTopProjected around axis until its projection on the plane is dTopNormal, starting with it pointing directly away from plane (projection = 0 at theta=0))

	//max/min here clamps the ratio to -1 to 1, effectively making the target we shoot for be in the range achievable by the normal's angle off axis
	var rBackPosToProjected = null;
	if(approximateVerticalToLinear){
		//TODO: these two should be 2 selectable modes:
		//extra smooth at max/min, using reverse sin
		//rBackPosToProjected = Math.PI/2 * Math.sin(Math.PI/2 * (Math.max(-1, Math.min(1, dTopProjected / dTopNormal))));
		//linear to avoid extra motion at max/min to achieve last bit of angle
		rBackPosToProjected = (Math.PI/2.0)*(Math.max(-1, Math.min(1, dTopProjected / dTopNormal)));
	}else{
		rBackPosToProjected = Math.asin(Math.max(-1, Math.min(1, dTopProjected / dTopNormal)));
	}

	if(pointReport){
		pointReport._angleToAxis = minAngleToLine(localTarget.angleTo(rotatedAxis));
		pointReport._distanceToTarget = localTarget.length();
	}


	if(minAngleToLine(localTarget.angleTo(rotatedAxis)) < epsilon){
		slog(channel, "Error, Lookat Target local:("+localTarget.x+", "+localTarget.y+", "+localTarget.z+"), world:("+targetPosWorld.x+", "+targetPosWorld.y+", "+targetPosWorld.z+") too close to rotated axis ("+rotatedAxis.x+", "+rotatedAxis.y+", "+rotatedAxis.z+")");
		return null;
	}

	//now we need to know how far we need to rotate actual normal vector to reach "back" position
	var backVec = new THREE.Vector3().crossVectors(rotatedAxis, localTarget).normalize();


	var flatNormal = new THREE.Vector3().copy(normalPostInitialRot).projectOnPlane(rotatedAxis).normalize();

	var normToBack = new THREE.Quaternion().setFromUnitVectors(flatNormal, backVec);
	var normToBackAxisAngleV4 = new THREE.Vector4().setAxisAngleFromQuaternion(normToBack);
	var rNormalToBackPos = correctAngleSign(normToBackAxisAngleV4, rotatedAxis);

	var otherRBackPosToProjected = -(rBackPosToProjected - (-Math.PI/2.0)) + -Math.PI/2.0;

	var total1 = rNormalToBackPos + rBackPosToProjected;
	var total2 = rNormalToBackPos + otherRBackPosToProjected;

	//return [replaceWithInLimitEquivalentIfPossible(total1, rotationControl.getMin(), rotationControl.getMax()),
	//	replaceWithInLimitEquivalentIfPossible(total2, rotationControl.getMin(), rotationControl.getMax())];
	return [total1, total2];

};

export default PointADOF;


