"use strict";

import GLLinePool from "./GLLinePool.js";
import ExtraMath from "../ifr-geometry/ExtraMath.js";
import Bakery from "../ifr-core/Bakery.js";
import THREE from "@jibo/three";

/**
 *
 * @param {BasicScene} renderInScene - visualizer will be added to this scene
 * @param {number} lineLength - length of line to use for visualizing.  30 if omitted/null.
 * @constructor
 */
const GLKinematicVis = function (renderInScene, lineLength) {
	if(lineLength == null){ //null or undefined (eqnull)
		lineLength = 30;
	}

	/** {GLLinePool} */
	this._linePool = new GLLinePool(renderInScene, 600);

	/** THREE.Color*/
	this._defaultColor = new THREE.Color(1,1,1);

	/** {number} */
	this._rayLength = lineLength;

	/** {number} */
	this._axesSize = lineLength/5;

	/** {number */
	this._zeroVec = new THREE.Vector3(0,0,0);

	/** {number} */
	this._planeLineLength = lineLength * 0.85;
};

/**
 * @param {*} owner
 * @returns {string}
 */
const getOwnerString = function(owner){
	/** {string} */
	let useOwner = null;

	if (owner !== undefined && owner !== null) {
		if (typeof owner === "string") {
			useOwner = owner;
		} else if (owner.name) {
			useOwner = owner.name;
		} else if (owner.constructor) {
			useOwner = owner.constructor.name;
		} else {
			useOwner = "default";
		}
	}else{
		useOwner = "default";
	}

	return useOwner;
};

/**
 * @param {*} owner
 * @returns {string[]}
 */
const getVisualizerPath = function(owner){
	return ["KinematicVis", getOwnerString(owner)];
};


/**
 *
 * @param {*} owner
 * @param {string} [name] - optional.  check only against owner if omitted.
 * @returns {boolean} true if object or object:name should be visualized
 */
GLKinematicVis.prototype.shouldDraw = function(owner, name){
	const useOwner = getOwnerString(owner);
	const tabName = getVisualizerPath(owner);
	if(Bakery.getBoolean("Vis "+useOwner, false, tabName)) {
		if (name) {
			return Bakery.getBoolean(name, false, tabName);
		}else{
			return true;
		}
	}else{
		return false;
	}
};

/**
 *
 * @param {*} owner
 * @param {string} name
 * @param {THREE.Vector3} worldP1
 * @param {THREE.Vector3} worldP2
 * @param {THREE.Color} [color]
 */
GLKinematicVis.prototype.drawLineWorld = function(owner, name, worldP1, worldP2, color){
	if(this.shouldDraw(owner, name)) {
		if (color === undefined || color === null) {
			color = this._defaultColor;
		}

		this._linePool.drawOnce(worldP1, worldP2, color);
	}
};

GLKinematicVis.prototype.drawLineLocal = (function(){

	/** {THREE.Vector3} */
	let worldP1 = null;
	/** {THREE.Vector3} */
	let worldP2 = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Object3D} frame
	 * @param {THREE.Vector3} localP1
	 * @param {THREE.Vector3} localP2
	 * @param {THREE.Color} [color]
	 */
	return function(owner, name, frame, localP1, localP2, color){
		if(this.shouldDraw(owner, name)) {

			if(worldP1 === null){
				worldP1 = new THREE.Vector3();
				worldP2 = new THREE.Vector3();
			}

			frame.localToWorld(worldP1.copy(localP1));
			frame.localToWorld(worldP2.copy(localP2));

			this.drawLineWorld(owner, name, worldP1, worldP2, color);
		}
	};
}());


GLKinematicVis.prototype.drawAxesWorld = (function(){
	/** {THREE.Vector3} */
	let dir = null;

	/** {THREE.Color} */
	let red = null;
	let green = null;
	let blue = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Vector3} worldP
	 * @param {THREE.Color} [color] - color of whole axes, if omitted defaults to RGB for XYZ coloring.
	 */
	return function(owner, name, worldP, color){
		if(this.shouldDraw(owner, name)) {
			if(dir === null){
				dir = new THREE.Vector3();
				red = new THREE.Color(1,0,0);
				green = new THREE.Color(0,1,0);
				blue = new THREE.Color(0,0,1);
			}

			this.drawRayWorld(owner, name, worldP, dir.set( 1, 0, 0), color?color:red, this._axesSize);
			this.drawRayWorld(owner, name, worldP, dir.set(-1, 0, 0), color?color:red, this._axesSize);
			this.drawRayWorld(owner, name, worldP, dir.set( 0, 1, 0), color?color:green, this._axesSize);
			this.drawRayWorld(owner, name, worldP, dir.set( 0,-1, 0), color?color:green, this._axesSize);
			this.drawRayWorld(owner, name, worldP, dir.set( 0, 0, 1), color?color:blue, this._axesSize);
			this.drawRayWorld(owner, name, worldP, dir.set( 0, 0,-1), color?color:blue, this._axesSize);
		}
	};
}());


GLKinematicVis.prototype.drawAxesLocal = (function(){

	/** {THREE.Vector3} */
	let dir = null;

	/** {THREE.Color} */
	let red = null;
	let green = null;
	let blue = null;

	/**
	 * Draws an axes marker (3 lines along xyz
	 *
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Object3D} frame
	 * @param {THREE.Vector3} localP
	 * @param {THREE.Color} [color] - color of whole axes, if omitted defaults to RGB for XYZ coloring.
	 */
	return function(owner, name, frame, localP, color){
		if(this.shouldDraw(owner, name)) {

			if(dir === null){
				dir = new THREE.Vector3();
				red = new THREE.Color(1,0,0);
				green = new THREE.Color(0,1,0);
				blue = new THREE.Color(0,0,1);
			}

			this.drawRayLocal(owner, name, frame, localP, dir.set( 1, 0, 0), color?color:red, this._axesSize);
			this.drawRayLocal(owner, name, frame, localP, dir.set(-1, 0, 0), color?color:red, this._axesSize);
			this.drawRayLocal(owner, name, frame, localP, dir.set( 0, 1, 0), color?color:green, this._axesSize);
			this.drawRayLocal(owner, name, frame, localP, dir.set( 0,-1, 0), color?color:green, this._axesSize);
			this.drawRayLocal(owner, name, frame, localP, dir.set( 0, 0, 1), color?color:blue, this._axesSize);
			this.drawRayLocal(owner, name, frame, localP, dir.set( 0, 0,-1), color?color:blue, this._axesSize);
		}
	};
}());


GLKinematicVis.prototype.drawRayWorld = (function(){

	/** {THREE.Vector3} */
	let endPoint = null;
	/** {THREE.Vector3} */
	let directionScaled = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Vector3} worldPoint
	 * @param {THREE.Vector3} worldDirection
	 * @param {THREE.Color} [color]
	 * @param {number} [rayLength] - defaults to _rayLength
	 */
	return function(owner, name, worldPoint, worldDirection, color, rayLength){
		if(this.shouldDraw(owner, name)) {

			if(endPoint === null){
				endPoint = new THREE.Vector3();
				directionScaled = new THREE.Vector3();
			}

			if(rayLength == null){ //null or undefined (eqnull)
				rayLength = this._rayLength;
			}

			directionScaled.copy(worldDirection).setLength(rayLength);

			endPoint.addVectors(worldPoint, directionScaled);

			this.drawLineWorld(owner, name, worldPoint, endPoint, color);
		}
	};
}());

GLKinematicVis.prototype.drawRayLocal = (function(){

	/** {THREE.Vector3} */
	let worldPoint = null;
	/** {THREE.Vector3} */
	let worldDirection = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Object3D} frame
	 * @param {THREE.Vector3} localPoint - (default 0,0,0 if omitted or null)
	 * @param {THREE.Vector3} localDirection
	 * @param {THREE.Color} [color]
	 * @param {number} [rayLength] - defaults to _rayLength
	 */
	return function(owner, name, frame, localPoint, localDirection, color, rayLength){
		if(this.shouldDraw(owner, name)) {

			if(worldPoint === null){
				worldPoint = new THREE.Vector3();
				worldDirection = new THREE.Vector3();
			}

			if(localPoint === undefined || localPoint === null){
				localPoint = this._zeroVec;
			}

			frame.localToWorld(worldPoint.copy(localPoint));

			ExtraMath.convertDirectionLocalToWorld(frame, localDirection, worldDirection);

			this.drawRayWorld(owner, name, worldPoint, worldDirection, color, rayLength);
		}
	};
}());

GLKinematicVis.prototype.drawConeWorld = (function(){

	/** {THREE.Quaternion} */
	let planeRot = null;
	/** {THREE.Quaternion} */
	let coneItRot = null;
	/** {THREE.Vector3} */
	let perpVec = null;
	/** {THREE.Vector3} */
	let coneItAxis = null;
	/** {THREE.Vector3} */
	let rotatedEndPoint = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Vector3} worldPoint
	 * @param {THREE.Vector3} worldNormal
	 * @param {number} angleUpFromPlane - (default 0 for plane if omitted or null)
	 * @param {THREE.Color} [color]
	 */
	return function(owner, name, worldPoint, worldNormal, angleUpFromPlane, color){
		if(this.shouldDraw(owner, name)) {

			if (planeRot === null) {
				//init all
				planeRot = new THREE.Quaternion();
				coneItRot = new THREE.Quaternion();
				perpVec = new THREE.Vector3();
				coneItAxis = new THREE.Vector3();
				rotatedEndPoint = new THREE.Vector3();
			}

			if (angleUpFromPlane === undefined || angleUpFromPlane === null) {
				angleUpFromPlane = 0;
			}

			const planeDivisions = 100;

			ExtraMath.quatFromAxisAngle(worldNormal, Math.PI*2/planeDivisions, planeRot);
			ExtraMath.findOrthogonal(worldNormal, perpVec);
			perpVec.setLength(this._planeLineLength);

			coneItAxis.crossVectors(perpVec, worldNormal);

			ExtraMath.quatFromAxisAngle(coneItAxis, angleUpFromPlane, coneItRot);

			perpVec.applyQuaternion(coneItRot);

			for(let i = 0; i < planeDivisions; i++){
				rotatedEndPoint.addVectors(perpVec, worldPoint);
				this.drawLineWorld(owner, name, worldPoint, rotatedEndPoint, color);
				perpVec.applyQuaternion(planeRot);
			}
		}
	};
}());

GLKinematicVis.prototype.drawConeLocal = (function(){

	/** {THREE.Vector3} */
	let worldPoint = null;
	/** {THREE.Vector3} */
	let worldNormal = null;

	/**
	 * @param {*} owner
	 * @param {string} name
	 * @param {THREE.Object3D} frame
	 * @param {THREE.Vector3} localPoint - (default 0,0,0 if omitted or null)
	 * @param {THREE.Vector3} localNormal
	 * @param {number} angleUpFromPlane - (default 0 for plane if omitted or null)
	 * @param {THREE.Color} [color]
	 */
	return function(owner, name, frame, localPoint, localNormal, angleUpFromPlane, color){

		if(worldPoint === null){
			worldPoint = new THREE.Vector3();
			worldNormal = new THREE.Vector3();
		}

		if(localPoint === undefined || localPoint === null){
			localPoint = this._zeroVec;
		}

		frame.localToWorld(worldPoint.copy(localPoint));

		ExtraMath.convertDirectionLocalToWorld(frame, localNormal, worldNormal);

		this.drawConeWorld(owner, name, worldPoint, worldNormal, angleUpFromPlane, color);


	};
}());


/**
 * @param {*} owner
 * @param {string} name
 * @param {THREE.Vector3} localPoint - (default 0,0,0 if omitted or null)
 * @param {THREE.Vector3} localNormal
 * @param {THREE.Color} [color]
 */
GLKinematicVis.prototype.drawPlaneWorld = function(owner, name, localPoint, localNormal, color){
	return this.drawConeWorld(owner, name, localPoint, localNormal, 0, color);
};

/**
 * @param {*} owner
 * @param {string} name
 * @param {THREE.Object3D} frame
 * @param {THREE.Vector3} localPoint - (default 0,0,0 if omitted or null)
 * @param {THREE.Vector3} localNormal
 * @param {THREE.Color} [color]
 */
GLKinematicVis.prototype.drawPlaneLocal = function(owner, name, frame, localPoint, localNormal, color){
	return this.drawConeLocal(owner, name, frame, localPoint, localNormal, 0, color);
};




export default GLKinematicVis;
