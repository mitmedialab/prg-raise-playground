"use strict";

import THREE from "@jibo/three";

const ConeMath = function () {

};

/**
 * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
 * rays from that same origin.  Consider the plane on which both cone1Axis and cone2Axis lie.
 * If cone1 and cone2 intersect, both intersections will project down to the same line on that plane (or,
 * there may be a single intersection, which will already lie on the plane).  This function finds the on-plane
 * projection of the intersection(s) between the cones.  It describes that intersection by the angle from cone1Axis
 * to that intersection ray projection, with positive angles moving in the direction towards cone1Axis.
 *
 * Behavior not defined if there is no solution or infinite solutions (equal plane axes and angles).
 *
 * @param {number} angleBetweenCones - the angle between the cone axes (positive number)
 * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
 * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
 * @returns {number} the angle from cone1 axis to the projection of the intersection of the cones (positive angles in the direction of cone2 axis)
 */
ConeMath.prototype.flatConeIntersection = function(angleBetweenCones, cone1Angle, cone2Angle){

	//
	//  Strategy:
	//  This solution is based on the strategy of defining the height of each cone off their shared plane
	//  for every angle "a" around the plane normal starting with a=0 at plane1 axis.  When both cones
	//  have the same height above the plane at a given a, that is the intersection.
	//
	//  This yields the following equation: ( (k*cos(a))^2 - (sin(a))^2 ) ^0.5 = ( (l*cos(a-d))^2 - (sin(a-d))^2 ) ^0.5, solve for a
	//  k = ratio 1 cone grows at (relative to distance from origin), e.g. radius = k*height, or angle = atan(k)
	//  l = ratio other cone grows at
	//  d = angular distance between cone axes
	//  a = angle from cone 1 axis along plane defined by the 2 cones' normals
	//


	//this version of the solution only works for positive answer cases; swap cone1Angle to be the larger if it isn't,
	// if cone1 is the larger cone we cannot get negative answers.

	var swapped;
	var k,l;

	if(cone1Angle >= cone2Angle) {
		swapped = false;
		k = Math.tan(cone1Angle);
		l = Math.tan(cone2Angle);
	}else{
		swapped = true;
		k = Math.tan(cone2Angle);
		l = Math.tan(cone1Angle);
	}

	var d = angleBetweenCones;

	var Q = Math.cos(2*d);
	var kk = k*k;
	var ll = l*l;

	var T = 2*(-kk*ll*Q - kk*Q - ll*Q - Q + kk + ll + 1) + ll*ll + kk*kk;
	var a = Math.acos(Math.sqrt(

		(
			-(ll*ll*Q) + ll*ll + (kk*ll) - (kk*ll*Q) - (3*ll*Q) + (3*ll) + kk - (kk*Q) - (2*Q) + 2 +
			( 4*Math.pow(Math.sin(d),2)*Math.cos(d)*Math.sqrt ( (kk + 1) *Math.pow((ll + 1),3) ) )
		) /

		(2*T)
	));

	if(swapped){
		return angleBetweenCones - a;
	}else{
		return a;
	}

};


/**
 * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
 * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
 * Behavior is undefined in the 0, 1, or infinite intersection cases.
 *
 * @param {THREE.Vector3} cone1Axis - central axis of cone1, normalized, pointing the direction of increasing radius
 * @param {THREE.Vector3} cone2Axis - central axis of cone2, normalized, pointing the direction of increasing radius
 * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
 * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
 * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
 * @return {THREE.Vector3} a vector representing an intersection line of the 2 cones (will be inplaceVec if provided)
 */
ConeMath.prototype.sharedOriginConeIntersection = function(cone1Axis, cone2Axis, cone1Angle, cone2Angle, inplaceVec){
	//
	//  Strategy:
	//  Solution based on choosing a vector that has the appropriate angle to both axes; that is,
	//  a solution T would have "angleBetween T and cone1Axis = cone1Angle, angleBetween T and cone2Axis = cone2Angle".
	//  Using a dot-product strategy:
	//  	Angle between 2 vectors is normally acos( (v1 dot v2) / (|v1|*|v2|) )
	//  	Here our axes are normalized, and we'll define constants for the cosine of our target angles, so we can use a simplified:
	//  	cosMyAngle = v1 dot v2
	//
	//   x,y,z is T, intersection ray (normalized)
	//   a,b,c is cone1 axis (normalized)
	//   d,e,f is cone2 axis (normalized)
	//   v = cos(cone1Angle)
	//   w = cos(cone2Angle)
	//
	//  	//sage format
	//  	solve([x*a+y*b+z*c==v, x*d+y*e+z*f==w, x^2+y^2+z^2==1, d^2+e^2+f^1==1, a^2+b^2+c^2==1],x,y,z)
	//

	var a = cone1Axis.x;
	var b = cone1Axis.y;
	var c = cone1Axis.z;
	var d = cone2Axis.x;
	var e = cone2Axis.y;
	var f = cone2Axis.z;

	var aa = a*a;
	var bb = b*b;
	var cc = c*c;
	var dd = d*d;
	var ee = e*e;
	var ff = f*f;

	var v = Math.cos(cone1Angle);
	var w = Math.cos(cone2Angle);

	var vv = v*v;
	var ww = w*w;


	var x1 = ((c*d*f - a*ff + b*d*e - a*ee)*v + (a*c*f + a*b*e - (bb + cc)*d)*w - Math.sqrt(-2*a*b*d*e + (bb + cc)*dd + (aa + bb)*ff - (dd + ff + ee)*vv + 2*(a*d + c*f + b*e)*v*w - (aa + bb + cc)*ww + aa*ee + cc*ee - 2*(a*c*d + b*c*e)*f)*(b*f - c*e))/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);
	var y1 = -(Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*c*d - Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*a*f + (b*dd + b*ff - a*d*e - c*f*e)*v - (a*b*d + b*c*f - aa*e - cc*e)*w)/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);
	var z1 = (Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*b*d - Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*a*e - (c*dd - (a*d + b*e)*f + c*ee)*v + (a*c*d + b*c*e - (aa + bb)*f)*w)/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);

	//var x2 = ((c*d*f - a*ff + b*d*e - a*ee)*v + (a*c*f + a*b*e - (bb + cc)*d)*w + Math.sqrt(-2*a*b*d*e + (bb + cc)*dd + (aa + bb)*ff - (dd + ff + ee)*vv + 2*(a*d + c*f + b*e)*v*w - (aa + bb + cc)*ww + aa*ee + cc*ee - 2*(a*c*d + b*c*e)*f)*(b*f - c*e))/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);
	//var y2 = (Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*c*d - Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*a*f - (b*dd + b*ff - a*d*e - c*f*e)*v + (a*b*d + b*c*f - aa*e - cc*e)*w)/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);
	//var z2 = -(Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*b*d - Math.sqrt(bb*dd + cc*dd - 2*a*c*d*f + aa*ff + bb*ff - dd*vv - ff*vv + 2*a*d*v*w + 2*c*f*v*w - aa*ww - bb*ww - cc*ww - 2*a*b*d*e - 2*b*c*f*e + 2*b*v*w*e + aa*ee + cc*ee - vv*ee)*a*e + (c*dd - (a*d + b*e)*f + c*ee)*v - (a*c*d + b*c*e - (aa + bb)*f)*w)/(2*a*b*d*e - (bb + cc)*dd - (aa + bb)*ff - aa*ee - cc*ee + 2*(a*c*d + b*c*e)*f);

	if(inplaceVec!=null){
		inplaceVec.set(x1,y1,z1);
	}else{
		inplaceVec = new THREE.Vector3(x1,y1,z1);
	}
	return inplaceVec;
};

/**
 * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
 * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
 * Behavior is undefined in the 0, 1, or infinite intersection cases.
 *
 * Cone1 is defined to have axis (0,0,1), and cone2 is defined to have axis (cone2AxisX, 0, cone2AxisZ); that is, it lies on the
 * "y" plane.  Any 2 cones can be rotated to this configuration without affecting their relationship, and this configuration
 * simplifies the math significantly.  Cone2 axis must be normalized.  Axes point in the direction of increasing radius.
 *
 *
 * @param {number} cone2AxisX - X value of central axis of cone2,
 * @param {number} cone2AxisZ - Z value of central axis of cone2,
 * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
 * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
 * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
 * @return {THREE.Vector3} a vector representing an intersection line of the 2 cones (will be inplaceVec if provided)
 */
ConeMath.prototype.sharedOriginConeIntersectionSimplified = function(cone2AxisX, cone2AxisZ, cone1Angle, cone2Angle, inplaceVec){

	//strategy:
	//
	// Solution based on choosing a vector that has the appropriate angle to both axes; that is,
	// a solution T would have "angleBetween T and cone1Axis = cone1Angle, angleBetween T and cone2Axis = cone2Angle".
	// Using a dot-product strategy:
	//  	Angle between 2 vectors is normally acos( (v1 dot v2) / (|v1|*|v2|) )
	//  	Here our axes are normalized, and we'll define constants for the cosine of our target angles, so we can use a simplified:
	//  	cosMyAngle = v1 dot v2
	//
	//   x,y,z is T, intersection ray (normalized)
	//   a,b,c is cone1 axis (normalized)
	//   d,e,f is cone2 axis (normalized)
	//   v = cos(cone1Angle)
	//   w = cos(cone2Angle)
	//
	//  	//sage format
	//  	So we have
	//  	solve([x*a+y*b+z*c==v, x*d+y*e+z*f==w, x^2+y^2+z^2==1, d^2+e^2+f^1==1, a^2+b^2+c^2==1],x,y,z)
	//
	//  	However: a,b, and e = 0; c = 1; so:
	//  	 solve([z==v, x*d+z*f==w, x^2+y^2+z^2==1, d^2+f^1==1],x,y,z)
	//

	var d = cone2AxisX;
	var f = cone2AxisZ;
	var v = Math.cos(cone1Angle);
	var w = Math.cos(cone2Angle);

	var x1 = -(f*v - w)/d;
	var z1 = v;
	var y1 = Math.sqrt(1-x1*x1-z1*z1);
	//var y1 = Math.sqrt(-dd*vv - ff*vv + 2*f*v*w + dd - ww)/d;

	if(inplaceVec!=null){
		inplaceVec.set(x1,y1,z1);
	}else{
		inplaceVec = new THREE.Vector3(x1,y1,z1);
	}
	return inplaceVec;
};


/**
 * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
 * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
 * Behavior is undefined in the 0, 1, or infinite intersection cases.
 *
 * The answer is expressed as the "flat angle" of the result, e.g., the angle from cone1Axis to the projection
 * of the intersection ray on the plane defined by the two axes.  0 means the same as cone1Axis, positive
 * values move in the direction of cone2axis
 *
 *
 * @param {number} angleBetweenCones - the angle between the 2 cone axes
 * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
 * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
 * @return {number} the flat angle identifying the intersecting ray
 */
ConeMath.prototype.sharedOriginConeIntersectionAngle = function(angleBetweenCones, cone1Angle, cone2Angle){

	//strategy:
	//
	// Solution based on choosing a vector that has the appropriate angle to both axes; that is,
	// a solution T would have "angleBetween T and cone1Axis = cone1Angle, angleBetween T and cone2Axis = cone2Angle".
	// Using a dot-product strategy:
	//  	Angle between 2 vectors is normally acos( (v1 dot v2) / (|v1|*|v2|) )
	//  	Here our axes are normalized, and we'll define constants for the cosine of our target angles, so we can use a simplified:
	//  	cosMyAngle = v1 dot v2
	//
	//   imagine cone1 at 0,0,1, cone2 a rotation around Y away.
	//   x,y,z is T, intersection ray (normalized)
	//   a,b,c is cone1 axis (normalized)
	//   d,e,f is cone2 axis (normalized)
	//   v = cos(cone1Angle)
	//   w = cos(cone2Angle)
	//
	//  	//sage format
	//  	So we have
	//  	solve([x*a+y*b+z*c==v, x*d+y*e+z*f==w, x^2+y^2+z^2==1, d^2+e^2+f^1==1, a^2+b^2+c^2==1],x,y,z)
	//
	//  	However: a,b, and e = 0; c = 1; so:
	//  	 solve([z==v, x*d+z*f==w, x^2+y^2+z^2==1, d^2+f^1==1],x,y,z)
	//
	//   However, we now don't know or care about the axis, only the differences between the two.
	//	 start by
	//   d becomes sin(angleBetweenCones)
	//   f becomes cos(angleBetweenCones)
	//
	//   we won't care about y, because we're going to project or resulting vec onto the y plane to
	//   get the flat angle
	//
	//   we want the angle from cone1Axis to projected x,y,z, ie
	//   acos( ((0,0,1) dot (x,0,z)) / (|(0,0,1)| * |(x,0,z)|))
	//   so, acos( z/sqrt(x^2 + z^2) )
	//

	//var d = cone2AxisX;
	//var f = cone2AxisZ;

	var d = Math.sin(angleBetweenCones);
	var f = Math.cos(angleBetweenCones);

	var v = Math.cos(cone1Angle);
	var w = Math.cos(cone2Angle);

	var x = -(f*v - w)/d;
	var z = v;
	//var y1 = Math.sqrt(1-x1*x1-z1*z1);
	//var y1 = Math.sqrt(-dd*vv - ff*vv + 2*f*v*w + dd - ww)/d;


	var a = Math.acos(z/Math.sqrt(x*x + z*z));

	//make sign negative if (x,y,z( cross (a,b,c) is negative y
	//since we are on the y plane, and (a,b,c) is (0,0,1), can reduce this to x < 0

	if(x < 0){
		a = -a;
	}

	return a;
};


/**
 * Consider a cone viewed from the side, projected onto a plane that contains its central axis.
 * All of the rays that make up that cone are also projected onto this plane.  A single pair
 * of rays is identified by an angle on the plane from the cone axis to the projection of the
 * ray ("flatAngle").
 *
 * This function converts this "flatAngle" identification of the ray into an identification
 * of the ray as a rotation around the axis of the original, unprojected cone.  The zero point
 * for that around-axis rotation is defined to be the direction of +flatAngle.  That is, the zero-rotation
 * ray is the ray most in the flatAngle direction, and if that ray is rotated by by the value computed
 * here its projecting will be flatAngle from the cone axis
 *
 *
 * @param {number} flatAngle - the flat angle from cone-axis to target ray projected onto the plane
 * @param {number} coneAngle - angle from the cone central axis to the cone walls
 * @returns {number} the rotation around coneAxis to get to the ray identified by flatAngle
 */
ConeMath.prototype.flatAngleToConeRotation = function(flatAngle, coneAngle){
	//consider rotating a perpendicular cone radius around the cone axis at height 1
	//  cone radius at height 1 would be tan(coneAngle)/1
	//  amount visible in the projected plane would be cos(rotAngle)*tan(coneAngle)
	//  so the observed projected angle flatAngle = atan(cos(rotAngle)*tan(coneAngle))
	//
	//(we project observe the projected angle formed by rotating(t) a cone1 radius at distance 1)
	//that radius at distance 1 is tan(cone1Angle/1)
	//so, invert that to get:
	var rotAngle = Math.acos(Math.tan(flatAngle)/Math.tan(coneAngle));
	return rotAngle;
};


/**
 * Operates on 2 cones with the same origin.
 * Get the around-axis rotation for each cone that would move their canonical ray
 * into the the point of intersection of the 2 cones.  The canonical ray for both
 * cones is defined as the ray most in the + direction where + is defined as the direction
 * from cone1Axis to cone2Axis.
 *
 * @param {number} angleBetweenCones - the angle between the cone axes
 * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
 * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
 * @returns {*[]} a two element array rot the around-axis rotation required for cone1 and cone2
 */
ConeMath.prototype.coneIntersectionAsDualRotations = function(angleBetweenCones, cone1Angle, cone2Angle){
	var flatAngle = this.sharedOriginConeIntersectionAngle(angleBetweenCones, cone1Angle, cone2Angle);

	var cone1Rot = this.flatAngleToConeRotation(flatAngle, cone1Angle);
	var cone2Rot = this.flatAngleToConeRotation(flatAngle-angleBetweenCones, cone2Angle);
	return [cone1Rot, cone2Rot];
};



/**
 * Cone's origin lies on plane.  Cone has axis (0,0,1) and plane has normal
 * (planeNormalX, 0, planeNormalZ), (must be normalized).  Cone can be defined by
 * rotating a ray which is "coneAngle" from Z around the Z axis.  This function finds the ray from that
 * rotation which is perpendicular to the plane.
 *
 * In other words, this function finds the direction which is "coneAngle" from the Z axis and 0 degrees (parallel)
 * to "planeNormal".
 *
 * There are either 0, 1, 2, or infinite solutions based on the arguments; the behavior of this function is
 * defined only in the 2 solution cases, when it will return one of the two solutions.
 *
 * @param {number} coneAngle - angle from the cone central axis to the cone walls
 * @param {number} planeNormalX - x value of the plane normal
 * @param {number} planeNormalZ - y value of the plane normal
 * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
 * @return {THREE.Vector3} a vector representing an a ray on the cone perpendicular to the plane (will be inplaceVec if provided)
 */
ConeMath.prototype.sharedOriginPlaneConeIntersectionSimplified = function(coneAngle, planeNormalX, planeNormalZ, inplaceVec){

	// strategy:
	// cone normal V, angle A
	// plane normal P
	// (plane goes through origin of cone)
	//
	// intersection ray T perp to P, and has angle A to V
	// v = cos(A)
	//  T dot P = 0
	//  T dot V = v
	//
	//  T = x,y,z
	//  V = a,b,c
	//  P = d,e,f
	//
	//  (sage format)
	//  solve([x*a+y*b+z*c==v, x*d+y*e+z*f==0, x^2+y^2+z^2==1],x,y,z)
	//
	//	However: a,b, and e = 0; c = 1; so:
	// 	solve([z==v, x*d+z*f==0, x^2+y^2+z^2==1],x,y,z)


	var d = planeNormalX;
	var f = planeNormalZ;
	var v = Math.cos(coneAngle);

	var x = -f*v/d;
	var z = v;
	//var y = sqrt(-d^2*v^2 - f^2*v^2 + d^2)/d;
	var y = Math.sqrt(1-x*x-z*z);


	if(inplaceVec!=null){
		inplaceVec.set(x,y,z);
	}else{
		inplaceVec = new THREE.Vector3(x,y,z);
	}
	return inplaceVec;
};

/**
 * Cone's origin lies on plane.  Cone can be defined by rotating a ray which is "coneAngle" from Z around the
 * Z axis.  This function finds the ray from that rotation which is perpendicular to the plane.
 *
 * In other words, this function finds the direction which is "coneAngle" from the Z axis and 0 degrees (parallel)
 * to "planeNormal".
 *
 * There are either 0, 1, 2, or infinite solutions based on the arguments; the behavior of this function is
 * defined only in the 2 solution cases, when it will return one of the two solutions.
 *
 * The direction is described as a rotation from the min-vec on the plane around the plane axis.  The min-vec
 * is the direction on the plane which is defined by rotating the plane normal PI/2 degrees directly away from the cone
 * axis.  The return value will be a rotation around plane normal from min-vec to the solution direction.
 *
 * @param {number} coneAngle - angle from the cone central axis to the cone walls
 * @param {number} planeNormalOffZ - angle from coneAxis to planeNormal
 * @returns {number} rotation from plane min vec to on-plane-direction perpendicular to the cone
 */
ConeMath.prototype.rotationFromMinPlaneDirToIntersector = function(coneAngle, planeNormalOffZ){

	// strategy:
	// cone normal V, angle A
	// plane normal P
	// (plane goes through origin of cone)
	//
	// intersection ray T perp to P, and has angle A to V
	// v = cos(A)
	//  T dot P = 0
	//  T dot V = v
	//
	//  T = x,y,z
	//  V = a,b,c
	//  P = d,e,f
	//
	//  (sage format)
	//  solve([x*a+y*b+z*c==v, x*d+y*e+z*f==0, x^2+y^2+z^2==1],x,y,z)
	//
	//	However: a,b, and e = 0; c = 1; so:
	// 	solve([z==v, x*d+z*f==0, x^2+y^2+z^2==1],x,y,z)
	//

	var v = Math.cos(coneAngle);

	//plane normal
	var d = Math.sin(planeNormalOffZ);
	//var e = 0;
	var f = Math.cos(planeNormalOffZ);

	var x = -f*v/d;

	// But, we don't care about the actual xyz's, just the angle deltas, so:
	//
	//  define Q as angle of plane normal off Z (on Y plane)
	//  d becomes sin(Q)
	//  f becomes cos(Q)
	//
	//  on plane rotator (min-vec) becomes
	//  dr = sin(Q+PI/2), dr = cos(Q)
	//  fr = cos(Q+PI/2), fr = -sin(Q)
	//  we want the angle to the intersector, e.g. angle from (dr,er,fr) to (x,y,z)
	//  e.g., acos(dr*x + 0*y + fr*z) //angle between dot product method
	//  from before we have x == -f*v/d, z == v
	//  so, acos(cos(Q) * (-f*v/d) - sin(Q) * v)
	//  or, acos(cos(Q) * (-cos(Q)*v/sin(Q)) - sin(Q) * v)

	return Math.acos(f*x - d*v);
};


export default ConeMath;
