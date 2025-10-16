/**
 * @constructor
 */
const BasicMesh = function()
{
	/** @type {string} */
	this.name = null;

	/** @type {string} */
	this.skeletonFrameName = null;

	/** @type {THREE.Mesh} */
	this.mesh = null;

	/** @type {Array.<string>} */
	this.boneFrameNames = null;

	/** @type {Array.<THREE.Bone>} */
	this.bones = null;
};

export default BasicMesh;