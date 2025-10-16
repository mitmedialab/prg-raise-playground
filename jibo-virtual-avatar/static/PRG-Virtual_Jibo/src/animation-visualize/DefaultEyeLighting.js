import THREE from "@jibo/three";
import RenderPlugin from "./RenderPlugin.js";

/**
 *
 * @constructor
 * @extends RenderPlugin
 * @private
 */
const DefaultEyeLighting = function(){
	RenderPlugin.call(this, "DefaultEyeLighting");

	/**
	 * @type {THREE.Vector3}
	 * @private
	 */
	this._mainLightBasePosition = new THREE.Vector3(0, 0.03, 0.09);

	/**
	 * main light moves by eye-translation * _mainLightXScale in the x axis
	 * @type {number}
	 * @private
	 */
	this._mainLightXScale = 2;

	/**
	 * main light moves by eye-translation * _mainLightYScale in the y axis
	 * @type {number}
	 * @private
	 */
	this._mainLightYScale = 2.7;

	/**
	 * factor for LED color to affect LED light.  ledLight = (LED color * _ledEffectAmount)
	 * @type {number}
	 * @private
	 */
	this._ledEffectAmount = 0.2;
};

DefaultEyeLighting.prototype = Object.create(RenderPlugin.prototype);
DefaultEyeLighting.prototype.constructor = DefaultEyeLighting;

/**
 * Called initially, once per renderer the plugin is installed into.
 *
 * @param {THREE.Scene} bodyScene - Body scene to install any setup into (may be null if renderer is eye-only).
 * @param {THREE.Scene} eyeScene - Eye scene to install any setup into (may be null if renderer is body-only).
 * @abstract
 */
DefaultEyeLighting.prototype.install = function(bodyScene, eyeScene){
	if(eyeScene!=null){ //null or undefined (eqnull)
		/** @type {THREE.AmbientLight} */
		const ambientLight = new THREE.AmbientLight(0x303030);
		eyeScene.add(ambientLight);
		this._registerObjectForScene(eyeScene, "ambientLight", ambientLight);

		/** @type {THREE.DirectionalLight} */
		const ledLight = new THREE.DirectionalLight(0x000000, 1);
		ledLight.position.set(0, -2, 0);
		eyeScene.add(ledLight);
		this._registerObjectForScene(eyeScene, "ledLight", ledLight);

		/** @type {THREE.PointLight} */
		const pointLight = new THREE.PointLight(0xa0a0a0, 1.2, 1);
		pointLight.position.copy(this._mainLightBasePosition);
		this._registerObjectForScene(eyeScene, "mainLight", pointLight);
		eyeScene.add(pointLight);

		this._markMaterialsForUpdate(eyeScene);
	}
};

/**
 * Called whenever RobotRenderer.display is called, after dofValues have been applied
 * to the modelControlGroups. If this plugin is installed into multiple renderers, will be called separately
 * for each scene.
 *
 * @param {THREE.Scene} bodyScene - Body scene to modify if desired (may be null if renderer is eye-only).
 * @param {THREE.Scene} eyeScene - Eye scene to modify if desired (may be null if renderer is body-only).
 * @param {Object.<string, Object>} dofValues - Update display according to these values.
 * @abstract
 */
DefaultEyeLighting.prototype.update = function(bodyScene, eyeScene, dofValues){
	if(eyeScene!=null) { //null or undefined (eqnull)
		const ledLight = this._getObjectForScene(eyeScene, "ledLight");
		if (ledLight != null) { //null or undefined (eqnull)
			//make ledLight shine the color of the LED ring on the eyeball
			const red = dofValues["lightring_redChannelBn_r"];
			const green = dofValues["lightring_greenChannelBn_r"];
			const blue = dofValues["lightring_blueChannelBn_r"];
			if (red != null && green != null && blue != null) { //null or undefined (eqnull)
				ledLight.color.setRGB(red * this._ledEffectAmount, green * this._ledEffectAmount, blue * this._ledEffectAmount);
			}
		}
		const mainLight = this._getObjectForScene(eyeScene, "mainLight");
		if (mainLight != null) { //null or undefined (eqnull)
			//move the main light towards where the eye is pointing
			let eyeX = dofValues["eyeSubRootBn_t"];
			let eyeY = dofValues["eyeSubRootBn_t_2"];
			if (eyeX != null && eyeY != null) { //null or undefined (eqnull)
				eyeX = this._mainLightBasePosition.x + eyeX * this._mainLightXScale;
				eyeY = this._mainLightBasePosition.y + eyeY * this._mainLightYScale;
				const eyeZ = this._mainLightBasePosition.z;
				mainLight.position.set(eyeX, eyeY, eyeZ);
			}
		}
	}
};

/**
 * Called when this module is removed from a renderer it was previously installed into,
 * once for each renderer the module is removed from.
 *
 * @param {THREE.Scene} bodyScene - Body scene to removed any modifications from (may be null if renderer is eye-only).
 * @param {THREE.Scene} eyeScene - Eye scene to removed any modifications from (may be null if renderer is body-only).
 * @abstract
 */
DefaultEyeLighting.prototype.uninstall = function(bodyScene, eyeScene){

	if(eyeScene!=null){ //null or undefined (eqnull)
		const toDeleteNames = ["ambientLight", "ledLight", "mainLight"];
		for(let i = 0; i < toDeleteNames.length; i++){
			const light = this._getObjectForScene(eyeScene, toDeleteNames[i]);
			if(light != null){
				eyeScene.remove(light);
			}
		}
		this._clearObjectForScene(eyeScene);
	}
};

export default DefaultEyeLighting;
