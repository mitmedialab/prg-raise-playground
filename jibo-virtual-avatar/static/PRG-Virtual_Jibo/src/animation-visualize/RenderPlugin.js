import THREE from "@jibo/three";
import slog from "../ifr-core/SLog.js";

const channel = "RENDER_PLUGIN";

/**
 * Base class for plugins that extend the 3D scene displaying Jibo's eye and/or body.
 * Useful for including additional 3D geometry, dynamic lighting, etc.
 *
 * @param {string} name - The unique name for this plugin.
 * @class RenderPlugin
 * @memberof jibo.visualize
 */
const RenderPlugin = function(name){
	/**
	 * @type {string}
	 * @private
	 */
	this._name = name;

	/**
	 * @type {SceneObjectCache[]}
	 * @private
	 */
	this._installed_cache = null;
};

/**
 * @param {THREE.Scene} scene
 * @constructor
 * @private
 */
const SceneObjectCache = function(scene){
	/** @type {THREE.Scene} */
	this._scene = scene;
	/** @type {Object.<string,object>} */
	this._objects = {};
};

/**
 * Helper to keep track of per-scene objects used by this plugin.
 * Use this function to access per-scene objects registered by _registerObjectForScene
 * @param {THREE.Scene} scene - Scene for which to retrieve the object.
 * @param {string} name - Name of the object to retrieve.
 * @return {object}
 * @private
 * @protected
 */
RenderPlugin.prototype._getObjectForScene = function(scene, name){
	if(this._installed_cache == null){
		return null;
	}
	let matchingCache = null;
	for(let i = 0; i < this._installed_cache.length; i++){
		if(scene === this._installed_cache[i]._scene){
			matchingCache = this._installed_cache[i];
			break;
		}
	}
	if(matchingCache === null){
		return null;
	}
	if(matchingCache._objects.hasOwnProperty(name)){
		return matchingCache._objects[name];
	}else{
		return null;
	}
};

/**
 * Helper to keep track of per-scene objects used by this plugin.
 * Use this function to clear all saved object data for a scene
 * (usually at the end of plugin uninstall).
 *
 * @param {THREE.Scene} scene - Scene for which to delete object data.
 * @param {string} [name] - Name of the object to delete.  If omitted, delete all saved data for the scene.
 * @protected
 */
RenderPlugin.prototype._clearObjectForScene = function(scene, name){
	if(this._installed_cache == null){
		return;
	}
	for(let i = 0; i < this._installed_cache.length; i++){
		if(scene === this._installed_cache[i]._scene){
			if(name == null){ //null or undefined (eqnull)
				this._installed_cache.splice(i, 1);
			}else{
				const matchingCache = this._installed_cache[i];
				delete matchingCache._objects[name];
			}
			break;
		}
	}
};

/**
 * Helper to keep track of per-scene objects used by this plugin.
 * Use this function to register a per-scene object to be later updated
 * or uninstalled.
 *
 * @param {THREE.Scene} scene - Scene for which to register the object.
 * @param {string} name - Name of the object, for retrieval (should be unique among objects in this scene).
 * @param {object} object - Object to register.
 * @protected
 */
RenderPlugin.prototype._registerObjectForScene = function(scene, name, object){
	if(this._installed_cache == null){
		this._installed_cache = [];
	}
	let matchingCache = null;
	for(let i = 0; i < this._installed_cache.length; i++){
		if(scene === this._installed_cache[i]._scene){
			matchingCache = this._installed_cache[i];
			break;
		}
	}
	if(matchingCache === null){
		matchingCache = new SceneObjectCache(scene);
		this._installed_cache.push(matchingCache);
	}
	if(matchingCache._objects.hasOwnProperty(name)){
		slog(channel, "Error, RenderPlugin registering object \""+name+"\" but one is already registered");
	}
	matchingCache._objects[name] = object;
};

/**
 * After adding a light to the scene, materials need to be re-initialized.
 * Call this to set "needsUpdate" on all materials in a scene.
 *
 * @param {THREE.Scene} scene - Scene to mark for update.
 * @protected
 */
RenderPlugin.prototype._markMaterialsForUpdate = function(scene){
	scene.traverse(function(sceneElement){
		if(sceneElement instanceof THREE.Mesh && sceneElement.material != null){
			sceneElement.material.needsUpdate = true;
		}
	});
};


/* interface definition:        */
/* eslint-disable no-unused-vars */

/**
 * Called initially, once per renderer the plugin is installed into.
 * @method jibo.visualize.RenderPlugin#install
 * @param {THREE.Scene} bodyScene - Body scene to install any setup into; may be null if renderer is eye-only.
 * @param {THREE.Scene} eyeScene - Eye scene to install any setup into; may be null if renderer is body-only.
 */
RenderPlugin.prototype.install = function(bodyScene, eyeScene){};

/**
 * Called whenever RobotRenderer.display is called, after dofValues have been applied
 * to the modelControlGroups. If this plugin is installed into multiple renderers, will be called seperately
 * for each scene.
 * @method jibo.visualize.RenderPlugin#update
 * @param {THREE.Scene} bodyScene - Body scene to modify if desired; may be null if renderer is eye-only.
 * @param {THREE.Scene} eyeScene - Eye scene to modify if desired; may be null if renderer is body-only.
 * @param {Object.<string, Object>} dofValues - Update display according to these values.
 */
RenderPlugin.prototype.update = function(bodyScene, eyeScene, dofValues){};

/**
 * Called when this module is removed from a renderer it was previously install'ed into,
 * once for each renderer the module is removed from.
 * @method jibo.visualize.RenderPlugin#uninstall
 * @param {THREE.Scene} bodyScene - Body scene to removed any modifications from; may be null if renderer is eye-only.
 * @param {THREE.Scene} eyeScene - Eye scene to removed any modifications from; may be null if renderer is body-only
 */
RenderPlugin.prototype.uninstall = function(bodyScene, eyeScene){};

/**
 * Returns the name of the plugin.
 * @method jibo.visualize.RenderPlugin#getName
 * @returns {string}
 */
RenderPlugin.prototype.getName = function(){
	return this._name;
};

export default RenderPlugin;
