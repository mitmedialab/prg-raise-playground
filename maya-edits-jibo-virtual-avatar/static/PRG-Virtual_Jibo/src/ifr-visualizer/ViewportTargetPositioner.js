"use strict";

import THREE from "@jibo/three";
import MouseCoordinateWrangler from "./MouseCoordinateWrangler.js";
import AnchoredTargetVisualizer from "./AnchoredTargetVisualizer.js";
import SLog from "../ifr-core/SLog.js";

const channel = "UI_TARGET";


/**
 * Callback to receive 3D position updates
 *
 * @callback positionChangedCallback
 * @param {THREE.Vector3} newPosition
 * @param {string} targetName
 * @intdocs
 */


/**
 * @param {string} name - name of this positioner, reported to listeners
 * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
 * @param {THREE.Vector3} initialPosition - initial position, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} pointOnGroundPlane - any point on the ground plane, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} groundPlaneNormal - normal of the ground plane, (0,1,0) will be used if omitted
 * @constructor
 */
const ViewportTargetPositioner = function(name, camera, initialPosition, pointOnGroundPlane, groundPlaneNormal){

	/**
	 * @type {string}
	 * @private
	 */
	this._name = name;

	/**
	 * @type {THREE.PerspectiveCamera}
	 * @private
	 */
	this._camera = camera;

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._initialPosition = initialPosition;
	if(this._initialPosition == null){ //null or undefined (eqnull)
		this._initialPosition = new THREE.Vector3(0,0,0);
	}

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._pointOnGroundPlane = pointOnGroundPlane;
	if(this._pointOnGroundPlane == null){ //null or undefined (eqnull)
		this._pointOnGroundPlane = new THREE.Vector3(0,0,0);
	}

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._groundPlaneNormal = groundPlaneNormal;
	if(this._groundPlaneNormal == null){ //null or undefined (eqnull)
		this._groundPlaneNormal = new THREE.Vector3(0,1,0);
	}

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._lastPosition = new THREE.Vector3().copy(this._initialPosition);

	/**
	 * @type {positionChangedCallback[]}
	 * @private
	 */
	this._positionChangedListeners = [];

	/**
	 * @type {AnchoredTargetVisualizer}
	 * @private
	 */
	this._anchoredTargetVis = new AnchoredTargetVisualizer(this._groundPlaneNormal);

	if(this._lastPosition != null){
		this._anchoredTargetVis.setPosition(this._lastPosition);
	}
};

/**
 * Move this positioner to the point represented by this NDC screen plane point, by either
 * moving the current target to be above the ground plane point clicked (if groundPlane is true),
 * or by moving the current target to the point clicked on the plane defined by camera's forward vector
 * and the current target (if groundPlane is false).
 *
 * @param {number} viewportNDCPointX - NDC (-1 to 1) X val on screen plane
 * @param {number} viewportNDCPointY - NDC (-1 to 1) Y val on screen plane
 * @param {boolean} groundPlane - treat as ground-plane point if true, treat as vertical plane if false
 */
ViewportTargetPositioner.prototype.moveToNDCPoint = function(viewportNDCPointX, viewportNDCPointY, groundPlane){
	let p;
	if(groundPlane) {
		const groundPoint = MouseCoordinateWrangler.unprojectScreenToPlane(viewportNDCPointX, viewportNDCPointY, this._camera, this._pointOnGroundPlane, this._groundPlaneNormal);
		if(groundPoint!=null){ //null or undefined (eqnull)
			p = new THREE.Vector3().copy(this._lastPosition).projectOnVector(this._groundPlaneNormal).add(groundPoint);
		}else{
			SLog(channel, "ViewportTargetPositioner: ground point not computed, not moving target point");
		}
	}else{
		//find where camera is pointing:
		const pLocal = new THREE.Vector3( 0, 0, -1 );
		const pWorld = pLocal.applyMatrix4(this._camera.matrixWorld);
		const cameraDirection = pWorld.sub(this._camera.position);
		cameraDirection.projectOnPlane(this._groundPlaneNormal);
		const pointOnCameraPlane = this._lastPosition;

		if(cameraDirection.lengthSq() < 0.001){
			SLog(channel, "ViewportTargetPositioner: degenerate angle, not moving target point");
			p = undefined;
		}else {
			cameraDirection.normalize();
			p = MouseCoordinateWrangler.unprojectScreenToPlane(viewportNDCPointX, viewportNDCPointY, this._camera, pointOnCameraPlane, cameraDirection);
		}
	}
	if (p !== undefined) {
		this._lastPosition.copy(p);
		this._notifyPositionChangedCallbacks(p);
	}
	this._anchoredTargetVis.setPosition(this._lastPosition);
};


/**
 * Install a renderer into scene that will draw this mouse target.
 *
 * @param {BasicScene} scene
 */
ViewportTargetPositioner.prototype.installRendererIntoScene = function(scene){
	this._anchoredTargetVis.installRendererIntoScene(scene);
};

/**
 * Remove the renderer from this scene.
 *
 * @param {BasicScene} scene
 */
ViewportTargetPositioner.prototype.removeRendererFromScene = function(scene){
	this._anchoredTargetVis.removeRendererFromScene(scene);
};



/**
 * @param {THREE.Vector3} inplaceVec3
 * @return {THREE.Vector3}
 */
ViewportTargetPositioner.prototype.getPosition = function(inplaceVec3) {
	if(inplaceVec3 == null){ //null or undefined (eqnull)
		inplaceVec3 = new THREE.Vector3();
	}
	inplaceVec3.copy(this._lastPosition);
	return inplaceVec3;
};

/**
 * @param {positionChangedCallback} cb
 */
ViewportTargetPositioner.prototype.addPositionChangedCallback = function(cb){
	const cbIndex = this._positionChangedListeners.indexOf(cb);
	if(cbIndex < 0) {
		this._positionChangedListeners.push(cb);
	}
};

/**
 * @param {positionChangedCallback} cb
 */
ViewportTargetPositioner.prototype.removePositionChangedCallback = function(cb){
	const cbIndex = this._positionChangedListeners.indexOf(cb);
	if (cbIndex > -1) {
		this._positionChangedListeners.splice(cbIndex, 1);
	}
};

/**
 * @param {THREE.Vector3} position
 * @private
 */
ViewportTargetPositioner.prototype._notifyPositionChangedCallbacks = function(position){
	for (let i=0; i<this._positionChangedListeners.length; i++){
		this._positionChangedListeners[i](position, this._name);
	}
};

/**
 * Renders more prominently if highlighted.  Defaults to true.
 * @param {boolean} highlighted
 */
ViewportTargetPositioner.prototype.setHighlighted = function(highlighted){
	if(highlighted){
		this._anchoredTargetVis.setLineWidth(2);
		this._anchoredTargetVis.setBrightness(1);
	}else{
		this._anchoredTargetVis.setLineWidth(0.5);
		this._anchoredTargetVis.setBrightness(0.5);
	}
};

/**
 * @returns {string}
 */
ViewportTargetPositioner.prototype.getName = function(){
	return this._name;
};

export default ViewportTargetPositioner;
