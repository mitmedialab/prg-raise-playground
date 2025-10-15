"use strict";

import THREE from "@jibo/three";

/**
 *
 * @param {THREE.Vector3} pos1
 * @param {THREE.Vector3} pos2
 * @param {THREE.Color} color
 * @constructor
 */
const GLLinePoolLine = function(pos1, pos2, color){
	this.pos1 = pos1;
	this.pos2 = pos2;
	this.color = color;
};

/**
 * @param {THREE.Vector3} pos1
 * @param {THREE.Vector3} pos2
 */
GLLinePoolLine.prototype.setPosition = function(pos1, pos2){
	this.pos1 = pos1;
	this.pos2 = pos2;
};

/**
 * @param {THREE.Color} color
 */
GLLinePoolLine.prototype.setColor = function(color){
	this.color = color;
};

/**
 * @param {BasicScene} renderInScene pool will be added to this scene if provided (optional)
 * @param {number} useMaxLines that can be rendered per update.  default 100 if omitted or null
 * @constructor
 */
const GLLinePool = function(renderInScene, useMaxLines)
{
	if(useMaxLines === undefined || useMaxLines === null){
		useMaxLines = 100;
	}
	/**	@type {number} */
	this.maxLines = useMaxLines;

	/**	@type {number} */
	this.numTempLines = 0;

	/**	@type {THREE.Vector3} */
	this.unusedVec = new THREE.Vector3(1000000,1000000,1000000);

	/**	@type {THREE.Color} */
	this.unusedColor = new THREE.Color(1,1,1);

	/** @type {THREE.LineBasicMaterial} */
	this.lineMaterial = new THREE.LineBasicMaterial({
	//	color: 0xff66ff
		vertexColors: THREE.VertexColors
	});

	/**	@type {THREE.Geometry} */
	this.lineGeometry = new THREE.Geometry();
	for(let i = 0; i < this.maxLines; i++)
	{
		this.lineGeometry.vertices.push(new THREE.Vector3().copy(this.unusedVec));
		this.lineGeometry.vertices.push(new THREE.Vector3().copy(this.unusedVec));
		this.lineGeometry.colors.push(new THREE.Color().copy(this.unusedColor));
		this.lineGeometry.colors.push(new THREE.Color().copy(this.unusedColor));
	}

	/**	@type {THREE.Line} */
	this.line = new THREE.Line(this.lineGeometry, this.lineMaterial, THREE.LinePieces);

	//Bounding sphere is computed once only for frustum culling
	//could also force recompute by this.lineGeometry.boundingSphere = null;
	this.line.frustumCulled = false;

	this.lineMaterial.linewidth = 1;

	this.postRenderCallbackInstalled = null;
	this.renderCallbackInstalled = null;

	/** @type {BasicScene} */
	this.addedToScene = null;

	/**
	 * @type {GLLinePoolLine[]}
	 */
	this.leasedLines = [];

	if(renderInScene !== undefined)
	{
		this.addToScene(renderInScene);
	}
};

/**
 *
 * @param {BasicScene} renderInScene
 */
GLLinePool.prototype.addToScene = function(renderInScene)
{
	renderInScene.getScene().add(this.line);

	//cache the callback so we can remove it.
	this.postRenderCallbackInstalled = this.postRenderCleanup.bind(this);
	this.renderCallbackInstalled = this.prepareForRender.bind(this);
	this.addedToScene = renderInScene;

	renderInScene.addPostRenderCallback(this.postRenderCallbackInstalled);
	renderInScene.addRenderCallback(this.renderCallbackInstalled);
};

/**
 * Removes this GLLinePool from the scene it was added to.  Does nothing if
 * it has already been removed or was never added.
 */
GLLinePool.prototype.removeFromScene = function()
{
	if(this.addedToScene!=null){
		this.addedToScene.getScene().remove(this.line);
		this.addedToScene.removePostRenderCallback(this.postRenderCallbackInstalled);
		this.addedToScene.removeRenderCallback(this.renderCallbackInstalled);
		this.addedToScene = null;
		this.postRenderCallbackInstalled = null;
	}
};


/**
 *
 * @param {THREE.Vector3} pos1
 * @param {THREE.Vector3} pos2
 * @param {THREE.Color} color
 */
GLLinePool.prototype.drawOnce = function(pos1, pos2, color)
{
	if(this.numTempLines < this.maxLines)
	{
		this.lineGeometry.vertices[this.numTempLines*2].copy(pos1);
		this.lineGeometry.vertices[this.numTempLines*2+1].copy(pos2);
		this.lineGeometry.verticesNeedUpdate = true;

		if(color !== undefined){
			this.lineGeometry.colors[this.numTempLines*2].copy(color);
			this.lineGeometry.colors[this.numTempLines*2+1].copy(color);
			this.lineGeometry.colorsNeedUpdate = true;
		}

		this.numTempLines++;
	}
};

/**
 * @param {THREE.Vector3} pos1
 * @param {THREE.Vector3} pos2
 * @param {THREE.Color} color
 * @return GLLinePoolLine
 */
GLLinePool.prototype.leaseLine = function(pos1, pos2, color)
{
	const line = new GLLinePoolLine(pos1, pos2, color);
	this.leasedLines.push(line);
	return line;
};

/**
 * @param {GLLinePoolLine} leased
 */
GLLinePool.prototype.returnLeased = function(leased){
	const index = this.leasedLines.indexOf(leased);
	if(index >= 0){
		this.leasedLines.splice(index, 1);
	}else{
		console.log("Error, cannot return line that has not been leased!("+leased+")");
	}
};

GLLinePool.prototype.returnAllLeased = function(){
	this.leasedLines.length = 0;
};


/**
 *
 * @param {number} lineWidth set line width. default 1.
 * @return {GLLinePool} this for chaining
 */
GLLinePool.prototype.setLineWidth = function(lineWidth)
{
	this.lineMaterial.linewidth = lineWidth;
	return this;
};

GLLinePool.prototype.prepareForRender = function()
{
	for(let i = 0; i < this.leasedLines.length; i++){
		const ll = this.leasedLines[i];
		this.drawOnce(ll.pos1, ll.pos2, ll.color);
	}
};

GLLinePool.prototype.postRenderCleanup = function()
{
	if(this.numTempLines > 0)
	{
		for(let i = 0; i < this.numTempLines; i++)
		{
			this.lineGeometry.vertices[i*2].copy(this.unusedVec);
			this.lineGeometry.vertices[i*2+1].copy(this.unusedVec);
			this.lineGeometry.colors[i*2].copy(this.unusedColor);
			this.lineGeometry.colors[i*2+1].copy(this.unusedColor);
		}
		this.lineGeometry.verticesNeedUpdate = true;
		this.lineGeometry.colorsNeedUpdate = true;
		this.numTempLines = 0;
	}
};


export default GLLinePool;
