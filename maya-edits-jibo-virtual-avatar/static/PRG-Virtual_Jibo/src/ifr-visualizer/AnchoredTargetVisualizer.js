"use strict";

import THREE from "@jibo/three";
import GLLinePool from "./GLLinePool.js";

/**
 *
 * @param {THREE.Vector3} groundPlaneNormal
 * @constructor
 */
const AnchoredTargetVisualizer = function(groundPlaneNormal){

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._groundPlaneNormal = groundPlaneNormal;

	/**
	 * @type {?THREE.Vector3}
	 * @private
	 */
	this._target = null;

	/**
	 * @type {GLLinePool}
	 * @private
	 */
	this._linePool = null;

	/**
	 * @function
	 * @private
	 */
	this._renderCallback = null;

	/**
	 * @type {number}
	 * @private
	 */
	this._lineWidth = 1;

	/**
	 * @type {number}
	 * @private
	 */
	this._brightness = 1;

	/**
	 * @type {THREE.Color}
	 * @private
	 */
	this._baseColor = new THREE.Color(1,0,1);
};

/**
 * @param {THREE.Vector3} position
 */
AnchoredTargetVisualizer.prototype.setPosition = function(position){
	if(this._target === null && position !== null){
		this._target = new THREE.Vector3(position.x, position.y, position.z);
	}else if(position == null){
		this._target = null;
	}else{
		this._target.copy(position);
	}
};

/**
 * Install a renderer into scene that will draw this target.
 *
 * @param {BasicScene} scene
 */
AnchoredTargetVisualizer.prototype.installRendererIntoScene = function(scene){
	if(this._linePool!=null || this._renderCallback!=null){
		throw new Error("Remove VTP renderer from existing scene before installing in another!");
	}

	this._linePool = new GLLinePool(scene, 10);

	const self = this;

	this._renderCallback = function(){
		if(self._target != null) {
			const target = self._target;
			const brightness = self._brightness;
			const baseColor = self._baseColor;
			self._linePool.setLineWidth(self._lineWidth);

			const scale = 0.05;
			self._linePool.drawOnce(new THREE.Vector3().copy(target).add(new THREE.Vector3(scale, 0, 0)), new THREE.Vector3().copy(target).sub(new THREE.Vector3(scale, 0, 0)), new THREE.Color(1 * brightness, 0, 0));
			self._linePool.drawOnce(new THREE.Vector3().copy(target).add(new THREE.Vector3(0, scale, 0)), new THREE.Vector3().copy(target).sub(new THREE.Vector3(0, scale, 0)), new THREE.Color(0, 1 * brightness, 0));
			self._linePool.drawOnce(new THREE.Vector3().copy(target).add(new THREE.Vector3(0, 0, scale)), new THREE.Vector3().copy(target).sub(new THREE.Vector3(0, 0, scale)), new THREE.Color(0.2 * brightness, 0.2 * brightness, 1 * brightness));

			const groundTarget = new THREE.Vector3().copy(target).projectOnPlane(self._groundPlaneNormal);
			self._linePool.drawOnce(new THREE.Vector3().copy(groundTarget).add(new THREE.Vector3(scale, scale, 0)), new THREE.Vector3().copy(groundTarget).sub(new THREE.Vector3(scale, scale, 0)), new THREE.Color(baseColor.r * brightness, baseColor.g * brightness, baseColor.b * brightness));
			self._linePool.drawOnce(new THREE.Vector3().copy(groundTarget).add(new THREE.Vector3(scale, -scale, 0)), new THREE.Vector3().copy(groundTarget).sub(new THREE.Vector3(scale, -scale, 0)), new THREE.Color(baseColor.r * brightness, baseColor.g * brightness, baseColor.b * brightness));

			self._linePool.drawOnce(groundTarget, target, new THREE.Color(baseColor.r * brightness, baseColor.g * brightness, baseColor.b * brightness));
		}
	};

	scene.addRenderCallback(this._renderCallback);
};

/**
 * Remove the renderer from this scene.
 *
 * @param {BasicScene} scene
 */
AnchoredTargetVisualizer.prototype.removeRendererFromScene = function(scene){
	if(this._linePool != null) {
		this._linePool.removeFromScene(scene);
	}
	if(this._renderCallback!=null) {
		scene.removeRenderCallback(this._renderCallback);
	}

	this._linePool = null;
	this._renderCallback = null;
};

/**
 * @param {number} width
 */
AnchoredTargetVisualizer.prototype.setLineWidth = function(width){
	this._lineWidth = width;
};

/**
 * @param {number} brightness
 */
AnchoredTargetVisualizer.prototype.setBrightness = function(brightness){
	this._brightness = brightness;
};

/**
 * @param {THREE.Color} baseColor
 */
AnchoredTargetVisualizer.prototype.setBaseColor = function(baseColor){
	this._baseColor.set(baseColor);
};


export default AnchoredTargetVisualizer;