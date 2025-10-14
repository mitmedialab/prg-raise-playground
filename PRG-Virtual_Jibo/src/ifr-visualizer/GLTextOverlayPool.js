"use strict";

import TextOverlayPool from "./TextOverlayPool.js";
import MouseCoordinateWrangler from "./MouseCoordinateWrangler.js";


/**
 * @param {BasicScene} renderInScene
 * @constructor
 */
const GLTextOverlayPool = function(renderInScene){
	this.textOverlay = new TextOverlayPool(renderInScene.getContainer());

	/**
	 * @type {HTMLElement}
	 */
	this.container = renderInScene.getContainer();

	/**
	 * @type {THREE.Camera}
	 */
	this.camera = renderInScene.getCamera();

	/** @type {BasicScene} */
	this.addedToScene = null;

	this.postRenderCallbackInstalled = null;

	//TODO: textOverlay doesn't support adding/removing from container, so we will attach exactly once for now
	this._addToScene(renderInScene);
};

/**
 * @param {BasicScene} renderInScene
 * @private
 */
GLTextOverlayPool.prototype._addToScene = function(renderInScene)
{
	//cache the callback so we can remove it.
	this.postRenderCallbackInstalled = this.postRenderCleanup.bind(this);
	this.addedToScene = renderInScene;

	renderInScene.addPostRenderCallback(this.postRenderCallbackInstalled);
};

/**
 * Removes this GLTextOverlayPool from the scene it was added to.  Does nothing if
 * it has already been removed or was never added.
 */
GLTextOverlayPool.prototype.removeFromScene = function()
{
	if(this.addedToScene!=null){
		this.addedToScene.removePostRenderCallback(this.postRenderCallbackInstalled);
		this.addedToScene = null;
		this.postRenderCallbackInstalled = null;
	}
	this.textOverlay.postRenderCleanup();
	this.textOverlay.returnAllLeased();
};

/**
 *
 * @param {string} text
 * @param {number} pixelX
 * @param {number} pixelY
 * @param {?string} [color]
 * @param {?number} [size]
 */
GLTextOverlayPool.prototype.drawOnce2D = function(text, pixelX, pixelY, color, size){
	this.textOverlay.drawOnce2D(text, pixelX, pixelY, color, size);
};

/**
 *
 * @param {string} text
 * @param {number} worldX
 * @param {number} worldY
 * @param {number} worldZ
 * @param {?string} [color]
 * @param {?number} [size]
 */
GLTextOverlayPool.prototype.drawOnce3D = function(text, worldX, worldY, worldZ, color, size){
	const p2d = MouseCoordinateWrangler.projectToScreenPixels(worldX, worldY, worldZ, this.camera, this.container, true);
	if(p2d!==null){
		this.textOverlay.drawOnce2D(text, p2d.x, p2d.y, color, size);
	}
};

/**
 *
 * @param {string} text
 * @param {number} pixelX
 * @param {number} pixelY
 * @param {?string} [color]
 * @param {?number} [size]
 * @return {TextElement}
 */
GLTextOverlayPool.prototype.lease2D = function(text, pixelX, pixelY, color, size){
	return this.textOverlay.lease2D(text, pixelX, pixelY, color, size);
};

/**
 *
 * @param {string} text
 * @param {number} worldX
 * @param {number} worldY
 * @param {number} worldZ
 * @param {?string} [color]
 * @param {?number} [size]
 * @return {TextElement}
 */
GLTextOverlayPool.prototype.lease3D = function(text, worldX, worldY, worldZ, color, size){
	const p2d = MouseCoordinateWrangler.projectToScreenPixels(worldX, worldY, worldZ, this.camera, this.container, true);
	if(p2d!==null) {
		this.textOverlay.lease2D(text, p2d.x, p2d.y, color, size);
	}else{
		this.textOverlay.lease2D(text, -1000, -1000, color, size); //make it offscreen in case it is to be fixed later
	}
};

/**
 * @param {TextElement} element
 */
GLTextOverlayPool.prototype.returnLeased = function(element){
	this.textOverlay.returnLeased(element);
};

GLTextOverlayPool.prototype.returnAllLeased = function(){
	this.textOverlay.returnAllLeased();
};



GLTextOverlayPool.prototype.postRenderCleanup = function(){
	this.textOverlay.postRenderCleanup();
};


export default GLTextOverlayPool;