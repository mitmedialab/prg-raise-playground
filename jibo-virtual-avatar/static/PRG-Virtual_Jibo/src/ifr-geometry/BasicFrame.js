import THREE from "@jibo/three";

/**
 * @param {string} name
 * @param {THREE.Vector3} position
 * @param {THREE.Quaternion} orientation
 * @constructor
 */
const BasicFrame = function(name, position, orientation)
{
	/** @type {string} */
	this.name = name || "";
	/** @type {THREE.Vector3} */
	this.position = position || new THREE.Vector3();
	/** @type {THREE.Quaternion} */
	this.orientation = orientation || new THREE.Quaternion();
};

/**
 * @param {object} jsonData
 * @return {BasicFrame}
 */
BasicFrame.prototype.setFromJson = function(jsonData)
{
	this.name = jsonData.name;
	this.position.copy(BasicFrame.vector3FromJson(jsonData.xyzTranslation));
	this.orientation.copy(BasicFrame.quaternionFromJson(jsonData.wxyzRotation));

	return this;
};

/**
 * @return {THREE.Matrix4}
 */
BasicFrame.prototype.toMatrix4 = function()
{
	return new THREE.Matrix4().compose(this.position, this.orientation, new THREE.Vector3(1, 1, 1));
};

/**
 * @param {Array} jsonArray
 * @return {THREE.Vector3}
 */
BasicFrame.vector3FromJson = function(jsonArray)
{
	return new THREE.Vector3().fromArray(jsonArray);
};

/**
 * @param {Array} jsonArray
 * @return {THREE.Quaternion}
 */
BasicFrame.quaternionFromJson = function(jsonArray)
{
	const wxyz = jsonArray;
	const q = new THREE.Quaternion(wxyz[1], wxyz[2], wxyz[3], wxyz[0]); // x, y, z, w
	q.inverse(); // switching from "world" frame convention (Apache/JSON) to "body" frame convention (THREE.js)
	return q;
};

export default BasicFrame;