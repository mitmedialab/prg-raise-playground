"use strict";

import THREE from "@jibo/three";
import ExtraMath from "../../ifr-geometry/ExtraMath.js";
import ConeMath from "./ConeMath.js";
import CyclicMath from "../base/CyclicMath.js";

//TODO: consolidate with LookatDOF

/**
 * Enum Values for look solution policy when multiple solutions are possible.
 * @enum {string}
 */
const SOLUTION_POLICY = {
	/**
	 * Don't modify solution, arbitrary polarity
	 */
	NATURAL: "NATURAL",
	/**
	 * Closest solution
	 */
	CLOSEST: "CLOSEST",
	/**
	 * Farthest solution (farthest from "current" when no lastProduced, then closest to lastProduced when provided)
	 */
	FARTHEST: "FARTHEST"
};


/**
 * @type {GLKinematicVis}
 */
let visHelper = null;

/**
 *
 * @param {string} name - my name
 * @param {string} orientDOFName  - name of the orientDOF.  ancestor of tiltDOF, will be used to point correct part of oriented plane towards target
 * @param {string} tiltDOFName - name of tiltDOF.  descendant of orientDOF, ancestor of swivelDOF.  will be used to tilt the plane to correct angle for target w.r.t. orientAxis
 * @param {string} swivelDOFName - name of swivelDOF.  descendant of tiltDOF.  swivelAxis defines the plane we are manipulating.
 * @param {number} orientDOFValueMinForward - the value of orientDOF when the system is in the "min" position facing forwards (swivelAxis max far from orientAxis in the forward direction)
 * @param {number} tiltDOFValueMinForward - the value of tiltDOF when the system is in the "min" position facing forwards (swivelAxis max far from orientAxis in the forward direction)
 * @param {number} heightAbovePlane - height to view plane
 * @param {number} angleAbovePlane - angle of view plane above plane
 * @param {boolean} forbidTilt - don't produce any poses with tilt (none from middle zone)
 * @param {SOLUTION_POLICY} solutionPolicy - choose a policy to resolve multiple solutions
 * @param {number} rigidSwingArmFactor - null/undefined to use classical strategy. 0-1 to use rigid-swing-arm strategy, value controls length of arm (1 = full length) (see computeNeckPlaneAngle)
 * @constructor
 */
const PlaneAlignmentWithRollLookatDOF = function (name,
												orientDOFName, tiltDOFName, swivelDOFName,
												orientDOFValueMinForward, tiltDOFValueMinForward,
												heightAbovePlane, angleAbovePlane, forbidTilt,
												solutionPolicy, rigidSwingArmFactor) {

	/**
	 * @type {string}
	 * @private
	 */
	this._name = name;

	/**
	 * @type {string}
	 * @private
	 */
	this._orientDOFName = orientDOFName;

	/**
	 * @type {string}
	 * @private
	 */

	this._tiltDOFName = tiltDOFName;

	/**
	 * @type {string}
	 * @private
	 */
	this._swivelDOFName = swivelDOFName;

	/**
	 * @type {number}
	 * @private
	 */
	this._orientDOFValueMinForward = orientDOFValueMinForward;

	/**
	 * Max is opposite of Min in this geometry
	 * @type {number}
	 * @private
	 */
	this._orientDOFValueMaxForward = orientDOFValueMinForward + Math.PI;

	/**
	 * @type {number}
	 * @private
	 */
	this._tiltDOFValueMinForward = tiltDOFValueMinForward;

	/**
	 * Max is opposite of Min in this geometry
	 * @type {number}
	 * @private
	 */
	this._tiltDOFValueMaxForward = tiltDOFValueMinForward + Math.PI;

	/**
	 * Direction of rotation following an upwards moving target in zone C1 (lower range cone-zone) (1 for RHR around vertical)
	 * @type {number}
	 * @private
	 */
	this._directionZoneC1 = 1;

	/**
	 * Direction of rotation following an upwards moving target in zone C2 (upper range cone-zone) (1 for RHR around vertical)
	 * @type {number}
	 * @private
	 */
	this._directionZoneC2 = 1;

	/**
	 * Direction of rotation following an upwards moving target in zone M (mid range between the cone-zones) (1 for RHR around vertical)
	 * @type {number}
	 * @private
	 */
	this._directionZoneM = 1;

	/**
	 * @type {ConeMath}
	 * @private
	 */
	this._coneMath = new ConeMath();

	/**
	 * @type {KinematicGroup}
	 * @private
	 */
	this._kinematicGroup = null;


	/**
	 * @type {THREE.Object3D}
	 * @private
	 */
	this._orientTransform = null;

	/**
	 * @type {THREE.Object3D}
	 * @private
	 */

	this._tiltTransform = null;
	/**
	 * @type {THREE.Object3D}
	 * @private
	 */
	this._swivelTransform = null;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._orientAxisLocal = null;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._tiltAxisLocal = null;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._swivelAxisLocal = null;


	/**
	 * @type {number}
	 * @private
	 */
	this._tiltConeAngle = 0;

	/**
	 * Pivot in the center of head; direction from this pivot to target gives a vertical
	 * angle for face, discounting translation
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._headCenterPivot = null;

	/**
	 * Pivot in neck area; used to compute better vertical angle than headCenterPivot,
	 * treats face plane as if rigidly connected to this pivot, translation partially
	 * accounted for.
	 *
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._neckCenterPivot = null;

	/**
	 * @type {number}
	 * @private
	 */
	this._orientAxisToTiltAxisAngle = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this._zone1Min = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this._zone1Max = 0;


	/**
	 * @type {number}
	 * @private
	 */
	this._angleAbovePlane = angleAbovePlane;

	/**
	 * @type {number}
	 * @private
	 */
	this._heightAbovePlane = heightAbovePlane;


	/**
	 * true to disallow zone with tilt
	 * @type {boolean}
	 * @private
	 */
	this._forbidTilt = false;

	if(forbidTilt != null){
		this._forbidTilt = forbidTilt;
	}

	this._rigidSwingArmFactor = rigidSwingArmFactor;
	if(this._rigidSwingArmFactor === undefined){
		this._rigidSwingArmFactor = null;
	}


	this._solutionPolicy = SOLUTION_POLICY.NATURAL;

	if(solutionPolicy != null){
		this._solutionPolicy = solutionPolicy;
	}



	/**
	 * percent of tilt zone to use as hysteresis area
	 * 1 means don't swap to new position until you're entirely through the zone
	 * 0 means use whichever solution is closer always
	 * @type {number}
	 * @private
	 */
	this._forbibTiltHysteresis = 0.5;

	//need:
	//base rot (z), targetNormal
	//torsoConeAngle
	//coneDelta, comes from baseRot, torsoConeAngle
	//min/max targetCone zone (comes from coneDelta and torsoConeAngle

	//baseRotCorrespondingToMin (e.g., the dof position of the base dof when headRot is maximally pushed away from baseRot)
	//torsoRotCorrespondingToMin (e.g., the dof position of the torso dof when the headRot is maximally pushed away from baseRot)
};

PlaneAlignmentWithRollLookatDOF.SOLUTION_POLICY = SOLUTION_POLICY;

/**
 * Static installation of visHelper to enable kinematic vis for debugging
 * @param {GLKinematicVis} useVisHelper
 */
PlaneAlignmentWithRollLookatDOF.setVisHelper = function(useVisHelper){
	visHelper = useVisHelper;
};

/**
 * @param {KinematicGroup} kinematicGroup group to use for kinematic math (assumed to be configured as desired before valToPointAtTarget calls)
 */
PlaneAlignmentWithRollLookatDOF.prototype.connectToGroup = function(kinematicGroup){
	this._kinematicGroup = kinematicGroup;
	if(this._kinematicGroup) {

		var modelControlGroup = kinematicGroup.getModelControlGroup();

		var orientControl = modelControlGroup.getControlForDOF(this._orientDOFName);
		var tiltControl = modelControlGroup.getControlForDOF(this._tiltDOFName);
		var swivelControl = modelControlGroup.getControlForDOF(this._swivelDOFName);

		this._orientTransform = kinematicGroup.getTransform(orientControl.getTransformName());
		this._tiltTransform = kinematicGroup.getTransform(tiltControl.getTransformName());
		this._swivelTransform = kinematicGroup.getTransform(swivelControl.getTransformName());

		kinematicGroup.updateWorldCoordinateFrames();

		this._orientAxisLocal = orientControl.getRotationalAxis(null);
		this._tiltAxisLocal = tiltControl.getRotationalAxis(null);
		this._swivelAxisLocal = swivelControl.getRotationalAxis(null);

		this._orientAxisGlobal = ExtraMath.convertDirectionLocalToWorld(this._orientTransform, this._orientAxisLocal, null);
		var tiltAxisGlobal = ExtraMath.convertDirectionLocalToWorld(this._tiltTransform, this._tiltAxisLocal, null);
		var swivelAxisGlobal = ExtraMath.convertDirectionLocalToWorld(this._swivelTransform, this._swivelAxisLocal, null);


		this._tiltConeAngle = tiltAxisGlobal.angleTo(swivelAxisGlobal);

		this._neckCenterPivot = this._orientTransform.localToWorld(new THREE.Vector3());
		this._neckCenterPivot.projectOnVector(this._orientAxisGlobal);
		this._headCenterPivot = this._neckCenterPivot.clone();

		//move _neckCenterPivot according to our _rigidSwingArmFactor; at 1, we have the full arm, at 0 we have no arm (e.g., pivot is in head)
		this._neckCenterPivot.add(this._orientAxisGlobal.clone().setLength((1-this._rigidSwingArmFactor)*this._heightAbovePlane));

		//TODO: doing this in global space because I know we aren't moving these
		if (this._heightAbovePlane !== 0) {
			this._headCenterPivot = this._orientAxisGlobal.clone().setLength(this._heightAbovePlane).add(this._headCenterPivot);

			//var transVec = new THREE.Vector3().copy(rotatedAxis);
			//transVec.multiplyScalar(distanceAlongDOFAxisToPlane / transVec.length());
			//localTarget.sub(transVec);
		}

		this._orientAxisToTiltAxisAngle = tiltAxisGlobal.angleTo(this._orientAxisGlobal);

		this._zone1Min = Math.abs(this._orientAxisToTiltAxisAngle - this._tiltConeAngle);
		this._zone1Max = this._orientAxisToTiltAxisAngle + this._tiltConeAngle;
	}else{
		this._orientTransform = null;
		this._tiltTransform = null;
		this._swivelTransform = null;

		this._orientAxisLocal = null;
		this._tiltAxisLocal = null;
		this._swivelAxisLocal = null;

		this._orientAxisGlobal = null;

		this._tiltConeAngle = 0;

		this._headCenterPivot = null;
		this._neckCenterPivot = null;

		this._orientAxisToTiltAxisAngle = 0;

		this._zone1Min = 0;
		this._zone1Max = 0;
	}
};

/**
 * Compute the angle to the neck plane from orientAxisGlobal to point face at the right height for target.
 *
 * This is an approximation to avoid any need to iterate; desired angle is computed as if the face-plane is
 * connected rigidly to a 360 pivot located at orientTransform; that motion does not have exactly the same translation
 * as the face plane, but it is closer than leaving it in place translation-wise.
 *
 * @param {THREE.Vector3} target
 * @return {number} angle from orientAxisGlobal to the neck-plane that would cause the face to point at the target
 */
PlaneAlignmentWithRollLookatDOF.prototype.computeNeckPlaneAngle = function(target) {
	var usePivot = this._neckCenterPivot;

	var pivotToTarget = target.clone().sub(usePivot);

	var pivotToFaceRayOrigin = this._heightAbovePlane * this._rigidSwingArmFactor;
	var insideAnglePlaneNormalFaceRay = this._angleAbovePlane + Math.PI/2.0; // we want interior angle from vertical, not from horizontal
	var distanceToTarget = pivotToTarget.length();

	var epsilon = 0.0000001;

	//Computation of certain solutions are technically impossible (target too close, inside the swing of the
	// swing-arm), but, we can produce answers that look ok and are continuous at the boundary with the
	// technically correct answers.  A 1 here means no inexact answers, and a zero would mean always
	// try to approximate.
	var extendedAnswersInsideSwingAreaRatio = 0.33;

	//this is now an ASS triangle.  points(interior_angle,opposite_side): neckPivot(A,a), faceRayOrigin(center head)(B,b), target(C,c)
	// we assume that B is obtuse (otherwise we'd need to account for the possibility of 2 solutions)
	//  b/sin(B) = c/sin(C)            //law of sines
	//  C = asin(c*sin(B)/b)           //isolate
	//  a = PI - asin(c*sin(B)/b) - B  //PIr in a triangle

	var approx = false;
	var a;

	if(distanceToTarget > pivotToFaceRayOrigin + epsilon){
		//regular computation
		var angleC = Math.asin( pivotToFaceRayOrigin * Math.sin(insideAnglePlaneNormalFaceRay) / distanceToTarget );
		a = Math.PI - angleC - insideAnglePlaneNormalFaceRay;
	}else if(distanceToTarget > pivotToFaceRayOrigin * extendedAnswersInsideSwingAreaRatio){
		//we'll allow answers in this range; they can't actually point the effector at the target,
		//setting a to zero should be continuous with the real solutions at the boundary,
		//and will result in answers in the approximately expected area.
		a = 0;
		approx = true;
	}else{
		//too close, inside the "swing" of the head, cannot compute.
		return Number.NaN;
	}

	//a is the inside angle of the triangle, but we want the angle from vertical.
	//this will be the "angle from vertical to the target" - a;

	var localTargetToVertical = pivotToTarget.angleTo(this._orientAxisGlobal);


	if (visHelper !== null && visHelper.shouldDraw(this)) {

		var color = new THREE.Color(approx?0.7:0, 0, approx?0:0.7);
		visHelper.drawLineWorld(this, "NeckPlaneTriangle:Target", usePivot, target, color);
		var usingHeadCenter = pivotToTarget.clone().setLength(pivotToFaceRayOrigin);
		var rotAxis = pivotToTarget.clone().cross(this._orientAxisGlobal).normalize();
		usingHeadCenter.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(rotAxis, a));
		usingHeadCenter.add(usePivot);
		visHelper.drawLineWorld(this, "NeckPlaneTriangle:Vert", usePivot, usingHeadCenter, color);
		visHelper.drawLineWorld(this, "NeckPlaneTriangle:Face", usingHeadCenter, target, color);
	}

	return localTargetToVertical - a;
};

/**
 * Convert world space target to "local" target in neck space, pre-adjusted to account for face distance above the neck plane
 * and face angle.  (e.g., neck plane should try to intersect the returned local)
 *
 * @param target
 * @param result
 * @returns {*}
 */
PlaneAlignmentWithRollLookatDOF.prototype.convertToLocal = function(target, result) {
	//TODO: doing this in global space because I know we aren't moving these


	//we need: pivot point center of neck plane
	//height from center neck to center head
	//angle between vertical and face normal

	var usePivot = this._headCenterPivot;

	if(result === null){
		result = new THREE.Vector3();
	}
	result.copy(target);

	result.sub(usePivot);


	//move localTarget to account for cone angle above plane
	if (this._angleAbovePlane !== 0) {
		var bendForPlaneModAxis = new THREE.Vector3().crossVectors(this._orientAxisGlobal, result).normalize();
		//applyAxisAngle REQUIRES normalize axis!!
		result.applyAxisAngle(bendForPlaneModAxis, this._angleAbovePlane);
	}

	if (visHelper !== null && visHelper.shouldDraw(this)) {
		visHelper.drawRayWorld(this, "TargetPlane:Normal", usePivot, this._orientAxisGlobal, new THREE.Color(1, 1, 1));
		visHelper.drawConeWorld(this, "TargetPlane:Surface", usePivot, this._orientAxisGlobal, this._angleAbovePlane, new THREE.Color(1, 0, 1));
	}

	return result;
};


/**
 * returns true if the first orient/tilt are closer to Pose than the second
 * @param {Pose} pose
 * @param {number} orient1
 * @param {number} tilt1
 * @param {number} orient2
 * @param {number} tilt2
 * @param {number} rotValue
 * @return {boolean}
 */
PlaneAlignmentWithRollLookatDOF.prototype.firstOrientTiltAreCloser = function(pose, orient1, tilt1, orient2, tilt2, rotValue) {
	var curOrient = pose.get(this._orientDOFName, 0) - rotValue;
	var curTilt = pose.get(this._tiltDOFName, 0);
	var d1 = Math.abs(curOrient - CyclicMath.closestEquivalentRotation(orient1, curOrient)) + Math.abs(curTilt - CyclicMath.closestEquivalentRotation(tilt1, curTilt));
	var d2 = Math.abs(curOrient - CyclicMath.closestEquivalentRotation(orient2, curOrient)) + Math.abs(curTilt - CyclicMath.closestEquivalentRotation(tilt2, curTilt));
	return d1 <= d2;
};

/**
 * given 1 correct solution for orient/tilt, return the solution (1 of the 2 possible) that matches the policy and situation
 *
 * @param {Pose} currentPose
 * @param {Pose} lastProduced - the last pose we computed, or null if this is to be computed as a new series
 * @param {number} orient
 * @param {number} tilt
 * @param {number} rotValue
 * @returns {number[]}
 */
PlaneAlignmentWithRollLookatDOF.prototype.resolveMultiple = function(currentPose, lastProduced, orient, tilt, rotValue) {
	var asIs;
	if(this._solutionPolicy === SOLUTION_POLICY.NATURAL){
		asIs = true;
	}else if (this._solutionPolicy === SOLUTION_POLICY.CLOSEST){
		asIs = this.firstOrientTiltAreCloser(currentPose, orient, tilt, -orient, -tilt, rotValue);
	}else if (this._solutionPolicy === SOLUTION_POLICY.FARTHEST){
		if(lastProduced){
			//we want to stay closest to lastProduced, we are in steady state follow/continue
			asIs = this.firstOrientTiltAreCloser(lastProduced, orient, tilt, -orient, -tilt, rotValue);
		}else{
			//we want to go farthest from currentPose, we are in the init state
			asIs = !this.firstOrientTiltAreCloser(currentPose, orient, tilt, -orient, -tilt, rotValue);
		}
	}
	if(asIs){
		return [orient, tilt];
	}else{
		return [-orient, -tilt];
	}
};


/**
 *
 * @param {THREE.Vector3} target
 * @param pointReport
 * @param {Pose} currentPose
 * @param {number} rotValue - used to help with hysteresis
 * @param {Pose} lastProduced - the last pose we (the whole node, including rotValue) computed, or null if this is to be computed as the start of a new series
 * @returns {number[]}
 */
PlaneAlignmentWithRollLookatDOF.prototype.valsToPointAtTarget = function(target, pointReport, currentPose, rotValue, lastProduced){ // eslint-disable-line no-unused-vars
	if(this._orientAxisGlobal === null){ //just checking an arbitrary field to check if we're connected
		console.log("PlaneAlignmentWithRollLookatDOF being used but not connected to a hierarchy!");
		return null;
	}

	var targetPerpConeAngle;

	if(this._rigidSwingArmFactor !== null){
		targetPerpConeAngle = this.computeNeckPlaneAngle(target);
	}else{
		var pivotToTarget = this.convertToLocal(target, null);

		//want angle between plane normal and target normal, should be == angle - 90 for this case
		//e.g., angle from (the up-facing normal perpendicular to the target vec) to (0,0,1)

		targetPerpConeAngle = pivotToTarget.angleTo(this._orientAxisGlobal) - Math.PI/2;
	}

	if(!Number.isFinite(targetPerpConeAngle)){
		//didn't get a real angle, we have no solution
		return null;
	}

	var useTilt=NaN, useOrient=NaN, dirs;

	var epsilon = 0.0000001;

	//select the correct zone.
	//zoneC1 - using roll control in the "min" zone
	//zoneC2 - using roll control in the "max" zone
	//zoneM - cannot do roll control, using min roll
	////pastMin - we're past the minimum achievable, use min achievable
	////pastMax - we're past the maximum achievable, use max achievable
	if(targetPerpConeAngle > this._zone1Max - epsilon){ //pastMin including extra Epsilon

		useTilt = this._tiltDOFValueMinForward;
		useOrient = this._orientDOFValueMinForward;

	}else if(targetPerpConeAngle < -this._zone1Max + epsilon){ //pastMax including extra Epsilon

		useTilt = this._tiltDOFValueMinForward; //max system value has min here since it's a local value, and we flipping the whole system
		useOrient = this._orientDOFValueMaxForward;

	}else if(targetPerpConeAngle <= this._zone1Min + epsilon && targetPerpConeAngle >= -this._zone1Min - epsilon){ //zoneM with extra Epsilon

		var gotRot;

		if(this._forbidTilt){
			//we only want fully level-head. BUT we must choose which end to be at
			var hysteresisLow = -this._zone1Min * this._forbibTiltHysteresis;
			var hysteresisHigh = this._zone1Min * this._forbibTiltHysteresis;
			if(targetPerpConeAngle >= hysteresisHigh){
				gotRot = 0;
			}else if(targetPerpConeAngle <= hysteresisLow){
				gotRot = Math.PI;
			}else{
				//we're in the hysteresis zone!  choose the one closes to current based on tilt dof
				//subtract off rotValue to get our current orientDOF value
				var curOrientDOFVal = currentPose.get(this._orientDOFName, 0) - rotValue;
				//useOrient orient to be originating gotRot (invert useOrient computation below):
				var generatingGotRot = (curOrientDOFVal - this._orientDOFValueMaxForward)/this._directionZoneM;
				//now just choose the gotRot that is closest to current
				if(Math.abs(CyclicMath.closestEquivalentRotation(generatingGotRot, 0)) < Math.PI/2){
					gotRot = 0;
				}else{
					gotRot = Math.PI;
				}
			}
		}else {

			if (targetPerpConeAngle >= this._zone1Min - epsilon) { //at border with C1
				gotRot = 0;
			} else if (targetPerpConeAngle <= -this._zone1Min + epsilon) { //at border with C2
				gotRot = Math.PI;
			} else {

				var targetDirectConeAngle = targetPerpConeAngle + Math.PI / 2; //cone with normal at 0,0,1, cone-bits pointing to target

				//var gotRot = rotationFromMinPlaneDirToIntersector(tca, Math.abs(coneDelta - torsoConeAngle));
				gotRot = this._coneMath.rotationFromMinPlaneDirToIntersector(targetDirectConeAngle, Math.abs(this._orientAxisToTiltAxisAngle - this._tiltConeAngle));

			}
		}

		//0 should mean point using the low end of the min plane config
		//if we're ever here, we're an undercut cone situation, so min portion of max-neutral plane will be at orient-max, tilt-min
		useOrient = this._directionZoneM*gotRot + this._orientDOFValueMaxForward;
		useTilt = this._tiltDOFValueMaxForward; //max misalignment with min plane for most neutral plane

	}else if(targetPerpConeAngle > this._zone1Min && targetPerpConeAngle < this._zone1Max){ //zoneC1 (missing epsilon zones)

		dirs = this._coneMath.coneIntersectionAsDualRotations(this._orientAxisToTiltAxisAngle, targetPerpConeAngle, this._tiltConeAngle);

		useTilt = this._tiltDOFValueMinForward - this._directionZoneC1 * dirs[1];
		useOrient = this._orientDOFValueMinForward + this._directionZoneC1 * dirs[0];

	}else if(targetPerpConeAngle < -this._zone1Min && targetPerpConeAngle > -this._zone1Max){ //zoneC2 (missing epsilon zone)

		dirs = this._coneMath.coneIntersectionAsDualRotations(this._orientAxisToTiltAxisAngle, -targetPerpConeAngle, this._tiltConeAngle);

		useTilt = this._tiltDOFValueMinForward + this._directionZoneC2 * dirs[1];
		useOrient = this._orientDOFValueMaxForward - this._directionZoneC2 * dirs[0];

	}

	if(visHelper !== null && visHelper.shouldDraw(this)){
		//var p = currentPose.getCopy("temp");
		//p.set(this._orientDOFName, useOrient, 0);
		//p.set(this._tiltDOFName, useTilt, 0);
		//this._kinematicGroup.setFromPose(p);
		//this._kinematicGroup.updateWorldCoordinateFrames();

		visHelper.drawConeLocal(this, "HeadRotAxisSweep", this._tiltTransform, null, this._tiltAxisLocal, Math.PI/2-this._tiltConeAngle, new THREE.Color(0.7,1,0.7));
		visHelper.drawRayLocal(this, "TorsoRot", this._tiltTransform, null, this._tiltAxisLocal, new THREE.Color(0,0.5,0), 0.5);

		var swivelOriginLocal = this._swivelTransform.position.clone();

		visHelper.drawConeLocal(this, "HeadRotAxisSweepAtHead", this._tiltTransform, swivelOriginLocal, this._tiltAxisLocal, Math.PI/2-this._tiltConeAngle, new THREE.Color(0.7,1,0.7));
		visHelper.drawRayLocal(this, "TorsoRotAtHead", this._tiltTransform, swivelOriginLocal, this._tiltAxisLocal, new THREE.Color(0,0,0), 0.3);

		visHelper.drawRayLocal(this, "HeadRot", this._swivelTransform, null, this._swivelAxisLocal, new THREE.Color(0,0,0.5), 0.5);
		visHelper.drawConeLocal(this, "TargetablePlane", this._swivelTransform, null, this._swivelAxisLocal, 0, new THREE.Color(1,0.7,0.7));
		var topWP = this._swivelTransform.getWorldPosition();
		visHelper.drawConeWorld(this, "TargetNormalCone", topWP, this._orientAxisGlobal, Math.PI/2-targetPerpConeAngle, new THREE.Color(1,0.7,0.7));
	}

	if(Number.isNaN(useOrient) || Number.isNaN(useTilt)){
		return null;
	}else{
		return this.resolveMultiple(currentPose, lastProduced, useOrient, useTilt, rotValue);
	}
};

/**
 *
 * @returns {string}
 */
PlaneAlignmentWithRollLookatDOF.prototype.getName = function(){
	return this._name;
};

/**
 *
 * @returns {string[]}
 */
PlaneAlignmentWithRollLookatDOF.prototype.getControlledDOFNames = function(){
	return [this._orientDOFName, this._tiltDOFName];
};

/**
 *
 * @returns {string[]}
 */
PlaneAlignmentWithRollLookatDOF.prototype.getDOFsNeededInKG = function(){
	return [this._orientDOFName, this._tiltDOFName, this._swivelDOFName];
};


export default PlaneAlignmentWithRollLookatDOF;
