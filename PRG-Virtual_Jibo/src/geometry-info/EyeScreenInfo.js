/**
 *
 * @param {number} eyeScreenWidth - width of eye screen billboard in m
 * @param {number} eyeScreenHeight - height of eye screen billboard in m
 * @param {string} eyeScreenBillboardMeshName - name of eye screen billboard mesh
 * @constructor
 */
const EyeScreenInfo = function(eyeScreenWidth, eyeScreenHeight, eyeScreenBillboardMeshName){
	/** @type {number} */
	this.eyeScreenWidth = eyeScreenWidth;
	/** @type {number} */
	this.eyeScreenHeight= eyeScreenHeight;
	/** @type {string} */
	this.eyeScreenBillboardMeshName = eyeScreenBillboardMeshName;
};

/**
 * @returns {number} - width of screen in m
 */
EyeScreenInfo.prototype.getWidth = function(){
	return this.eyeScreenWidth;
};

/**
 * @returns {number} - height of screen in m
 */
EyeScreenInfo.prototype.getHeight = function(){
	return this.eyeScreenHeight;
};

/**
 *
 * @returns {string} - name of screen billboard mesh (mesh in main hierarchy that eye graphics are texture onto)
 */
EyeScreenInfo.prototype.getEyeScreenBillboardMeshName = function(){
	return this.eyeScreenBillboardMeshName;
};

export default EyeScreenInfo;