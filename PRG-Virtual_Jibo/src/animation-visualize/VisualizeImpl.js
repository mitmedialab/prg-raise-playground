import SceneInfo from "../geometry-info/SceneInfo.js";
import JiboBody from "./JiboBody.js";
import JiboEye from "./JiboEye.js";
import BasicScene from "../ifr-visualizer/BasicScene.js";
import CachedImageLoader from "../ifr-geometry/loaders/CachedImageLoader.js";
import THREE from "@jibo/three";
import DefaultEyeLighting from "./DefaultEyeLighting.js";
import slog from "../ifr-core/SLog.js";

const channel = "MODEL_LOADING";


/**
 * Protected constructor for internal use only.
 *
 * WebGL renderer displaying Jibo's eye and/or body.  Created via the visualize module's
 * [createRobotRenderer]{@link jibo.visualize#createRobotRenderer} method.
 *
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @param {BasicScene} rootScene - The BasicScene; may contain body scene if present, otherwise eye scene if eye-only.
 * @param {THREE.Scene} bodyScene - Body THREE scene; may be null if eye-only.
 * @param {THREE.Scene} eyeScene - Eye THREE scene; may be a sub-scene rendering to texture in body+eye.
 * @param {ModelControlGroup[]} modelControlGroups - Protected constructor parameter.
 * @param {CachedImageLoader} textureLoader - Protected constructor parameter.
 * @class RobotRenderer
 * @intdocs
 * @memberof jibo.visualize
 * @protected
 */
const RobotRenderer = function(robotInfo, rootScene, bodyScene, eyeScene, modelControlGroups, textureLoader)
{
	/** @type {RobotInfo} */
	/** @private */
	this.robotInfo = robotInfo;
	/** @type {BasicScene} */
	/** "main" scene: bodyScene if we are body, eye scene if we are eye-only */
	/** @private */
	this.scene = rootScene;
	/** @type {ModelControlGroup[]} */
	/** @private */
	this.modelControlGroups = modelControlGroups;
	/** @type {CachedImageLoader} */
	/** @private */
	this.textureLoader = textureLoader;
	/** @type {THREE.GridHelper} */
	/** @private */
	this.grid = null;

	/** @type {string[]} */
	/** @private */
	this.renderedDOFs = [];

	/** Used for tracking if dof has moved in trackDOFDirty mode
	 *   Indexed by rendererDOFs
	 * @type {number[]} */
	/** @private */
	this.dofLastValues = [];

	/** Used for determining which dofs are numeric (for using epsilon distance) in trackDOFDirty mode.
	 *   Indexed by rendererDOFs
	 * @type {boolean[]} */
	/** @private */
	this.dofIsMetric = [];

	for(let i = 0; i < this.modelControlGroups.length; i++){
		const groupIDOFNames = this.modelControlGroups[i].getDOFNames();
		for(let di = 0; di < groupIDOFNames.length; di++){
			const dofName = groupIDOFNames[di];
			if(this.renderedDOFs.indexOf(dofName)<0){
				this.renderedDOFs.push(dofName);
				this.dofLastValues.push(Infinity); //starting value that will necessitate a first update no matter what
				this.dofIsMetric.push(robotInfo.getDOFInfo(dofName).isMetric());
			}
		}
	}

	/** Used for measuring distance in trackDOFDirty mode
	 * @type {number} */
	/** @private */
	this.dofChangeEpsilon = 0.0001;

	/** @type {boolean} */
	/** @private */
	this.trackDOFDirtyStatus = false;


	/** @type {Object.<string,RenderPlugin>} */
	/** @private */
	this.renderPlugins = {};

	/** @type {THREE.Scene} */
	/** @private */
	this.bodyScene = bodyScene;

	/** @type {THREE.Scene} */
	/** @private */
	this.eyeScene = eyeScene;

	this.display(this.robotInfo.getDefaultDOFValues());

	if (this.scene.getContainer() !== null)
	{
		this.scene.play();
	}
};

/**
 * Set this to true to only render graphics when a dof value has changed.
 * @method jibo.visualize.RobotRenderer#setRenderOnlyWhenDirty
 * @param {boolean} renderOnlyWhenDirty `true` to only render graphics when a dof value has changed.
 */
RobotRenderer.prototype.setRenderOnlyWhenDirty = function(renderOnlyWhenDirty){
	this.trackDOFDirtyStatus = renderOnlyWhenDirty;
	this.scene.setRenderOnlyWhenDirty(renderOnlyWhenDirty);
};

/**
 * Specify the number of frames after which graphics should render.
 * @method jibo.visualize.RobotRenderer#setRenderEveryNFrames
 * @param {number} renderEveryNFrames - Render at most once every renderEveryNFrames frames (1 means render every time)
 */
RobotRenderer.prototype.setRenderEveryNFrames = function(renderEveryNFrames) {
	this.scene.setRenderEveryNFrames(renderEveryNFrames);
};


/**
 * Updates the display according to the specified values.
 * @method jibo.visualize.RobotRenderer#display
 * @param {Object.<string, Object>} dofValues - Update display according to these values.
 */
RobotRenderer.prototype.display = function(dofValues)
{
	let shouldUpdate = true;

	//if we are tracking dirty status, find out if any dof values
	// (that we use) have changed, pass that info through to the BasicScene,
	// and skip updating if nothing has changed.
	if(this.trackDOFDirtyStatus){
		let aDOFMoved = false;
		const e = this.dofChangeEpsilon;
		for (let j = 0; j < this.renderedDOFs.length; j++) {
			const newValue = dofValues[this.renderedDOFs[j]];
			const oldValue = this.dofLastValues[j];
			if(newValue !== oldValue){
				if(this.dofIsMetric[j]){
					if(Math.abs(oldValue - newValue) > e){
						aDOFMoved = true;
						this.dofLastValues[j] = newValue;
					}
				}else{
					aDOFMoved = true;
					this.dofLastValues[j] = newValue;
				}
			}
		}
		if (aDOFMoved) {
			//shouldUpdate = true; //implied
			this.scene.markDirty();
		}else{
			shouldUpdate = false;
		}
	}

	//this.displayRawCounter = this.displayRawCounter+1;
	//if(shouldUpdate){
	//	this.displayActualCounter = this.displayActualCounter+1;
	//}
	//if(this.displayRawCounter > 200 || isNaN(this.displayRawCounter)){
	//	console.log("Drew "+(this.displayActualCounter/this.displayRawCounter).toFixed(2));
	//	this.displayActualCounter = 0;
	//	this.displayRawCounter = 0;
	//}
	//

	if(shouldUpdate) {
		let i;
		for (i = 0; i < this.modelControlGroups.length; i++) {
			this.modelControlGroups[i].updateFromDOFValues(dofValues);
		}

		const renderPluginNames = Object.keys(this.renderPlugins);
		for (i = 0; i < renderPluginNames.length; i++) {
			//Note: this will only be new dof values.  is there a case where
			// people pass in partial dof value maps, and we want to pass in ALL dof values here?
			// (keep a cached map?)
			this.renderPlugins[renderPluginNames[i]].update(this.bodyScene, this.eyeScene, dofValues);
		}
	}
};

/**
 * Load a texture.
 * @method jibo.visualize.RobotRenderer#loadTexture
 * @param {string} uri - A uri of a texture to pre-load to prepare for displaying.
 */
RobotRenderer.prototype.loadTexture = function(uri)
{
	this.textureLoader.loadImage(uri);
};

/**
 * Sets background color of the gl view.
 * @method jibo.visualize.RobotRenderer#setBackgroundColor
 * @param {number} r - Red (0-1).
 * @param {number} g - Green (0-1).
 * @param {number} b - Blue (0-1).
 * @param {number} [a] - Alpha (0-1); defaults to 1.
 */
RobotRenderer.prototype.setBackgroundColor = function(r,g,b,a)
{
	if(!a){
		a = 1;
	}
	this.scene.getRenderer().setClearColor(new THREE.Color(r,g,b), a);
};

/**
 * Sets the camera parameters for the GL view.
 * @method jibo.visualize.RobotRenderer#setCamera
 * @param {THREE.Vector3} position - Position of the camera
 * @param {THREE.Vector3} [lookat] - Position of the camera's look-at target; defaults to origin.
 * @param {number} [fov] - Camera field of view in degrees; defaults to 45 degrees.
 */
RobotRenderer.prototype.setCamera = function(position, lookat, fov)
{
	const pos = position;
	const look = lookat ? lookat : new THREE.Vector3();
	const f = fov ? fov : 45;

	this.scene.getCamera().position.copy(pos);
	this.scene.getTrackballControls().target.copy(look);
	this.scene.getCamera().fov = f;
	this.scene.getCamera().updateProjectionMatrix();
};

/**
 * Sets parameters for a ground-plane grid.
 * @method jibo.visualize.RobotRenderer#setGrid
 * @param {number} stepSize - Spacing between gridlines.
 * @param {number} stepsFromCenter - Number of grid steps from the origin.
 * @param {THREE.Color} lineColor - Gridline color.
 */
RobotRenderer.prototype.setGrid = function(stepSize, stepsFromCenter, lineColor)
{
	if (this.grid !== null)
	{
		this.scene.getScene().remove(this.grid);
	}

	this.grid = new THREE.GridHelper(stepsFromCenter*stepSize, stepSize);
	this.grid.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
	this.grid.setColors(lineColor, lineColor);
	this.scene.getScene().add(this.grid);
};

/**
 * Removes the renderer from the DOM and stop all associated computation and event handling.
 * Rendering can be resumed via the attachToContainer method.
 * @method jibo.visualize.RobotRenderer#detachFromContainer
 */
RobotRenderer.prototype.detachFromContainer = function()
{
	this.scene.detachFromContainer();
};

/**
 * Attaches the renderer to the given DOM element and begins/resumes rendering and event handling.
 * @method jibo.visualize.RobotRenderer#attachToContainer
 * @param {Element} domElement - Container element where renderer will be installed; can be null.
 */
RobotRenderer.prototype.attachToContainer = function(domElement)
{
	if (this.scene.getContainer() !== null)
	{
		this.detachFromContainer();
	}

	this.scene.attachToContainer(domElement);

	if (this.scene.getContainer() !== null)
	{
		this.scene.play();
	}
};

/**
 * Permanently removes the renderer from the DOM and release its resources.
 * @method jibo.visualize.RobotRenderer#dispose
 */
RobotRenderer.prototype.dispose = function()
{
	if (this.scene !== null)
	{
		this.scene.dispose();
		this.scene = null;
	}
	this.robotInfo = null;
	this.modelControlGroups = [];
	this.textureLoader = null;
	this.grid = null;
};

/**
 * Removes the mouse-based camera controls, if installed.
 * @method jibo.visualize.RobotRenderer#removeCameraControls
 */
RobotRenderer.prototype.removeCameraControls = function()
{
	this.scene.removeTrackballControls();
};

/**
 * Installs this render plugin. If a plugin with the same name is already installed, that
 * plugin will be uninstalled first.
 * @method jibo.visualize.RobotRenderer#installRenderPlugin
 * @param {jibo.visualize.RenderPlugin} renderPlugin - Plugin to install.
 */
RobotRenderer.prototype.installRenderPlugin = function(renderPlugin){
	const name = renderPlugin.getName();
	if(this.renderPlugins.hasOwnProperty(name)){
		this.renderPlugins[name].uninstall(this.bodyScene, this.eyeScene);
	}
	renderPlugin.install(this.bodyScene, this.eyeScene);
	this.renderPlugins[name] = renderPlugin;
};

/**
 * Removes named RenderPlugin. [uninstall()]{@link jibo.visualize.RenderPlugin#uninstall} will be called on the plugin.
 * @method jibo.visualize.RobotRenderer#removeRenderPlugin
 * @param {string} renderPluginName Plugin to remove.
 */
RobotRenderer.prototype.removeRenderPlugin = function(renderPluginName){
	if(this.renderPlugins.hasOwnProperty(renderPluginName)){
		this.renderPlugins[renderPluginName].uninstall(this.bodyScene, this.eyeScene);
		delete this.renderPlugins[renderPluginName];
	}
};

/**
 * Gets the names of all installed RenderPlugins.
 * @method jibo.visualize.RobotRenderer#getInstalledRenderPluginNames
 * @returns {string[]} An array of the names of all installed RenderPlugins.
 */
RobotRenderer.prototype.getInstalledRenderPluginNames = function(){
	return Object.keys(this.renderPlugins);
};



/**
 * @description
 * Graphical Display/Visualization API, including API for creating/controlling
 * THREE renderers of Jibo's eye or entire body.
 *
 * ```
 * var jibo = require("jibo");
 * jibo.visualize.createRobotRenderer(eyeContainerElement, jibo.visualize.DisplayType.EYE);
 * ```
 * @namespace jibo.visualize
 */

const visualize = {

	/**
	 * @callback jibo.visualize~RobotRendererCreatedCallback
	 * @param {jibo.visualize.RobotRenderer} robotRenderer - The RobotRenderer or null on failure.
	 */

	/**
	 * Creates a renderer bound to the given DOM element. Use to make the various renderers
	 * in SDK mode. In robot mode, there will be a single renderer for the eye screen, which
	 * can be accessed via "getEye" below.
	 *
	 * @method jibo.visualize#createRobotRenderer
	 * @param {jibo.animate.RobotInfo} robotInfo Robot configuration info used by the animate module.
	 * @param {Element} domElement - Container element where THREE renderer will be installed (can be null).
	 * @param {jibo.visualize~DisplayType} displayType - Type of display; "BODY" or "EYE".
	 * @param {jibo.visualize~RobotRendererCreatedCallback} cb - Callback; receives newly-created RobotRenderer instance, or null if creation failed.
	 * @static
	 */
	createRobotRenderer: function(robotInfo, domElement, displayType, cb)
	{
		const config = robotInfo.getConfig();

		/** @type {BasicScene} */
		let scene = null;
		/** @type {ModelControlGroup[]} */
		const modelControlGroups = [];
		const textureLoader = new CachedImageLoader();

		let robotRenderer = null;

		const sceneInfo = new SceneInfo();
		sceneInfo.load(config.getSceneInfoURL(), function()
		{
			if (sceneInfo.loadSucceeded)
			{
				const jiboEye = new JiboEye(config);
				jiboEye.setTextureLoader(textureLoader);
				jiboEye.load(function()
				{
					if (jiboEye.loadSucceeded)
					{
						modelControlGroups.push(jiboEye.getModelControlGroup());
						if (displayType === visualize.DisplayType.EYE)
						{
							scene = new BasicScene(domElement, false, false, new THREE.Color(0, 0, 0));

							scene._camera = jiboEye.constructCamera(sceneInfo);
							scene._scene = jiboEye.constructScene();

							robotRenderer = new RobotRenderer(robotInfo, scene, null, scene._scene, modelControlGroups, textureLoader);
							robotRenderer.installRenderPlugin(new DefaultEyeLighting());
							if (cb)
							{
								cb(robotRenderer);
							}
						}
						else
						{
							const jiboBody = new JiboBody(config);
							jiboBody.setTextureLoader(textureLoader);
							jiboBody.load(function()
							{
								if (jiboBody.loadSucceeded)
								{
									modelControlGroups.push(jiboBody.getModelControlGroup());

									scene = new BasicScene(domElement, false, false, new THREE.Color(0, 0, 0.3));
									scene.getCamera().up = new THREE.Vector3(0,0,1);
									scene.installTrackballControls();//do this after we set the camera up

									// lighting
									scene.getDirectionalLight().intensity = 0.5;
									scene.getDirectionalLight().position.set(1, -1, 1);

									const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
									light2.position.set(1, 1, 1);
									scene.getScene().add(light2);
									const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
									light3.position.set(-1, 0, 1);
									scene.getScene().add(light3);

									const modelRoot = jiboBody.getModelRoot();
									//modelRoot.position.z = 1.905/100; //in model now
									scene.getScene().add(modelRoot);

									const eyeScene = jiboEye.constructScene();
									const eyeCamera = jiboEye.constructCamera(sceneInfo);
									const eyeRenderTarget = jiboBody.constructFaceScreenRenderTarget(sceneInfo);

									const sceneClearColor = new THREE.Color();
									const screenClearColor = new THREE.Color(0,0,0);

									scene.addRenderCallback(function()
									{
										const renderer = scene.getRenderer();

										sceneClearColor.copy(renderer.getClearColor());
										renderer.setClearColor(screenClearColor);

										renderer.render(eyeScene, eyeCamera, eyeRenderTarget);

										renderer.setClearColor(sceneClearColor);
									});

									robotRenderer = new RobotRenderer(robotInfo, scene, scene._scene, eyeScene, modelControlGroups, textureLoader);
									robotRenderer.setCamera(new THREE.Vector3(0.50, 0.0, 0.37), new THREE.Vector3(0, 0, 0.17), 45);
									robotRenderer.installRenderPlugin(new DefaultEyeLighting());
									if (cb)
									{
										cb(robotRenderer);
									}
								}
								else
								{
									slog(channel, "JiboBody load error: "+jiboBody.loadMessage);
									if (cb)
									{
										cb(null);
									}
								}
							});
						}
					}
					else
					{
						slog(channel, "JiboEye load error: "+jiboEye.loadMessage);
						if (cb)
						{
							cb(null);
						}
					}
				});
			}
			else
			{
				slog(channel, "SceneInfo load error: "+sceneInfo.loadMessage);
				if (cb)
				{
					cb(null);
				}
			}
		});
	},

	/**
	 * This will provide access to the pre-initialized RobotRenderer instance running full
	 * screen on the robot's eye during on-robot operation.
	 *
	 * @method jibo.visualize#getEye
	 * @return {RobotRenderer}
	 * @private
	 * @static
	 */
	getEye: function()
	{
		return null;
	}
};

/**
 * Enum Values for createRobotRenderer.
 * @enum {string}
 * @alias jibo.visualize~DisplayType
 */
const DisplayType = {
	/** Body display type */
	BODY: "BODY",
	/** Eye display type */
	EYE: "EYE"
};

/**
 * @type {DisplayType}
 */
visualize.DisplayType = DisplayType;

export default visualize;
