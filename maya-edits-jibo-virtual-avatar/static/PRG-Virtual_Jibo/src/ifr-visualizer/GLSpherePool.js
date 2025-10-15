"use strict";

import THREE from "@jibo/three";
import GLObjectPool from "./GLObjectPool.js";


/**
 * @param {BasicScene} renderInScene - pool will be added to this scene if provided (optional)
 * @param {number} [limitMaxObjects] - max that can be rendered per update.  unlimited if omitted.
 * @param {boolean} [cacheUnused] - true to cache the unrendered spheres, false to release them
 * @extends GLObjectPool
 * @constructor
 */
const GLSpherePool = function(renderInScene, limitMaxObjects, cacheUnused) {
	GLObjectPool.call(this, renderInScene);

	this.cacheUnused = true;
	if(cacheUnused != null){
		this.cacheUnused = cacheUnused;
	}

	/** @type {boolean} */
	this.doLimit = false;

	/** @type {number} */
	this.limit = 0;

	if(limitMaxObjects != null) {
		this.doLimit = true;
		this.limit = limitMaxObjects;
	}

	/** @type {THREE.SphereGeometry} */
	this.sphereGeometry = new THREE.SphereGeometry(1, 20, 12);

	/** @type {Array.<THREE.Mesh>} */
	this.unusedSpheres = [];

	/** @type {THREE.Color} */
	this.defaultColor = new THREE.Color(1,1,1);
};

GLSpherePool.prototype = Object.create(GLObjectPool.prototype);
GLSpherePool.prototype.constructor = GLSpherePool;

/**
 * Internal helper to provide sphere (new or from cache)
 * @param {THREE.Vector3} pos
 * @param {number} size
 * @param {THREE.Color} [color]
 * @return {THREE.Mesh}
 * @protected
 */
GLSpherePool.prototype.provideSphere = function(pos, size, color) {
	if(!this.doLimit || this.tempObjects.length + this.leasedObjects.length < this.limit){

		let c = color;
		if(color == null){
			c = this.defaultColor;
		}

		let s;
		if(this.unusedSpheres.length > 0) {
			s = this.unusedSpheres.pop();
			s.material.color.copy(c);
		}else{
			let material = new THREE.MeshLambertMaterial({color: c});
			s = new THREE.Mesh(this.sphereGeometry, material);
		}

		s.scale.set(size, size, size);
		s.position.copy(pos);

		return s;
	}else{
		return null;
	}
};

/**
 *
 * @param {THREE.Vector3} pos
 * @param {number} size
 * @param {THREE.Color} [color]
 */
GLSpherePool.prototype.drawOnce = function(pos, size, color) {
	const s = this.provideSphere(pos, size, color);
	if(s!==null){
		this.addToDrawOnce(s);
	}
};


/**
 *
 * @param {THREE.Vector3} pos
 * @param {number} size
 * @param {THREE.Color} [color]
 */
GLSpherePool.prototype.leaseSphere = function(pos, size, color) {
	const s = this.provideSphere(pos, size, color);
	if(s!==null){
		this.addToLeased(s);
	}
};


/**
 *
 * @param {THREE.Object3D} object
 * @override
 * @protected
 */
GLSpherePool.prototype.removeObject = function(object) {
	GLObjectPool.prototype.removeObject.call(this, object);
	if(this.cacheUnused){
		this.unusedSpheres.push(object);
	}else{
		object.material.dispose();
		//don't dispose the shared geometry
	}
};


GLSpherePool.prototype.dispose = function(){
	GLObjectPool.prototype.dispose.call(this); //this will move them all to unused if cacheUnused is on.

	for(let i = 0; i < this.unusedSpheres.length; i++){
		this.unusedSpheres[i].material.dispose();
	}
	this.unusedSpheres.length = 0;

	this.sphereGeometry.dispose();
	this.sphereGeometry = null;
};

export default GLSpherePool;
