"use strict";

import TrackballControls from "./TrackballControls.js";
import THREE from "@jibo/three";

// stats-js is optional for performance monitoring (FPS counter)
// To enable: npm install stats-js, then uncomment the line below
// import Stats from "stats-js";
let Stats = null;

/**
 * @param {HTMLElement} containerElement
 * @param {boolean} installControls
 * @param {boolean} installStats
 * @param {THREE.Color} clearColor
 * @constructor
 */
const BasicScene = function(containerElement, installControls, installStats, clearColor)
{
	/** @type {HTMLElement} */
	this._container = (containerElement !== undefined) ? containerElement : null;

	if (this._container)
	{
		const box = this._container.getBoundingClientRect();
		this._width = box.width;
		this._height = box.height;
	}
	else
	{
		this._width = 100;
		this._height = 100;
	}

	/**
	 * Sometimes the element appears ready, and the rendering "happens", but doesn't show up.
	 * In those cases, if we're in "renderOnlyWhenDirty", there will be a long time with no eye rendered (until it next moves)
	 * @type {boolean}
	 * @private
	 */
	this._workaroundElementReadyRace = true;

	/** @type {THREE.PerspectiveCamera} */
	this._camera = new THREE.PerspectiveCamera(60, this._width/this._height, 0.1, 1000);
	this._camera.position.z = 20;

	/** @type {THREE.Scene} */
	this._scene = new THREE.Scene();

	/** @type {THREE.AmbientLight} */
	this._ambientLight = new THREE.AmbientLight(0x404040);
	this._scene.add(this._ambientLight);

	/** @type {THREE.DirectionalLight} */
	this._directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	this._directionalLight.position.set(-1, 1, 1);
	this._scene.add(this._directionalLight);

	/** @type {THREE.WebGLRenderer} */
	this._renderer = new THREE.WebGLRenderer({antialias: true});
	this._renderer.setSize(this._width, this._height);
	if (clearColor)
	{
		this._renderer.setClearColor(clearColor);
	}

	/** @type {boolean} */
	this._renderOnlyWhenDirty = false;
	/** @type {boolean} */
	this._dirty = true;
	
	/** @type {boolean} */
	this._autoResize = true;
	/** @type {number} */
	this._renderEveryNFRames = 1;
	/** @type {number} */
	this._frameSkipCounter = 0;

	if (this._container)
	{
		this._container.appendChild(this._renderer.domElement);
		if(this._workaroundElementReadyRace){
			setTimeout(this.markDirty.bind(this), 200);
		}
	}

	/** @type {Array} */
	this._renderCallbacks = [];

	/** @type {Array} */
	this._postRenderCallbacks = [];

	/** @type TrackballControls */
	this._controls = null;
	if (installControls)
	{
		this.installTrackballControls();
	}

	/** @type {Stats} */
	this._stats = null;
	if (installStats)
	{
		this.installStats();
	}

	this._doPlay = this.play.bind(this);
    this._markDirty = this.markDirty.bind(this);
	//this._doResize = function(){self.handleResize();};
	//if (this._container)
	//{
	//	window.addEventListener("resize", this._doResize, false);
	//}
};

BasicScene.prototype.installTrackballControls = function()
{
	if (this._controls === null)
	{
		this._dirty = true;

		this._controls = new TrackballControls(this._camera, this._container);

		this._controls.rotateSpeed = 1.0;
		this._controls.zoomSpeed = 1.2;
		this._controls.panSpeed = 1.0;

		this._controls.noZoom = false;
		this._controls.noPan = false;
		this._controls.staticMoving = true;
		this._controls.dynamicDampingFactor = 0.3;

		this._controls.keys = [ 65, 83, 68 ];

		if (this._container)
		{
			this._container.addEventListener('mousewheel', this._markDirty);
			this._container.addEventListener('mousemove', this._markDirty);
		}
	}
};

BasicScene.prototype.removeTrackballControls = function()
{
	if (this._controls !== null)
	{
		this._dirty = true;

		if (this._container)
		{
			this._container.removeEventListener('mousewheel', this._markDirty);
			this._container.removeEventListener('mousemove', this._markDirty);
		}

		this._controls.dispose();
		this._controls = null;
	}
};

BasicScene.prototype.installStats = function()
{
	this._dirty = true;
	if (Stats !== null) {
		this._stats = new Stats();
		this._stats.domElement.style.position = "absolute";
		this._stats.domElement.style.top = "0px";
		this._stats.domElement.style.zIndex = 100;
		if (this._container)
		{
			this._container.appendChild(this._stats.domElement);
		}
	} else {
		console.log("BasicScene: stats-js not available, performance monitoring disabled");
	}
};

/**
 * Set to true to only render this scene once every time markDirty has been called
 * @param {boolean} renderOnlyWhenDirty
 */
BasicScene.prototype.setRenderOnlyWhenDirty = function(renderOnlyWhenDirty)
{
	this._renderOnlyWhenDirty = renderOnlyWhenDirty;
};

/**
 * @param {number} renderEveryNFrames - render at most once every n frames (1 means render every time)
 */
BasicScene.prototype.setRenderEveryNFrames = function(n)
{
	this._renderEveryNFRames = n;
};


/**
 * Mark the scene as needing a re-render (only relevant if renderOnlyWhenDirty has been set)
 */
BasicScene.prototype.markDirty = function()
{
	this._dirty = true;
};


/**
 * @param {boolean} enabled
 */
BasicScene.prototype.setAutoResize = function(enabled) {
	this._autoResize = enabled;
};

/**
 * @return {boolean} true if did resize
 */
BasicScene.prototype.handleResize = function() {
	if (!this._container || !this._autoResize)
	{
		return false;
	}

	const box = this._container.getBoundingClientRect();
	if (box.width !== this._width || box.height !== this._height)
	{
		this._width = box.width;
		this._height = box.height;

		this._camera.aspect = this._width/this._height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(this._width, this._height);

		if (this._controls !== null)
		{
			this._controls.handleResize();
		}
		return true;
	}
	else
	{
		return false;
	}
};

BasicScene.prototype.detachFromContainer = function()
{
	this.stop();
	if (this._container)
	{
		this._container.removeChild(this._renderer.domElement);
		//window.removeEventListener("resize", this._doResize, false);

		if (this._controls)
		{
			this._controls.detachFromContainer();
			this._container.removeEventListener('mousewheel', this._markDirty);
			this._container.removeEventListener('mousemove', this._markDirty);
		}
		if (this._stats)
		{
			this._container.removeChild(this._stats.domElement);
		}

		this._container = null;
	}
};

/**
 * @param {HTMLElement} element
 */
BasicScene.prototype.attachToContainer = function(element)
{
	this._dirty = true;

	if (this._container)
	{
		this.detachFromContainer();
	}

	this._container = (element !== undefined) ? element : null;

	if (this._container)
	{
		const box = this._container.getBoundingClientRect();
		this._width = box.width;
		this._height = box.height;

		this._camera.aspect = this._width/this._height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(this._width, this._height);

		this._renderer.domElement = document.adoptNode(this._renderer.domElement);
		this._container.appendChild(this._renderer.domElement);

		if(this._workaroundElementReadyRace){
			const self = this;
			setInterval(function(){self.markDirty();}, 200);
		}

		if (this._controls)
		{
			this._controls.attachToContainer(this._container);
			this._container.addEventListener('mousewheel', this._markDirty);
			this._container.addEventListener('mousemove', this._markDirty);
		}
		if (this._stats)
		{
			this._stats.domElement = document.adoptNode(this._stats.domElement);
			this._container.appendChild(this._stats.domElement);
		}

		//window.addEventListener("resize", this._doResize, false);
	}
};

BasicScene.prototype.dispose = function()
{
	this.detachFromContainer();
    this.removeTrackballControls();
	this._camera = null;
	this._scene = null;
	this._ambientLight = null;
	this._directionalLight = null;
	this._renderer = null;
	this._renderCallbacks = null;
	this._postRenderCallbacks = null;
	this._controls = null;
	this._stats = null;
};

/**
 * @return {HTMLElement}
 */
BasicScene.prototype.getContainer = function()
{
	return this._container;
};

/**
 * @return {THREE.PerspectiveCamera}
 */
BasicScene.prototype.getCamera = function()
{
	return this._camera;
};

/**
 * @return {THREE.Scene}
 */
BasicScene.prototype.getScene = function()
{
	return this._scene;
};

/**
 * @return {THREE.AmbientLight}
 */
BasicScene.prototype.getAmbientLight = function()
{
	return this._ambientLight;
};

/**
 * @return {THREE.DirectionalLight}
 */
BasicScene.prototype.getDirectionalLight = function()
{
	return this._directionalLight;
};

/**
 * @return {THREE.WebGLRenderer}
 */
BasicScene.prototype.getRenderer = function()
{
	return this._renderer;
};

/**
 * @return {TrackballControls}
 */
BasicScene.prototype.getTrackballControls = function()
{
	return this._controls;
};

/**
 * @return {Stats}
 */
BasicScene.prototype.getStats = function()
{
	return this._stats;
};

BasicScene.prototype.addRenderCallback = function(cb)
{
	this._dirty = true;
	this._renderCallbacks.push(cb);
};

BasicScene.prototype.removeRenderCallback = function(cb)
{
	this._dirty = true;
	const cbIndex = this._renderCallbacks.indexOf(cb);
	if (cbIndex > -1)
	{
		this._renderCallbacks.splice(cbIndex, 1);
	}
};

BasicScene.prototype.addPostRenderCallback = function(cb)
{
	this._dirty = true;
	this._postRenderCallbacks.push(cb);
};

BasicScene.prototype.removePostRenderCallback = function(cb)
{
	this._dirty = true;
	const cbIndex = this._postRenderCallbacks.indexOf(cb);
	if (cbIndex > -1)
	{
		this._postRenderCallbacks.splice(cbIndex, 1);
	}
};

BasicScene.prototype.render = function()
{
	// check for resize and update if necessary
	const didResize = this.handleResize();

	this._frameSkipCounter++;

	if((this._frameSkipCounter >= this._renderEveryNFRames) &&
		(!this._renderOnlyWhenDirty || didResize || this._dirty)) {
		if (this._controls !== null) {
			this._controls.update();
		}

		for (let i = 0; i < this._renderCallbacks.length; i++) {
			this._renderCallbacks[i]();
		}

		this._renderer.render(this._scene, this._camera);

		for (let i = 0; i < this._postRenderCallbacks.length; i++) {
			this._postRenderCallbacks[i]();
		}

		if (this._stats !== null) {
			this._stats.update();
		}
		this._dirty = false;
		this._frameSkipCounter = 0;
	}
};

BasicScene.prototype.play = function()
{
	this._requestHandle = window.requestAnimationFrame(this._doPlay);
	this.render();
};

BasicScene.prototype.stop = function()
{
	if (this._requestHandle !== undefined)
	{
		window.cancelAnimationFrame(this._requestHandle);
	}
};

export default BasicScene;