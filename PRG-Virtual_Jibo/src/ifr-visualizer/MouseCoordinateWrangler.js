"use strict";

import THREE from "@jibo/three";
import SLog from "../ifr-core/SLog.js";

const channel = "MOUSE_COORD_WRANGLER";

const MouseCoordinateWrangler = {};

/**
 * Get the offset rect of an element on the page. Rect will be relative to page top left, scroll-invariant
 * @param {Element} elem
 * @returns {{top: number, left: number, width: number, height: number}} rect of elem on entire page in pixels, from top-left, scroll-invariant
 */
MouseCoordinateWrangler.getOffsetRect = function (elem) {
	const box = elem.getBoundingClientRect();
	const body = document.body;
	const docElem = document.documentElement;

	const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

	const clientTop = docElem.clientTop || body.clientTop || 0;
	const clientLeft = docElem.clientLeft || body.clientLeft || 0;

	const top  = box.top +  scrollTop - clientTop;
	const left = box.left + scrollLeft - clientLeft;
	return { top: Math.round(top), left: Math.round(left), width: Math.round(box.width), height:Math.round(box.height)};
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {THREE.Camera} camera
 * @returns {{x:number, y:number}} ndc 2D (-1 to 1) location for this 3d location
 */
MouseCoordinateWrangler.projectToScreenNDC = function(x,y,z,camera){
	const projected = new THREE.Vector3(x,y,z).project(camera);
	return {x:projected.x, y:projected.y};
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {THREE.Camera} camera
 * @param {Element} container
 * @param {boolean} [dropOutOfBounds] = false
 * @returns {?{x:number, y:number}} pixel location for this 3d location
 */
MouseCoordinateWrangler.projectToScreenPixels = function(x,y,z,camera,container,dropOutOfBounds){
	const projected = new THREE.Vector3(x,y,z).project(camera);
	if(projected.z < 0 || projected.z > 1){ //behind camera or past far plane
		//console.log("Clipping:"+projected.z);
		return null;
	}
	if(dropOutOfBounds===true && (Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1)){
		return null;
	}
	const rect = container.getBoundingClientRect();
	const width = rect.width;
	const height = rect.height;
	return {x:projected.x * width/2 + width/2, y:-projected.y * height/2 + height/2};
};

/**
 *
 * @param {UIEvent} event
 * @param {Element} element
 * @returns {{x: number, y: number}} pixel location of the event relative to the top left of the element
 */
MouseCoordinateWrangler.getLocalCoordinates = function(event, element){
	const bounds = MouseCoordinateWrangler.getOffsetRect(element);
	return { x: event.pageX - bounds.left, y: event.pageY - bounds.top};
};

/**
 *
 * @param {UIEvent} event
 * @param {Element} element
 * @returns {{x: number, y: number}} NDC location of the event relative to the bottom left of the element (0-1 from bottom left)
 */
MouseCoordinateWrangler.getLocalCoordinatesNDC = function(event, element){
	const bounds = MouseCoordinateWrangler.getOffsetRect(element);
	return { x: (event.pageX - bounds.left)/bounds.width, y: 1 - (event.pageY - bounds.top)/bounds.height};
};

/**
 *
 * @param {UIEvent} event
 * @param {Element} element
 * @returns {{x: number, y: number}} NDC location of the event relative to the center of the element (-1 to 1, cartesian)
 */
MouseCoordinateWrangler.getLocalCoordinatesNDCCentered = function(event, element){
	const bounds = MouseCoordinateWrangler.getOffsetRect(element);
	return { x: ((event.pageX - bounds.left)/bounds.width) * 2 - 1, y: (1 - (event.pageY - bounds.top)/bounds.height) * 2 - 1};
};

/**
 *
 * @param {number} ndcCenteredScreenX - screen location x in centered NDC (-1 to 1)
 * @param {number} ndcCenteredScreenY - screen location y in centered NDC (-1 to 1)
 * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
 * @param {THREE.Vector3} pointOnPlane - any point on the target plane, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} planeNormal - normal of the target plane, (0,1,0) will be used if omitted
 * @returns {THREE.Vector3} the point where the screen point intersects the given plane, or undefined if it doesn't intersect
 */
MouseCoordinateWrangler.unprojectScreenToPlane = function(ndcCenteredScreenX, ndcCenteredScreenY, camera, pointOnPlane, planeNormal){

	const screenVecNear = new THREE.Vector3(ndcCenteredScreenX,  ndcCenteredScreenY, 0);
	const screenVecFar = new THREE.Vector3(ndcCenteredScreenX,  ndcCenteredScreenY, 1);
	screenVecNear.unproject(camera);
	screenVecFar.unproject(camera);

	const lineDirection = screenVecFar.sub(screenVecNear);
	const lineAnchor = screenVecNear;

	lineDirection.normalize();
	const lineAnchorToPlaneAnchor = new THREE.Vector3().copy(pointOnPlane).sub(lineAnchor);
	const denominator = lineDirection.dot(planeNormal);
	if(Math.abs(denominator) < 0.0001){
		SLog(channel, "un-project error, no intersection");
		return undefined;
	}else{
		const dist = lineAnchorToPlaneAnchor.dot(planeNormal) / lineDirection.dot(planeNormal);
		if(dist < 0){
			SLog(channel, "error, intersection behind camera");
			return undefined;
		}else{
			return lineAnchor.add(lineDirection.multiplyScalar(dist));
		}
	}
};

/**
 *
 * @param {UIEvent} event - event to project the location of
 * @param {Element} element - the gl element
 * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
 * @param {THREE.Vector3} pointOnPlane - any point on the target plane, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} planeNormal - normal of the target plane, (0,1,0) will be used if omitted
 * @returns {THREE.Vector3} the point where the screen point intersects the given plane, or undefined if it doesn't intersect
 */
MouseCoordinateWrangler.unprojectEventToPlane = function(event, element, camera, pointOnPlane, planeNormal){
	const local = MouseCoordinateWrangler.getLocalCoordinatesNDCCentered(event, element);
	if(pointOnPlane === undefined){
		pointOnPlane = new THREE.Vector3(0,0,0);
	}
	if(planeNormal === undefined){
		planeNormal = new THREE.Vector3(0,1,0);
	}
	return MouseCoordinateWrangler.unprojectScreenToPlane(local.x, local.y, camera, pointOnPlane, planeNormal);
};

export default MouseCoordinateWrangler;
