"use strict";

import THREE from "@jibo/three";
import MouseCoordinateWrangler from "./MouseCoordinateWrangler.js";
import ViewportTargetPositioner from "./ViewportTargetPositioner.js";
import SLog from "../ifr-core/SLog.js";

const channel = "UI_TARGET";

/**
 * @callback MouseEventSelectionFilter
 * @param {MouseEvent}
 * @return {boolean}
 * @intdocs
 */

/**
 *
 * @param {Element} element - the gl element
 * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
 * @param {THREE.Vector3} defaultInitialPosition - initial position, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} pointOnGroundPlane - any point on the ground plane, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} groundPlaneNormal - normal of the ground plane, (0,1,0) will be used if omitted
 * @param {string[]} [initialTargetNames] - names of initial target positioners.  defaults to ["default"].  pass [] to start with no positioners.
 * @constructor
 */
const MouseTargetPositioner = function(element, camera, defaultInitialPosition, pointOnGroundPlane, groundPlaneNormal, initialTargetNames){

	if(defaultInitialPosition == null){ //null or undefined (eqnull)
		defaultInitialPosition = new THREE.Vector3(0,0,0);
	}
	if(pointOnGroundPlane == null){ //null or undefined (eqnull)
		pointOnGroundPlane = new THREE.Vector3(0,0,0);
	}
	if(groundPlaneNormal == null){ //null or undefined (eqnull)
		groundPlaneNormal = new THREE.Vector3(0,1,0);
	}
	if(initialTargetNames == null){ //null or undefined (eqnull)
		initialTargetNames = ["default"];
	}

	/** positionChangedCallback[] */
	const positionChangedListeners = [];

	/** @type{Map<string,ViewportTargetPositioner>} */
	const targetPositioners = new Map();

	/** @type{string} */
	let selectedPositionerName = null;

	const capture = true;


	/** @type {MouseEventSelectionFilter} */
	let isForMe = null;
	/** @type {MouseEventSelectionFilter} */
	let isForGroundPlane = null;
	/** @type {MouseEventSelectionFilter} */
	let isForCameraPlane = null;

	/** @type {BasicScene} */
	let renderInScene = null;

	/**
	 * @param {MouseEvent} event
	 */
	const processEvent = function(event){
		event.preventDefault();
		event.stopPropagation();
		const local = MouseCoordinateWrangler.getLocalCoordinatesNDCCentered(event, element);
		if(selectedPositionerName != null){
			const currentVTP = targetPositioners.get(selectedPositionerName);
			if(currentVTP != null){
				if(isForGroundPlane(event)) {
					currentVTP.moveToNDCPoint(local.x, local.y, true);
				}else if(isForCameraPlane(event)){
					currentVTP.moveToNDCPoint(local.x, local.y, false);
				}
			}
		}
	};

	/**
	 * @param {MouseEvent} event
	 */
	const mouseMoved = function(event){
		if(isForMe(event)){
			processEvent(event);
		}
	};

	const acceptOutOfWindowMotions = true;
	/**
	 * @param {MouseEvent} event
	 */
	const mouseUp = function(event){ // eslint-disable-line no-unused-vars
		if(acceptOutOfWindowMotions){
			document.removeEventListener("mousemove", mouseMoved, capture);
			document.removeEventListener("mouseup", mouseUp, capture);
		}else{
			element.removeEventListener("mousemove", mouseMoved, capture);
			element.removeEventListener("mouseup", mouseUp, capture);
			element.removeEventListener("mouseleave", mouseUp, capture);
		}
	};

	element.addEventListener( 'mousedown', function(event){
		if(isForMe(event)) {
			processEvent(event);
			if(acceptOutOfWindowMotions){
				document.addEventListener('mousemove', mouseMoved, capture);
				document.addEventListener('mouseup', mouseUp, capture);
			}else{
				element.addEventListener('mousemove', mouseMoved, capture);
				element.addEventListener('mouseup', mouseUp, capture);
				element.addEventListener('mouseleave', mouseUp, capture);
			}
		}
	}, capture );


	/**
	 * Set mouse filters for this positioner.  The "isForMeFilter" is first applied, and only
	 * events that match this filter will be processed at all.  "isForGroupPlane" and "isForCamera"
	 * filters will only be run on events that already passed the "isForMeFilter".  "isForGroundPlane"
	 * is evaluated first, points will not be used for camera plane if they match for ground plane.
	 *
	 * @param {MouseEventSelectionFilter} [isForMeFilter] - specify filter for this positioner (default is NONE of alt, meta, ctrl down)
	 * @param {MouseEventSelectionFilter} [isForGroundPlaneFilter] - specify filter for ground plane clicks (default is shift down)
	 * @param {MouseEventSelectionFilter} [isForCameraPlaneFilter] - specify filter for camera plane clicks (default is shift up)
	 */
	this.setMouseFilters = function(isForMeFilter,
									isForGroundPlaneFilter,
									isForCameraPlaneFilter){
		if(isForMeFilter!=null){ //null or undefined
			isForMe = isForMeFilter;
		}else{
			isForMe = function(event){
				return (!event.altKey && !event.metaKey && !event.ctrlKey);
			};
		}
		if(isForGroundPlaneFilter!=null){ //null or undefined
			isForGroundPlane = isForGroundPlaneFilter;
		}else{
			isForGroundPlane = function(event){
				return event.shiftKey;
			};
		}
		if(isForCameraPlaneFilter!=null){ //null or undefined
			isForCameraPlane = isForCameraPlaneFilter;
		}else{
			isForCameraPlane = function(event){
				return !event.shiftKey;
			};
		}
	};



	/**
	 * @param {positionChangedCallback} cb
	 */
	this.addPositionChangedCallback = function(cb){
		const cbIndex = positionChangedListeners.indexOf(cb);
		if (cbIndex < 0) {
			positionChangedListeners.push(cb);
		}
	};

	/**
	 * @param {positionChangedCallback} cb
	 */
	this.removePositionChangedCallback = function(cb){
		const cbIndex = positionChangedListeners.indexOf(cb);
		if (cbIndex > -1) {
			positionChangedListeners.splice(cbIndex, 1);
		}
	};

	/**
	 * @param {THREE.Vector3} position
	 * @param {string} name
	 */
	this.notifyPositionChangedCallbacks = function(position, name){
		for (let i=0; i<positionChangedListeners.length; i++){
			positionChangedListeners[i](position, name);
		}
	};

	/**
	 * @param {string} name
		 * @param {THREE.Vector3} [initialPosition] defaults to value passed to MouseTargetPositioner constructor.
	 */
	this.addTargetPositioner = function(name, initialPosition){
		if(!targetPositioners.has(name)) {
			if (initialPosition == null) { //null or undefined (eqnull)
				initialPosition = defaultInitialPosition;
			}
			const vtp = new ViewportTargetPositioner(name, camera, initialPosition, pointOnGroundPlane, groundPlaneNormal);
			vtp.addPositionChangedCallback(this.notifyPositionChangedCallbacks);
			if(renderInScene!==null){
				vtp.installRendererIntoScene(renderInScene);
			}
			targetPositioners.set(name, vtp);
			if(selectedPositionerName === null){
				selectedPositionerName = name;
				vtp.setHighlighted(true);
			}else{
				vtp.setHighlighted(false);
			}
		}else{
			SLog(channel, "Not adding MouseTargetPositioner target "+name+", already have target with that name");
		}
	};

	this.removeTargetPositioner = function(name){
		if(targetPositioners.has(name)){
			const vtp = targetPositioners.get(name);
			if(renderInScene!==null){
				vtp.removeRendererFromScene(renderInScene);
			}
			vtp.removePositionChangedCallback(this.notifyPositionChangedCallbacks);
			targetPositioners.delete(name);
			if(selectedPositionerName === name){
				selectedPositionerName = null;
			}
		}
	};

	this.getTargetPositionerNames = function(){
		const names = [];
		const nameIter = targetPositioners.keys();
		let nextName;
		while(!(nextName = nameIter.next()).done){
			names.push(nextName.value);
		}
		return names;
	};

	/**
	 * @param {?string} name - name of target to select, null to deselect all
	 */
	this.selectTarget = function(name){
		if(selectedPositionerName != null){
			const currentlySelected = targetPositioners.get(selectedPositionerName);
			if(currentlySelected != null){
				currentlySelected.setHighlighted(false);
			}
		}
		if(name != null) {
			const newlySelected = targetPositioners.get(name);
			if (newlySelected != null) {
				newlySelected.setHighlighted(true);
			}
		}
		selectedPositionerName = name;
	};

	this.installRendererIntoScene = function(scene){
		if(renderInScene !== null){
			throw new Error("Remove MTP renderer from existing scene before installing in another!");
		}
		for(const vtp of targetPositioners.values()){
			vtp.installRendererIntoScene(scene);
		}
		renderInScene = scene;
	};

	this.removeRendererFromScene = function(scene){
		for(const vtp of targetPositioners.values()){
			vtp.removeRendererFromScene(scene);
		}
		renderInScene = null;
	};

	//set to default
	this.setMouseFilters();

	for(const installName of initialTargetNames){
		this.addTargetPositioner(installName);
	}

};





export default MouseTargetPositioner;
