/**
 * @param {string} [baseGeometryURL] - base geometry config directory
 * @param {string} [robotVersion] - robot version identifier
 * @constructor
 */
const JiboConfig = function(baseGeometryURL, robotVersion)
{
	let baseAssetURL = baseGeometryURL;
	if (baseAssetURL === undefined)
	{
		// Browser-compatible base URL resolution instead of Node.js find-root
		baseAssetURL = new URL('static/PRG-Virtual_Jibo/res/geometry-config/', window.location.href).href;
	}
	const robot = (robotVersion !== undefined) ? robotVersion : "P1.0";
	const robotURL = new URL(robot + "/", baseAssetURL).href;

	const bodyGeometryURL = new URL("jibo_body.geom", robotURL).href;
	const bodySkeletonURL = new URL("jibo_body.skel", robotURL).href;
	const bodyKinematicsURL = new URL("jibo_body.kin", robotURL).href;

	const fullGeometryURL = new URL("jibo_joined.geom", robotURL).href;
	const fullSkeletonURL = new URL("jibo_joined.skel", robotURL).href;
	const fullKinematicsURL = new URL("jibo_joined.kin", robotURL).href;

	const eyeGeometryURL = new URL("jibo_eye.geom", robotURL).href;
	const eyeSkeletonURL = new URL("jibo_eye.skel", robotURL).href;
	const eyeKinematicsURL = new URL("jibo_eye.kin", robotURL).href;

	const sceneInfoURL = new URL("jibo.jscene", robotURL).href;

	const dofGroupsURL = new URL("jibo.dofgroups", robotURL).href;

	const limitsURL = new URL("jibo.lim", robotURL).href;

	const defaultNormalURL = new URL("defaultNormalMap.png", robotURL).href;

	/**
	 * @return {string}
	 */
	this.getRobotURL = function(){ return robotURL; };

	/**
	 * @return {string}
	 */
	this.getBodyGeometryURL = function(){ return bodyGeometryURL; };
	/**
	 * @return {string}
	 */
	this.getBodySkeletonURL = function(){ return bodySkeletonURL; };
	/**
	 * @return {string}
	 */
	this.getBodyKinematicsURL = function(){ return bodyKinematicsURL; };

	/**
	 * @return {string}
	 */
	this.getFullGeometryURL = function(){ return fullGeometryURL; };
	/**
	 * @return {string}
	 */
	this.getFullSkeletonURL = function(){ return fullSkeletonURL; };
	/**
	 * @return {string}
	 */
	this.getFullKinematicsURL = function(){ return fullKinematicsURL; };

	/**
	 * @return {string}
	 */
	this.getEyeGeometryURL = function(){ return eyeGeometryURL; };
	/**
	 * @return {string}
	 */
	this.getEyeSkeletonURL = function(){ return eyeSkeletonURL; };
	/**
	 * @return {string}
	 */
	this.getEyeKinematicsURL = function(){ return eyeKinematicsURL; };

	/**
	 * @return {string}
	 */
	this.getSceneInfoURL = function(){ return sceneInfoURL; };

	/**
	 * @return {string}
	 */
	this.getDOFGroupsURL = function(){ return dofGroupsURL; };

	/**
	 * @return {string}
	 */
	this.getLimitsURL = function(){ return limitsURL; };

	/**
	 * @return {string}
	 */
	this.getDefaultNormalMap = function(){ return defaultNormalURL; };
};


export default JiboConfig;