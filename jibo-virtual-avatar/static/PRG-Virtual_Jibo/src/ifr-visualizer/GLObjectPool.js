"use strict";

import THREE from "@jibo/three";

/**
 * @param {BasicScene} renderInScene pool will be added to this scene if provided (optional)
 * @param {[number} limitMaxObjects that can be rendered per update.  unlimited if omitted.
 * @constructor
 */
const GLObjectPool = function(renderInScene) {

	/** @type {THREE.Object3D} */
	this.rootObject = new THREE.Object3D();

	/** @type {Array.<THREE.Object3D} */
	this.tempObjects = [];

	/** @type {Array.<THREE.Object3D} */
	this.leasedObjects = [];


	this.postRenderCallbackInstalled = null;
	this.renderCallbackInstalled = null;

	/** @type {BasicScene} */
	this.addedToScene = null;

	if(renderInScene !== undefined) {
		this.addToScene(renderInScene);
	}
};

/**
 *
 * @param {BasicScene} renderInScene
 */
GLObjectPool.prototype.addToScene = function(renderInScene) {
	renderInScene.getScene().add(this.rootObject);

	//cache the callback so we can remove it.
	this.postRenderCallbackInstalled = this.postRenderCleanup.bind(this);
	this.renderCallbackInstalled = this.prepareForRender.bind(this);
	this.addedToScene = renderInScene;

	renderInScene.addPostRenderCallback(this.postRenderCallbackInstalled);
	renderInScene.addRenderCallback(this.renderCallbackInstalled);
};

/**
 * Removes this GLObjectPool from the scene it was added to.  Does nothing if
 * it has already been removed or was never added.
 */
GLObjectPool.prototype.removeFromScene = function() {
	if(this.addedToScene!=null) {
		this.addedToScene.getScene().remove(this.rootObject);
		this.addedToScene.removePostRenderCallback(this.postRenderCallbackInstalled);
		this.addedToScene.removeRenderCallback(this.renderCallbackInstalled);
		this.addedToScene = null;
		this.postRenderCallbackInstalled = null;
	}
};


/**
 *
 * @param {THREE.Object3D} object
 * @protected
 */
GLObjectPool.prototype.addToDrawOnce = function(object) {
	this.tempObjects.push(object);
	this.rootObject.add(object);
};

/**
 *
 * @param {THREE.Object3D} object
 * @protected
 */
GLObjectPool.prototype.addToLeased = function(object) {
	this.leasedObjects.push(object);
	this.rootObject.add(object);
};

/**
 *
 * @param {THREE.Object3D} object
 * @protected
 */
GLObjectPool.prototype.removeObject = function(object) {
	this.rootObject.remove(object);
};


/**
 * @param {THREE.Object3D} leasedObject
 */
GLObjectPool.prototype.returnLeased = function(leasedObject) {
	const index = this.leasedObjects.indexOf(leasedObject);
	if(index >= 0) {
		this.leasedObjects.splice(index, 1);
		this.removeObject(leasedObject);
	}else{
		console.log("Error, cannot return object that has not been leased!("+leasedObject+")");
	}
};

GLObjectPool.prototype.returnAllLeased = function() {
	for(let i = 0; i < this.leasedObjects.length; i++) {
		this.removeObject(this.leasedObjects[i]);
	}
	this.leasedObjects.length = 0;
};

GLObjectPool.prototype.prepareForRender = function() {
};

GLObjectPool.prototype.postRenderCleanup = function() {
	for(let i = 0; i < this.tempObjects.length; i++){
		this.removeObject(this.tempObjects[i]);
	}
	this.tempObjects.length = 0;
};

GLObjectPool.prototype.dispose = function(){
	this.removeFromScene();
	this.returnAllLeased();
	this.postRenderCleanup();
};



export default GLObjectPool;
