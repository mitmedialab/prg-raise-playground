import AnimationLoader from "../ifr-motion/loaders/AnimationLoader.js";
import Motion from "../ifr-motion/base/Motion.js";
import AnnotatedMotion from "../ifr-motion/base/AnnotatedMotion.js";
import Pose from "../ifr-motion/base/Pose.js";
import RelativeTimeClip from "../ifr-motion/base/RelativeTimeClip.js";
import MotionEventIterator from "../ifr-motion/base/MotionEventIterator.js";
import LinearTransitionBuilder from "./LinearTransitionBuilderImpl.js";
import AccelerationTransitionBuilder from "./AccelerationTransitionBuilder.js";
import SingleLookatBuilder from "./SingleLookatBuilder.js";
import PoseMotionGenerator from "./timeline/PoseMotionGenerator.js";
import SimpleMotionGenerator from "./timeline/SimpleMotionGenerator.js";
import LoopedMotionGenerator from "./timeline/LoopedMotionGenerator.js";
import VariableSpeedMotionGenerator from "./timeline/VariableSpeedMotionGenerator.js";
import LookatBlendGenerator from "./timeline/LookatBlendGenerator.js";
import slog from "../ifr-core/SLog.js";
import RendererOutput from "../animation-visualize/RendererOutput.js";
import DOFSet from "../geometry-info/DOFSet.js";
import THREE from "@jibo/three";
import TimelineEventDispatcher from "./timeline/TimelineEventDispatcher.js";
import KinematicFeaturesReporter from "../ifr-motion/lookat/KinematicFeaturesReporter.js";
import PlaneDisplacementLookatDOF from "../ifr-motion/lookat/PlaneDisplacementLookatDOF.js";

/**
 * @type {Object.<string, AnimationLoadResult>}
 * @private
 */

const animationCache = {};
const animationLoader = new AnimationLoader();


/**
 * @method jibo.animate#createAnimationBuilder
 * @param {AnimationUtilities} animationUtilities - The associated animation utilities.
 * @param {string} uri - Location of animation file to load.
 * @param {AnimationBuilderCreatedCallback} cb - Callback; receives newly-created AnimationBuilder instance or null if creation/load failed.
 * @param {boolean} forceReload - If true, reloads from disk, even if cached (new value will be cached). Defaults to false.
 * @param {string} [layer] - Optional; layer to play to.
 * @param {AnimationBuilder~AnimationEventCallback} [globalAnimationDelegate]
 * @private
 */
const createAnimationBuilder = function(animationUtilities, uri, cb, forceReload, layer, globalAnimationDelegate) {

	const self = animationUtilities;

	animate.trajectory.getAnimation(uri, function(motion){
		let builder = null;
		if(motion){
			builder = new AnimationBuilder(self, self.timeline, motion, (self.defaultTransition === null)?null:self.defaultTransition.clone(), self.robotInfo, layer, globalAnimationDelegate);
		}
		if(cb){
			cb(builder);
		}
	}, forceReload);

};


/**
 * @description
 * Animation APIs
 *
 * All units of measure in SI (meters).
 *
 * ```
 * var animate = require("jibo").animate;
 * ```
 *
 * Loading and playback of scripted animations:
 * ```
 * var animPath = "some/path/dance.keys";  // path to animation file
 * var basePath = "some/path";             // base path for texture resolution
 *
 * animate.createAnimationBuilderFromKeysPath(animPath, basePath, (builder) => {
 *     // add listener
 *     builder.on(animate.AnimationEventType.STOPPED, (eventType, instance, payload) => {
 *         console.log("Animation stopped; was interrupted = " + payload.interrupted);
 *     });
 *
 *     // trigger an instance of the animation
 *     builder.play();
 * });
 *
 * ```
 *
 * Procedural lookat/orient behaviors:
 * ```
 * var target = new animate.THREE.Vector3(1.0, 0.0, 1.0);  // target position to look at
 *
 * var builder = animate.createLookatBuilder();
 * builder.startLookat(target);
 *
 * ```
 *
 * Utility methods, for example:
 * ```
 * animate.blink();  // blink the eye!
 * animate.setLEDColor([0.0, 0.0, 1.0]);  // set the LED color to blue
 * ```
 *
 * @namespace jibo.animate
 */
const AnimationUtilities = function()
{
};

/**
 * @method jibo.animate#init
 * @private
 * @param {MotionTimeline} timeline
 * @param {RobotInfo} robotInfo
 */
AnimationUtilities.prototype.init = function(timeline, robotInfo)
{
    const self = this;

    /** @type {MotionTimeline} */
    /** @private */
    this.timeline = timeline;

    /** @type {RobotInfo} */
    /** @private */
    this.robotInfo = robotInfo;

    /** @type {TransitionBuilder} */
    /** @private */
    this.defaultTransition = this.createAccelerationTransitionBuilder(3, 5);

    //setup default defaultTransition to be fast on eye dofs, medium on body dofs, fast on LED
    this.defaultTransition.setLimits(robotInfo.getBodyDOFNames(), 3, 5);
    this.defaultTransition.setLimits(robotInfo.getEyeDOFNames(), 20, 40);

    this.defaultTransition.setLimits(robotInfo.getDOFSet("EYE_COLOR").plus("OVERLAY_COLOR").plus("SCREEN_BG_COLOR").getDOFs(), 10000, 10000);

    this.defaultTransition.setLimits(robotInfo.getDOFSet("LED").getDOFs(), 10, 20);
    this.defaultTransition.setPreferValue(robotInfo.getDOFSet("EYE_VISIBILITY").plus("OVERLAY_VISIBILITY").getDOFs(), 0);

    /** @type {AnimationBuilder~AnimationEventCallback[]} */
    /** @private */
    this.globalAnimationListeners = [];
    /** @type {LookatBuilder~LookatEventCallback[]} */
    /** @private */
    this.globalLookatListeners = [];

    /** @type {AnimationBuilder~AnimationEventCallback} */
    /** @private */
    this.globalAnimationDelegate = function(eventType, instance, payload){
        for (let i=0; i<self.globalAnimationListeners.length; i++){
            self.globalAnimationListeners[i](eventType, instance, payload);
        }
    };
    /** @type {LookatBuilder~LookatEventCallback} */
    /** @private */
    this.globalLookatDelegate = function(eventType, instance, payload){
        for (let i=0; i<self.globalLookatListeners.length; i++){
            self.globalLookatListeners[i](eventType, instance, payload);
        }
    };

    this.blinkBuilder = null;
    this.blinkInProgress = false;
    createAnimationBuilder(this, robotInfo.getConfig().getRobotURL()+"jibo_blink.anim", function(bb){
        bb.setTransitionIn(null);
        bb.on(animate.AnimationEventType.STOPPED, function(){
            self.blinkInProgress = false;
        });
        bb.on(animate.AnimationEventType.CANCELLED, function(){
            self.blinkInProgress = false;
        });
        self.blinkBuilder = bb;
    }, false, "blink", this.globalAnimationDelegate);

    /** @type {?Time} */
    this.kinematicFeatureGenerationTime = null;
    /** @type {?Object.<string,{position: THREE.Vector3, direction: THREE.Vector3}>} */
    this.kinematicFeatureComputed = null;
    /** @type {KinematicFeaturesReporter} */
    this.kinematicFeaturesReporter = new KinematicFeaturesReporter(robotInfo.getKinematicInfo().getFullKinematicGroup(), [
        new KinematicFeaturesReporter.VectorFeatureReporter(
            "Base",
            robotInfo.getKinematicInfo().getFullKinematicGroup().getModelControlGroup().getControlForDOF(SingleLookatBuilder.LookatDOFGeometryConfig["BaseLookatDOF"].DOFName).getTransformName(),
            new THREE.Vector3(0,0,0),
            SingleLookatBuilder.LookatDOFGeometryConfig["BaseLookatDOF"].Forward),
        new KinematicFeaturesReporter.VectorFeatureReporter(
            "Head",
            SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].CentralTransformName,
            new THREE.Vector3(0,0,0),
            SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].Forward),
        new KinematicFeaturesReporter.PlaneDisplacementVectorReporter(
            "Eye", new PlaneDisplacementLookatDOF(
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].LookatDOFName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].DOFName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].CentralTransformName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].Forward,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].PlaneNormal,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].InternalDistance,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].MinValue,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeLeftRight"].MaxValue
            ), new PlaneDisplacementLookatDOF(
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].LookatDOFName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].DOFName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].CentralTransformName,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].Forward,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].PlaneNormal,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].InternalDistance,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].MinValue,
                SingleLookatBuilder.LookatDOFGeometryConfig["EyeUpDown"].MaxValue
            )
        )
    ]);

    /** @type {string[]} */
    /** @private */
    this.dofIndicesToNames = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames();
    /** @type {Object.<string, number>} */
    /** @private */
    this.dofNamesToIndices = robotInfo.getKinematicInfo().getDefaultPose().getDOFNamesToIndices();

    /**
     * Commonly-used DOF groups for use with [AnimationBuilder.setDOFs]{@link jibo.animate.AnimationBuilder#setDOFs}
     * or [LookatBuilder.setDOFs]{@link jibo.animate.LookatBuilder#setDOFs}.
     * @enum {jibo.animate.DOFSet}
     * @memberof jibo.animate
     */
    const dofs = {
        /**
         * Complete set of robot DOFs.
         */
        ALL: robotInfo.getDOFSet("ALL"),
        /**
         * Base motor only.
         */
        BASE: robotInfo.getDOFSet("BASE"),
        /**
         * All body motors.
         */
        BODY: robotInfo.getDOFSet("BODY"),
        /**
         * All eye DOFs (transform, color, texture, visibility).
         */
        EYE: robotInfo.getDOFSet("EYE"),
        /**
         * Light ring LED color.
         */
        LED: robotInfo.getDOFSet("LED"),
        /**
         * All overlay DOFs (transform, color, texture, visibility).
         */
        OVERLAY: robotInfo.getDOFSet("OVERLAY"),
        /**
         * All screen DOFs (eye, overlay, background).
         */
        SCREEN: robotInfo.getDOFSet("SCREEN"),
        /**
         * Eye translation + rotation.
         */
        EYE_ROOT: robotInfo.getDOFSet("EYE_ROOT"),
        /**
         * Eye scale/deformation.
         */
        EYE_DEFORM: robotInfo.getDOFSet("EYE_DEFORM"),
        /**
         * Eye color, texture, and visibility.
         */
        EYE_RENDER: robotInfo.getDOFSet("EYE_RENDER"),
        /**
         * Eye translation only.
         */
        EYE_TRANSLATE: robotInfo.getDOFSet("EYE_TRANSLATE"),
        /**
         * Eye rotation only.
         */
        EYE_ROTATE: robotInfo.getDOFSet("EYE_ROTATE"),
        /**
         * Eye color only.
         */
        EYE_COLOR: robotInfo.getDOFSet("EYE_COLOR"),
        /**
         * Eye texture only.
         */
        EYE_TEXTURE: robotInfo.getDOFSet("EYE_TEXTURE"),
        /**
         * Eye visibility only.
         */
        EYE_VISIBILITY: robotInfo.getDOFSet("EYE_VISIBILITY"),
        /**
         * Overlay translation + rotation.
         */
        OVERLAY_ROOT: robotInfo.getDOFSet("OVERLAY_ROOT"),
        /**
         * Overlay scale/deformation.
         */
        OVERLAY_DEFORM: robotInfo.getDOFSet("OVERLAY_DEFORM"),
        /**
         * Overlay color, texture, and visibility.
         */
        OVERLAY_RENDER: robotInfo.getDOFSet("OVERLAY_RENDER"),
        /**
         * Overlay translation only.
         */
        OVERLAY_TRANSLATE: robotInfo.getDOFSet("OVERLAY_TRANSLATE"),
        /**
         * Overlay rotation only.
         */
        OVERLAY_ROTATE: robotInfo.getDOFSet("OVERLAY_ROTATE"),
        /**
         * Overlay color only.
         */
        OVERLAY_COLOR: robotInfo.getDOFSet("OVERLAY_COLOR"),
        /**
         * Overlay texture only.
         */
        OVERLAY_TEXTURE: robotInfo.getDOFSet("OVERLAY_TEXTURE"),
        /**
         * Overlay visibility only.
         */
        OVERLAY_VISIBILITY: robotInfo.getDOFSet("OVERLAY_VISIBILITY"),
        /**
         * Screen background color + texture.
         */
        SCREEN_BG_RENDER: robotInfo.getDOFSet("SCREEN_BG_RENDER"),
        /**
         * Screen background color only.
         */
        SCREEN_BG_COLOR: robotInfo.getDOFSet("SCREEN_BG_COLOR"),
        /**
         * Screen background texture only.
         */
        SCREEN_BG_TEXTURE: robotInfo.getDOFSet("SCREEN_BG_TEXTURE")
    };
    this.dofs = dofs;

    /** @type {LookatBlendGenerator} */
    /** @private */
    this.lookatBlendGenerator = new LookatBlendGenerator(this, this.timeline.getClock().currentTime());
    this.timeline.add(this.lookatBlendGenerator, "lookat");
};

/**
 * Gets the robot configuration info used by the animate module,
 * including DOF names, default values, and other geometric info.
 * @method jibo.animate#getRobotInfo
 * @return {jibo.animate.RobotInfo}
 */
AnimationUtilities.prototype.getRobotInfo = function() {
	return this.robotInfo;
};

/**
 * Gets the high-precision clock used by the animate module.
 * @method jibo.animate#getClock
 * @return {jibo.animate.Clock}
 */
AnimationUtilities.prototype.getClock = function() {
	return this.timeline.getClock();
};

/**
 * @callback jibo.animate~AnimationBuilderCreatedCallback
 * @param {jibo.animate.AnimationBuilder} animationBuilder - The AnimationBuilder or null on failure
 */


 /**
  * Creates an animation builder from a .anim file at the specified uri. The animation will be loaded first if
  * necessary. This builder can be used for configuring animation parameters and inserting
  * an instance into the timeline.
  * @method jibo.animate#createAnimationBuilder
  * @param {string} uri - Path to the .anim file.
  * @param {jibo.animate~AnimationBuilderCreatedCallback} cb - Callback; receives newly-created [AnimationBuilder]{@link jibo.animate.AnimationBuilder}, or null if creation/load failed.
  * @param {?boolean} [forceReload] - If true, reloads from disk even if cached (new value will be cached). Defaults to false.
  */
AnimationUtilities.prototype.createAnimationBuilder = function(uri, cb, forceReload) {

	createAnimationBuilder(this, uri, cb, forceReload, "default", this.globalAnimationDelegate);

};


/**
 * Creates an animation builder from a pre-loaded (or pre-assembled) animation data structure.
 * This builder can be used for configuring animation parameters and inserting
 * an instance into the timeline.
 * The animation data object must match the structure specified for on-disk (.anim) animation files.
 * @method jibo.animate#createAnimationBuilderFromData
 * @param {Object} animationData - The animation data object.
 * @param {string} [parentDirectoryURI] - Optional; if present, texture paths will be resolved relative to the specified directory.
 * @param {string} [cacheKey] - Optional; if present, results will be cached using the specified key.
 * @return {jibo.animate.AnimationBuilder} The newly-created AnimationBuilder instance, or null if creation failed.
 */

AnimationUtilities.prototype.createAnimationBuilderFromData = function(animationData, parentDirectoryURI, cacheKey) {

	const motion = animate.trajectory.parseAnimation(animationData, parentDirectoryURI, cacheKey);
	if(motion){
		return new AnimationBuilder(this, this.timeline, motion, (this.defaultTransition === null)?null:this.defaultTransition.clone(), this.robotInfo, "default", this.globalAnimationDelegate);
	}else{
		return null;
	}

};

/**
 * Creates an animation builder from a static pose.
 * @private
 * @param {string} name - The name for the animation.
 * @param {Object.<string, Object>|Pose} pose - The static DOF values to use for the animation.
 * @param {jibo.animate.DOFSet|string[]} [dofs] - The set of DOFs to use in the animation.  Defaults to all DOFs in the pose.
 * @return {jibo.animate.AnimationBuilder} The newly-created AnimationBuilder instance, or null if creation failed.
 */
AnimationUtilities.prototype.createAnimationBuilderFromPose = function(name, pose, dofs)
{
    let dofNames = null;
    if (dofs !== undefined && dofs !== null)
    {
        if (dofs instanceof DOFSet)
        {
            dofNames = dofs.getDOFs();
        }
        else
        {
            dofNames = dofs;
        }
    }

    const duration = 1/30;
    let motion;
    if (pose instanceof Pose)
    {
        motion = Motion.createFromPose(name, pose, duration, dofNames);
    }
    else
    {
        motion = Motion.createFromDOFValues(name, pose, duration, dofNames);
    }

    return new AnimationBuilder(this, this.timeline, new AnnotatedMotion(motion), this.defaultTransition.clone(), this.robotInfo, "default", this.globalAnimationDelegate);
};

const BlinkDelegate = function(animationUtilities){
	this._bFunc = animationUtilities.blink.bind(animationUtilities);
};

BlinkDelegate.prototype.blink = function(interrupt, speed){
	TimelineEventDispatcher.queueEvent(this._bFunc, [interrupt, speed]);
};

/**
 * Creates a builder for initiating lookat actions. This builder can be used for configuring a lookat
 * behaviors and inserting an instance of that lookat into the timeline.
 * @method jibo.animate#createLookatBuilder
 * @return {jibo.animate.LookatBuilder}
 */
AnimationUtilities.prototype.createLookatBuilder = function()
{
	return new SingleLookatBuilder(this, this.timeline, this.robotInfo, (this.defaultTransition === null)?null:this.defaultTransition.clone(), this.globalLookatDelegate, new BlinkDelegate(this));
};

/**
 * Animates Jibo's eye to blink once.
 * @method jibo.animate#blink
 * @param [interrupt] {boolean} Set to true to interrupt an ongoing blink. Set to false (default) to ignore blink calls during an ongoing blink.
 * @param [speed] {number} blink speed, defaults to 1
 */
AnimationUtilities.prototype.blink = function(interrupt, speed)
{
	if(this.blinkBuilder!=null){
		if(this.blinkInProgress === false || interrupt === true) {
			if(speed === null || speed === undefined){
				speed = 1;
			}
			if(this.blinkBuilder.clip.getSpeed() !== speed) {
				this.blinkBuilder.setSpeed(speed);
			}
			this.blinkBuilder.play();
			this.blinkInProgress = true;
		}
	}else{
		slog.warn("Blink requested but blink builder not yet loaded");
	}
};

/**
 * Stop all degrees of freedom motion on time-line
 * @method jibo.animate#stopAll
 * @private
 */
AnimationUtilities.prototype.stopAll = function()
{
	//TODO
};

/**
 * Convenience call that sets opacity of eye and overlay to 0% or 100%.
 * @method jibo.animate#setEyeVisible
 * @param {boolean} visible Set to true to make the eye visible (default). Set to false to make the eye invisible.
 */
AnimationUtilities.prototype.setEyeVisible = function(visible)
{
	var eyeVisibilityDOF = this.robotInfo.getDOFSet("EYE_VISIBILITY").getDOFs()[0];
	var overlayVisibilityDOF = this.robotInfo.getDOFSet("OVERLAY_VISIBILITY").getDOFs()[0];
	var opaqueVal = 1.0;
	var clearVal = 0.0;

	var eyePose = new Pose("eye visibility pose", [eyeVisibilityDOF, overlayVisibilityDOF]);
	eyePose.set(eyeVisibilityDOF, (visible ? opaqueVal : clearVal), 0);
	eyePose.set(overlayVisibilityDOF, (visible ? opaqueVal : clearVal), 0);

	var startTime = this.timeline.getClock().currentTime();
	this.timeline.add(new PoseMotionGenerator(this, "eye visibility motion", startTime, eyePose, 0.5), "default");

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", null, {dofs: eyePose.getDOFNames(), layer: "default", instant: "setEyeVisible instant"});
	}
};

/**
 * Convenience call that scales Jibo's eye to provided value, preserving proportions.
 * @method jibo.animate#setEyeScale
 * @param {number} scale Number to scale Jibo's eye size by.
 */
AnimationUtilities.prototype.setEyeScale = function(scale)
{
	var eyeDeformers = this.robotInfo.getDOFSet("EYE_DEFORM").plus("OVERLAY_DEFORM").getDOFs();
	var defaultPose = this.robotInfo.getKinematicInfo().getDefaultPose();
	var eyePose = new Pose("eye pose", eyeDeformers);
	for (var i=0; i<eyeDeformers.length; i++)
	{
		eyePose.set(eyeDeformers[i], defaultPose.get(eyeDeformers[i], 0) * scale, 0);
	}
	var startTime = this.timeline.getClock().currentTime();
	this.timeline.add(new PoseMotionGenerator(this, "eye scale motion", startTime, eyePose, 0.5), "default");

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", null, {dofs: eyePose.getDOFNames(), layer: "default", instant: "setEyeScale instant"});
	}
};

/**
 * Convenience call that scales Jibo's eye by the specified x and y scale components.
 * @param {number} xScale - Desired x-axis scale.
 * @param {number} yScale - Desired y-axis scale.
 * @method jibo.animate#setEyeScaleXY
 */
AnimationUtilities.prototype.setEyeScaleXY = function(xScale, yScale)
{
	var eyeDeformers = this.robotInfo.getDOFSet("EYE_DEFORM").plus("OVERLAY_DEFORM").getDOFs();
	var defaultPose = this.robotInfo.getKinematicInfo().getDefaultPose();
	var eyePose = new Pose("eye pose", eyeDeformers);
	for (var i=0; i<eyeDeformers.length; i++)
	{
		if (eyeDeformers[i].indexOf("_t_2") > -1)
		{
			eyePose.set(eyeDeformers[i], defaultPose.get(eyeDeformers[i], 0) * yScale, 0);
		}
		else
		{
			eyePose.set(eyeDeformers[i], defaultPose.get(eyeDeformers[i], 0) * xScale, 0);
		}
	}
	var startTime = this.timeline.getClock().currentTime();
	this.timeline.add(new PoseMotionGenerator(this, "eye scale motion", startTime, eyePose, 0.5), "default");

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", null, {dofs: eyePose.getDOFNames(), layer: "default", instant: "setEyeScaleXY instant"});
	}
};

/**
 * Convenience call that sets eye position to given x, y.
 * @param {number} x Desired x position of the eye in meters.
 * @param {number} y Desired y position of the eye in meters.
 * @method jibo.animate#setEyePosition
 */
AnimationUtilities.prototype.setEyePosition = function(x, y)
{
	var eyeXYDOFs = this.robotInfo.getDOFSet("EYE_TRANSLATE").getDOFs();
	var overlayXYDOFs = this.robotInfo.getDOFSet("OVERLAY_TRANSLATE").getDOFs();
	var eyePose = new Pose("eye pose", eyeXYDOFs.concat(overlayXYDOFs));
	eyePose.set(eyeXYDOFs[0], x, 0);
	eyePose.set(eyeXYDOFs[1], y, 0);
	eyePose.set(overlayXYDOFs[0], x, 0);
	eyePose.set(overlayXYDOFs[1], y, 0);
	var startTime = this.timeline.getClock().currentTime();
	this.timeline.add(new PoseMotionGenerator(this, "eye position motion", startTime, eyePose, 0.5), "default");

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", null, {dofs: eyePose.getDOFNames(), layer: "default", instant: "setEyePosition instant"});
	}
};

/**
 * Convenience call that sets the LED light ring color.  Pass in either
 * a THREE.Color, or an array of three numbers (r,g,b) from 0 to 1.
 * @method jibo.animate#setLEDColor
 * @param {THREE.Color|number[]} color Color to set the LED light ring to.
 */
AnimationUtilities.prototype.setLEDColor = function(color)
{
	/** @type {number[]} */
	var rgbValues = null;
	if(Array.isArray(color)){
		rgbValues = color;
	}else{
		rgbValues = color.toArray();
	}
	var dofNames = this.robotInfo.getDOFSet("LED").getDOFs();
	var colorPose = new Pose("LED pose", dofNames);
	for (var i=0; i<3; i++)
	{
		colorPose.set(dofNames[i], rgbValues[i], 0);
	}
	var startTime = this.timeline.getClock().currentTime();
	this.timeline.add(new PoseMotionGenerator(this, "LED motion", startTime, colorPose, 0.5), "default");

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", null, {dofs: colorPose.getDOFNames(), layer: "default", instant: "setLEDColor instant"});
	}
};

/**
 * Restores the robot to its default pose, respecting current base orientation.
 *
 * Optional arguments allow specification of which DOFs to include in the centering behavior and
 * whether the centering behavior should restore the robot to its global "home" orientation. By default, the
 * centering behavior will include all DOFs and will preserve the robot's current local orientation.
 * @method jibo.animate#centerRobot
 * @param {jibo.animate.DOFSet} [whichDOFs] - Set of DOFs to restore to default position. Defaults to all DOFs.
 * @param {boolean} [centerGlobally=false] - If `true`, also restores the robot to its global "home" orientation.
 * @param {Function} [completionCallback] - Called when centering behavior completes or is interrupted.
 * @deprecated since 7.0.0
 * @see {@link jibo.dofarbiter#centerRobot}
 */
AnimationUtilities.prototype.centerRobot = function(whichDOFs, centerGlobally, completionCallback)
{
	console.warn("Deprecation Warning: jibo.animate.centerRobot is deprecated, please use jibo.dofArbiter.centerRobot instead.");

	if (whichDOFs === undefined || whichDOFs === null) whichDOFs = this.dofs.ALL;
	if (centerGlobally === undefined || centerGlobally === null) centerGlobally = false;

	var centerMotion = Motion.createFromPose("center motion", this.robotInfo.getKinematicInfo().getDefaultPose(), 1/30, whichDOFs.getDOFs());
	var animBuilder = new AnimationBuilder(this, this.timeline, new AnnotatedMotion(centerMotion), this.defaultTransition.clone(), this.robotInfo, "default", this.globalAnimationDelegate);
	var builderCount = 1;

	var resetBase = centerGlobally && whichDOFs.hasDOF(this.dofs.BASE.getDOFs()[0]);
	var lookatBuilder = null;
	if (resetBase)
	{
		lookatBuilder = this.createLookatBuilder();
		lookatBuilder.setDOFs(this.dofs.BASE);
		builderCount++;
	}

	if (completionCallback)
	{
		var builderFinished = function()
		{
			builderCount--;
			if (builderCount === 0)
			{
				completionCallback();
			}
		};
		animBuilder.on(animate.AnimationEventType.CANCELLED, builderFinished);
		animBuilder.on(animate.AnimationEventType.STOPPED, builderFinished);
		if (lookatBuilder)
		{
			lookatBuilder.on(animate.LookatEventType.CANCELLED, builderFinished);
			lookatBuilder.on(animate.LookatEventType.STOPPED, builderFinished);
		}
	}

	animBuilder.play();
	if (lookatBuilder)
	{
		lookatBuilder.startLookat(new THREE.Vector3(1.0, 0.0, 0.0));
	}
};

/**
 * Get the world coordinates of important kinematic features on the robot (based on the most recent desired
 * robot position).
 * @method jibo.animate#getKinematicFeatures
 * @return {Object.<string,{position: THREE.Vector3, direction: THREE.Vector3}>}
 */
AnimationUtilities.prototype.getKinematicFeatures = function(){
	var state = this.timeline.getCurrentState();

	if(this.kinematicFeatureGenerationTime === null || state.getTime().isGreater(this.kinematicFeatureGenerationTime)){
		this.kinematicFeatureGenerationTime = state.getTime();
		this.kinematicFeatureComputed = this.kinematicFeaturesReporter.computeFeatures(state.getPose());
	}
	return this.kinematicFeatureComputed;
};

/**
 * Sets the TransitionBuilder that the animate module will use by default to generate procedural transitions
 * between animations or static poses that require intermediate motion.
 * @method jibo.animate#setDefaultTransition
 * @param {jibo.animate.TransitionBuilder} transition - The TransitionBuilder to use as the new default.
 * @private
 */
AnimationUtilities.prototype.setDefaultTransition = function(transition) {
	this.defaultTransition = transition;
};

/**
 * Gets the default TransitionBuilder used by the animate module for procedural transitions.
 * @method jibo.animate#getDefaultTransition
 * @return {jibo.animate.TransitionBuilder}
 */
AnimationUtilities.prototype.getDefaultTransition = function() {
	return this.defaultTransition;
};

/**
 * Creates a new transition builder that uses simple linear blending to generate transition motions.
 * @method jibo.animate#createLinearTransitionBuilder
 * @return {jibo.animate.LinearTransitionBuilder} A new, configurable linear transition builder.
 */
AnimationUtilities.prototype.createLinearTransitionBuilder = function() {
	return animate.trajectory.createLinearTransitionBuilder(this.robotInfo);
};

/**
 * Creates a new transition builder that can generate transition motions using
 * configurable acceleration and velocity limits.
 * @method jibo.animate#createAccelerationTransitionBuilder
 * @param {number} defaultMaxVelocity - Max velocity to use by default.
 * @param {number} defaultMaxAcceleration - Max acceleration to use by default.
 * @return {jibo.animate.AccelerationTransitionBuilder} A new, configurable acceleration transition builder.
 */
AnimationUtilities.prototype.createAccelerationTransitionBuilder = function(defaultMaxVelocity, defaultMaxAcceleration) {
	return animate.trajectory.createAccelerationTransitionBuilder(this.robotInfo, defaultMaxVelocity, defaultMaxAcceleration);
};

/**
 * Gets all RobotRenderers associated with the provided timeline.
 * @method jibo.animate#getRenderers
 * @param {MotionTimeline} timeline
 * @return {jibo.visualize.RobotRenderer[]} renderers
 * @private
 */
function getRenderers(timeline){
    /** @type {RobotRenderer[]} */
    let renderers = [];

    const outputs = timeline.getOutputs();
    for (let i=0; i<outputs.length; i++){
        if (outputs[i] instanceof RendererOutput){
            renderers = renderers.concat(outputs[i].getRenderers());
        }
    }
    return renderers;
}


/**
 * Installs this render plugin. If a plugin with the same name is already installed, that
 * plugin will be uninstalled first.
 * @method jibo.animate#installRenderPlugin
 * @param {jibo.visualize.RenderPlugin} renderPlugin - Plugin to install.
 */
AnimationUtilities.prototype.installRenderPlugin = function(renderPlugin){
	/** @type {RobotRenderer[]} */
	var renderers = getRenderers(this.timeline);
	for(var i = 0; i < renderers.length; i++){
		renderers[i].installRenderPlugin(renderPlugin);
	}
};

/**
 * Removes named RenderPlugin. [uninstall()]{@link jibo.visualize.RenderPlugin#uninstall} will be called on the plugin.
 * @method jibo.animate#removeRenderPlugin
 * @param {string} renderPluginName RenderPlugin to remove.
 */
AnimationUtilities.prototype.removeRenderPlugin = function(renderPluginName){
	/** @type {RobotRenderer[]} */
	var renderers = getRenderers(this.timeline);
	for(var i = 0; i < renderers.length; i++){
		renderers[i].removeRenderPlugin(renderPluginName);
	}
};

/**
 * Gets the names of all installed RenderPlugins.
 * @method jibo.animate#getInstalledRenderPluginNames
 * @returns {string[]}
 */
AnimationUtilities.prototype.getInstalledRenderPluginNames = function(){
	/** @type {string[]} */
	var pluginNames = [];

	/** @type {RobotRenderer[]} */
	var renderers = getRenderers(this.timeline);
	for(var i = 0; i < renderers.length; i++){
		var partialNames = renderers[i].getInstalledRenderPluginNames();
		for(var j = 0; j < partialNames.length; j++){
			//don't duplicate names
			if(pluginNames.indexOf(partialNames[j])<0){
				pluginNames.push(partialNames[j]);
			}
		}
	}

	return pluginNames;
};

/**
 * Adds a global animation event listener.
 * @param {AnimationBuilder~AnimationEventCallback} listener
 * @method jibo.animate#addGlobalAnimationListener
 * @private
 */
AnimationUtilities.prototype.addGlobalAnimationListener = function(listener){
	if (this.globalAnimationListeners.indexOf(listener) === -1){
		this.globalAnimationListeners.push(listener);
	}
};

/**
 * Removes a global animation event listener.
 * @method jibo.animate#removeGlobalAnimationListener
 * @param {AnimationBuilder~AnimationEventCallback} listener
 * @private
 */
AnimationUtilities.prototype.removeGlobalAnimationListener = function(listener){
	var index = this.globalAnimationListeners.indexOf(listener);
	if (index !== -1){
		this.globalAnimationListeners.splice(index, 1);
	}
};

/**
 * Adds a global lookat event listener.
 * @param {LookatBuilder~LookatEventCallback} listener
 * @method jibo.animate#addGlobalLookatListener
 * @private
 */
AnimationUtilities.prototype.addGlobalLookatListener = function(listener){
	if (this.globalLookatListeners.indexOf(listener) === -1){
		this.globalLookatListeners.push(listener);
	}
};

/**
 * Removes a global lookat event listener.
 * @param {LookatBuilder~LookatEventCallback} listener
 * @method jibo.animate#removeGlobalLookatListener
 * @private
 */
AnimationUtilities.prototype.removeGlobalLookatListener = function(listener){
	var index = this.globalLookatListeners.indexOf(listener);
	if (index !== -1){
		this.globalLookatListeners.splice(index, 1);
	}
};




/**
 * Protected constructor for internal use only.
 *
 * An AnimationInstance is a handle for an ongoing instance of a specific, configured animation.
 * AnimationInstances are returned by AnimationBuilder's [play]{@link jibo.animate.AnimationBuilder#play} method.
 *
 * @param {jibo.animate.AnimationBuilder} builder - Protected constructor parameter.
 * @param {MotionGenerator} transitionClip - Protected constructor parameter.
 * @param {VariableSpeedMotionGenerator} animationClip - Protected constructor parameter.
 * @param {string} layer - Protected constructor parameter.
 * @param {string} name - Protected constructor parameter.
 * @protected
 * @class AnimationInstance
 * @memberof jibo.animate
 */
const AnimationInstance = function(builder, transitionClip, animationClip, layer, name)
{
    /** @type {AnimationBuilder} */
    /** @private */
    this.builder = builder;
    /** @type {MotionGenerator} */
    /** @private */
    this.transitionClip = transitionClip;
    /** @type {VariableSpeedMotionGenerator} */
    /** @private */
    this.animationClip = animationClip;
    /** @type {string} */
    /** @private */
    this.layer = layer;
    /** @type {string} */
    /** @private */
    this.name = name;
    /** @type {boolean} */
    /** @private */
    this.paused = false;
    /** @type {number} */
    /** @private */
    this.speedAtPause = 1;
};

/**
 * Stops this animation instance.
 * @method jibo.animate.AnimationInstance#stop
 */
AnimationInstance.prototype.stop = function()
{
	var timeline = this.builder.timeline;
	/** @type {jibo.animate.Time} */
	var stopTime = timeline.getClock().currentTime();

	//if all clips are fully committed, we will not stop
	if(!this.animationClip.endsAfter(stopTime)){
		//stopTime is after clip is already over; cannot stop.  do nothing.
		slog.warn("Ignoring stop on " + this.animationClip.getName() + " as it is already over");
		return;
	}

	//however we will not stop before any of the clips start!
	if(this.transitionClip === null){
		//there is no transition, our first stop opportunity is at the start of the main clip
		if(this.animationClip.getStartTime().isGreater(stopTime)){
			stopTime = this.animationClip.getStartTime();
			slog.info("Stopping called on transitionless animation "+this.animationClip.getName()+" before anim started, moving stopTime forward");
		}
	}else{
		if(this.transitionClip.getStartTime().isGreater(stopTime)){
			stopTime = this.transitionClip.getStartTime();
			slog.info("Stopping called on animation "+this.animationClip.getName()+" before its transition started, moving stopTime forward");
		}
	}

	/** @type {MotionGenerator} */
	var useClip = null;

	//now find out which dofs are being used on stop time
	if(this.transitionClip !== null && this.transitionClip.endsAfter(stopTime)){
		//we have a transition clip, and our stop time is before the end of it, so we should
		//use that clip for the stop pose
		useClip = this.transitionClip;
	}else{
		//we don't have a transition clip, or our stop time is after the end of it, so use anim
		useClip = this.animationClip;
	}

	/** @type {string[]} */
	var dofsToStop = [];

	/** @type {number[]} */
	var possibleDOFs = useClip.getDOFIndices();

	for(var i = 0; i < possibleDOFs.length; i++){
		if(useClip.dofEndsAfter(possibleDOFs[i], stopTime)){
			dofsToStop.push(this.builder.animUtils.dofIndicesToNames[possibleDOFs[i]]);
		}
	}

	//TODO: using zero-duration motion for now, might want to add explicit timeline stop() method

	/** @type {Pose} */
	var stopPose = new Pose("stop pose", dofsToStop);
	for(var d = 0; d < dofsToStop.length; d++){
		stopPose.set(dofsToStop[d], [0]);
	}

	/** @type {Motion} */
	var stopMotion = Motion.createFromPose(useClip.getName()+"_stop", stopPose, 0);
	var stopClip = new SimpleMotionGenerator(this.builder.animUtils, stopMotion, stopTime, this.builder.robotInfo);
	timeline.add(stopClip, this.layer);
};

/**
 * Get the start time for the animation's 'in' transition, or the start time for
 * the animation itself, if no 'in' transition is specified.
 * @method jibo.animate.AnimationInstance#getTransitionStartTime
 * @return {jibo.animate.Time}
 */
AnimationInstance.prototype.getTransitionStartTime = function()
{
	if (this.transitionClip)
	{
		return this.transitionClip.getStartTime();
	}
	else
	{
		return this.animationClip.getStartTime();
	}
};

/**
 * Gets the estimated start time for the animation, following its
 * 'in' transition, if applicable.
 * @method jibo.animate.AnimationInstance#getAnimationStartTime
 * @return {jibo.animate.Time}
 */
AnimationInstance.prototype.getAnimationStartTime = function()
{
	return this.animationClip.getStartTime();
};

/**
 * Gets the estimated end time for the animation.
 * @method jibo.animate.AnimationInstance#getAnimationEndTime
 * @return {jibo.animate.Time}
 * @deprecated
 */
AnimationInstance.prototype.getAnimationEndTime = function()
{
	console.warn("Deprecation Warning: AnimationInstance.getAnimationEndTime is deprecated, please use animation STOPPED/CANCELLED events instead.");
	console.warn(new Error().stack);
	return this.getAnimationStartTime().add(this.builder.getConfiguredAnimationDuration());
};

/**
 * Gets the AnimationBuilder that generated this instance through "play".
 * @method jibo.animate.AnimationInstance#getBuilder
 * @return {jibo.animate.AnimationBuilder}
 */
AnimationInstance.prototype.getBuilder = function()
{
	return this.builder;
};

/**
 * Gets a descriptive name for this instance.
 * @method jibo.animate.AnimationInstance#getName
 * @return {string} The name for this instance.
 */
AnimationInstance.prototype.getName = function()
{
	return this.name;
};

/**
 * Pauses or unpauses this animation instance.
 * @method jibo.animate.AnimationInstance#setPaused
 * @param {boolean} shouldPause - True if the animation should pause, false if it should resume.
 */
AnimationInstance.prototype.setPaused = function(shouldPause)
{
	if (shouldPause && !this.paused)
	{
		// pause!
		this.speedAtPause = this.animationClip.getSpeed();
		this.animationClip.setSpeed(0);
		this.paused = true;
	}
	else if (!shouldPause && this.paused)
	{
		// unpause!
		this.animationClip.setSpeed(this.speedAtPause);
		this.paused = false;
	}
};


/**
 * Protected constructor for internal use only.
 *
 * An AnimationBuilder is used to configure parameters and register event
 * listeners for a specific chunk of animation data. Instances of the configured
 * animation can be triggered via the [play]{@link jibo.animate.AnimationBuilder#play} method.
 *
 * AnimationBuilders are typically created via the animate module's
 * [createAnimationBuilderFromKeysPath]{@link jibo.animate#createAnimationBuilderFromKeysPath} method.
 *
 * ```
 * var animate = require("jibo").animate;
 *
 * var animPath = "some/path/dance.keys";  // path to animation file
 * var basePath = "some/path";             // base path for texture resolution
 *
 * animate.createAnimationBuilderFromKeysPath(animPath, basePath, (builder) => {
 *     // add listener
 *     builder.on(animate.AnimationEventType.STOPPED, (eventType, instance, payload) => {
 *         console.log("Animation stopped; was interrupted = " + payload.interrupted);
 *     });
 *
 *     // trigger an instance of the animation
 *     builder.play();
 * });
 *
 * ```
 *
 * @param {AnimationUtilities} animUtils - Protected constructor parameter.
 * @param {MotionTimeline} timeline - Protected constructor parameter.
 * @param {AnnotatedMotion} motion - Protected constructor parameter.
 * @param {jibo.animate.TransitionBuilder} transition - Protected constructor parameter.
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @param {string} [layer] - Protected constructor parameter.
 * @param {jibo.animate.AnimationBuilder~AnimationEventCallback} [globalAnimationDelegate] - Protected constructor parameter.
 * @class AnimationBuilder
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
const AnimationBuilder = function(animUtils, timeline, motion, transition, robotInfo, layer, globalAnimationDelegate)
{
    if(layer == null){ //null or undefined
        layer = "default";
    }
    /** @private */
    this.layer = layer;

    /** @type {AnimationUtilities} */
    /** @private */
    this.animUtils = animUtils;
    /** @type {MotionTimeline} */
    /** @private */
    this.timeline = timeline;
    /** @type {AnnotatedMotion} */
    /** @private */
    this.motion = motion;
    /** @type {string[]} */
    /** @private */
    this.dofNames = motion.getMotion().getDOFs();
    /** @type {Object<AnimationEventType,AnimationEventCallback[]>} */
    /** @private */
    this.eventHandlers = {};
    /** @type {RelativeTimeClip} */
    /** @private */
    this.clip = new RelativeTimeClip(0, motion.getMotion().getDuration(), 1);
    /** @type {number} */
    /** @private */
    this.numLoops = 1;
    /** @type {TransitionBuilder} */
    /** @private */
    this.transition = transition;

    /** @type {boolean} */
    /** @private */
    this.stopOrient = false;

    /** @type {string[]} */
    /** @private */
    this.layerDOFs = timeline.getDOFsForLayer(layer);

    /** @type {RobotInfo} */
    /** @private */
    this.robotInfo = robotInfo;

    /** @type {AnimationBuilder~AnimationEventCallback} */
    /** @private */
    this.globalAnimationDelegate = globalAnimationDelegate;

    //init to all dofs
    this.setDOFs(null);
};

/**
 * Removes all event listeners and resets this builder to default settings.
 * @method jibo.animate.AnimationBuilder#reset
 */
AnimationBuilder.prototype.reset = function()
{
	this.layer = "default";
	this.layerDOFs = this.timeline.getDOFsForLayer(this.layer);
	this.dofNames = this.motion.getMotion().getDOFs();
	this.eventHandlers = {};
	this.clip = new RelativeTimeClip(0, this.motion.getMotion().getDuration(), 1);
	this.numLoops = 1;
	this.transition = this.animUtils.getDefaultTransition().clone();
	this.stopOrient = false;
	this.setDOFs(null);
};

/**
 * Gets a copy of this AnimationBuilder with all event listeners removed and reset to default settings.
 * Configuration changes made to the copy will not affect the original.
 * @method jibo.animate.AnimationBuilder#getCleanCopy
 * @return {jibo.animate.AnimationBuilder} A newly-created AnimationBuilder instance with default settings.
 */
AnimationBuilder.prototype.getCleanCopy = function()
{
	var transition = this.animUtils.getDefaultTransition().clone();
	return new AnimationBuilder(this.animUtils, this.timeline, this.motion, transition, this.robotInfo, "default", this.globalAnimationDelegate);
};

//map between timeline events and animation events
AnimationBuilder.prototype._createStartedHandler = function(animationInstance){
	var globalDelegate = this.globalAnimationDelegate;
	var h = this.eventHandlers[animate.AnimationEventType.STARTED];
	if(globalDelegate || h) {
		var startHandlers = null;
		if(h){
			startHandlers = h.slice(0);
		}
		return function () {
			if (globalDelegate) {
				globalDelegate(animate.AnimationEventType.STARTED, animationInstance, {});
			}
			if (startHandlers) {
				for (var i = 0; i < startHandlers.length; i++) {
					startHandlers[i](animate.AnimationEventType.STARTED, animationInstance, {});
				}
			}
		};
	}else{
		return null;
	}
};

//map between timeline events and animation events
AnimationBuilder.prototype._createStoppedHandler = function(animationInstance){
	var globalDelegate = this.globalAnimationDelegate;
	var h = this.eventHandlers[animate.AnimationEventType.STOPPED];
	if(globalDelegate || h) {
		var stopHandlers = null;
		if(h){
			stopHandlers = h.slice(0);
		}
		return function (interrupted) {
			if (globalDelegate) {
				globalDelegate(animate.AnimationEventType.STOPPED, animationInstance, {interrupted: interrupted});
			}
			if (stopHandlers) {
				for (var i = 0; i < stopHandlers.length; i++) {
					stopHandlers[i](animate.AnimationEventType.STOPPED, animationInstance, {interrupted: interrupted});
				}
			}
		};
	}else{
		return null;
	}
};

//map between timeline events and animation events
AnimationBuilder.prototype._createRemovedHandler = function(animationInstance){
	var globalDelegate = this.globalAnimationDelegate;
	var hStopped = this.eventHandlers[animate.AnimationEventType.STOPPED];
	var hCancelled = this.eventHandlers[animate.AnimationEventType.CANCELLED];
	if(globalDelegate || hStopped || hCancelled) {
		var stopHandlers = null;
		var cancelHandlers = null;
		if(hStopped){
			stopHandlers = hStopped.slice(0);
		}
		if(hCancelled){
			cancelHandlers = hCancelled.slice(0);
		}
		return function (started, stopped) {
			var i;
			if (globalDelegate) {
				if (started && !stopped) { //if a clip is removed after start and before stop, we'll send a stop (interrupted) to the listeners
					globalDelegate(animate.AnimationEventType.STOPPED, animationInstance, {interrupted: true});
				}
				if (!started) { //if it never started, then we'll send a cancel.
					globalDelegate(animate.AnimationEventType.CANCELLED, animationInstance, {});
				}
			}
			if(stopHandlers) {
				if (started && !stopped) { //if a clip is removed after start and before stop, we'll send a stop (interrupted) to the listeners
					for ( i = 0; i < stopHandlers.length; i++) {
						stopHandlers[i](animate.AnimationEventType.STOPPED, animationInstance, {interrupted: true});
					}
				}
			}
			if(cancelHandlers) {
				if (!started) { //if it never started, then we'll send a cancel.
					for ( i = 0; i < cancelHandlers.length; i++) {
						cancelHandlers[i](animate.AnimationEventType.CANCELLED, animationInstance, {});
					}
				}
			}
		};
	}else{
		return null;
	}
};

//map between timeline events and animation events
AnimationBuilder.prototype._createEventHandler = function(animationInstance){
	var globalDelegate = this.globalAnimationDelegate;
	var eventHandlers = null;
	if(this.eventHandlers[animate.AnimationEventType.EVENT]) {
		eventHandlers = this.eventHandlers[animate.AnimationEventType.EVENT].slice(0);
	}

	/** @type {Object<string,AnimationEventCallback[]>} */
	var customHandlers = {};
	var eventKeys = Object.keys(this.eventHandlers);
	for (var k = 0; k < eventKeys.length; k++) {
		var eventKey = eventKeys[k];
		if (eventKey !== animate.AnimationEventType.STARTED && eventKey !== animate.AnimationEventType.STOPPED &&
				eventKey !== animate.AnimationEventType.CANCELLED && eventKey !== animate.AnimationEventType.EVENT) {
			if (this.eventHandlers[eventKey]){
				customHandlers[eventKey] = this.eventHandlers[eventKey].slice(0);
			}
		}
	}

	if(globalDelegate || eventHandlers || Object.keys(customHandlers).length > 0) {
		return function (motionEvent) {
			var i;
			if (globalDelegate) {
				globalDelegate(animate.AnimationEventType.EVENT, animationInstance, {eventName: motionEvent.getEventName(), payload: motionEvent.getPayload()});
			}
			if (eventHandlers){
				for (i = 0; i < eventHandlers.length; i++) {
					eventHandlers[i](animate.AnimationEventType.EVENT, animationInstance, {eventName: motionEvent.getEventName(), payload: motionEvent.getPayload()});
				}
			}
			var eventName = motionEvent.getEventName();
			if (customHandlers[eventName]){
				for (i = 0; i < customHandlers[eventName].length; i++) {
					customHandlers[eventName][i](eventName, animationInstance, motionEvent.getPayload());
				}
			}
		};
	}else{
		return null;
	}
};


/**
 * Triggers an instance of the animation to start playing, using the configuration represented
 * in this AnimationBuilder.
 * @method jibo.animate.AnimationBuilder#play
 * @return {jibo.animate.AnimationInstance}
 */
AnimationBuilder.prototype.play = function()
{
	var startTime = this.timeline.getClock().currentTime();

	var blendMode = null;
	if (this.layer === "default")
	{
		blendMode = this.stopOrient ? LookatBlendGenerator.BlendMode.RELATIVE_TO_CURRENT : LookatBlendGenerator.BlendMode.RELATIVE_TO_TARGET;
	}

	var transitionDelay = 0;
	var transitionClip = null;
	if (this.transition)
	{
		var transitionMotion = this.animUtils.lookatBlendGenerator.generateTransition(this.layer, this.motion.getMotion(), this.clip.getInPoint(), this.dofNames, this.transition, blendMode);

		transitionClip = new SimpleMotionGenerator(this.animUtils, transitionMotion, startTime, this.robotInfo);
		if (this.layer === "default")
		{
			transitionClip.setBaseBlendMode(LookatBlendGenerator.BlendMode.ABSOLUTE);
		}
		transitionClip = this.timeline.add(transitionClip, this.layer);

		if(transitionClip !== null){
			transitionDelay = transitionMotion.getDuration();
		}
	}

	var animationInstance = new AnimationInstance(this, null, null, this.layer, this.motion.getMotion().getName());

	var animationClip = null;
	var clipData = new RelativeTimeClip(this.clip.getInPoint(), this.clip.getOutPoint(), 1);
	if (this.numLoops === 1)
	{
		animationClip = new SimpleMotionGenerator(this.animUtils, this.motion.getMotion(), startTime.add(transitionDelay), this.robotInfo, this.dofNames, clipData);
		animationClip.setEvents(new MotionEventIterator(this.motion.getEvents(), clipData));
		animationClip.setSourceTimeReportingEnabled(true);
	}
	else
	{
		var motionList = [this.motion.getMotion()];
		var clipList = [clipData];
		var motionEventsList = [new MotionEventIterator(this.motion.getEvents(), clipData)];
		var sourceTimeReportingFlags = [true];
		if (this.transition)
		{
			var finalPose = this.motion.getMotion().getPoseAtTime(this.clip.getOutPoint(), this.robotInfo.getKinematicInfo().getInterpolatorSet());
			var loopTransition = this.transition.generateTransition(finalPose, this.motion.getMotion(), this.clip.getInPoint(), this.dofNames);
			motionList.push(loopTransition);
			clipList.push(new RelativeTimeClip(0, loopTransition.getDuration(), 1));
			motionEventsList.push(new MotionEventIterator([], clipList[1]));
			sourceTimeReportingFlags.push(false);
		}
		animationClip = new LoopedMotionGenerator(this.animUtils, motionList, clipList, this.numLoops, startTime.add(transitionDelay), this.robotInfo, this.dofNames);
		animationClip.setEvents(motionEventsList);
		animationClip.setSourceTimeReportingEnabled(sourceTimeReportingFlags);
	}
	animationClip.setHandlers(this._createStartedHandler(animationInstance), this._createStoppedHandler(animationInstance), this._createRemovedHandler(animationInstance), this._createEventHandler(animationInstance));
	if (this.layer === "default")
	{
		animationClip.setBaseBlendMode(blendMode);
	}
	animationClip = new VariableSpeedMotionGenerator(this.animUtils, animationClip, this.clip.getSpeed());
	animationClip = this.timeline.add(animationClip, this.layer);

	animationInstance.transitionClip = transitionClip;
	animationInstance.animationClip = animationClip;

	if (this.globalAnimationDelegate) {
		this.globalAnimationDelegate("ADDED", animationInstance, {dofs: this.dofNames, layer: this.layer});
	}

	return animationInstance;
};

/**
 * Function signature for animation builder event listeners, for use with AnimationBuilder's [on]{@link jibo.animate.AnimationBuilder#on} method.
 * @callback jibo.animate.AnimationBuilder~AnimationEventCallback
 * @param {jibo.animate.AnimationEventType} eventName - The event type.
 * @param {jibo.animate.AnimationInstance} animationInstance - Instance that generated this event.
 * @param {Object} payload - Event-specific payload.
 */

/**
 * Registers an event listener.
 * @method jibo.animate.AnimationBuilder#on
 * @param {jibo.animate.AnimationEventType} eventName - The event type to listen for.
 * @param {jibo.animate.AnimationBuilder~AnimationEventCallback} callback - The listener function.
 */
AnimationBuilder.prototype.on = function(eventName, callback)
{
	/** @type {AnimationEventCallback[]} */
	var handlersForType = this.eventHandlers[eventName];
	if(!handlersForType){
		handlersForType = [];
		this.eventHandlers[eventName] = handlersForType;
	}
	if(handlersForType.indexOf(callback)===-1){
		handlersForType.push(callback);
	}
};

/**
 * Un-registers an event listener.
 * @method jibo.animate.AnimationBuilder#off
 * @param {jibo.animate.AnimationEventType} eventName - The event type.
 * @param {jibo.animate.AnimationBuilder~AnimationEventCallback} callback - The listener function.
 */
AnimationBuilder.prototype.off = function(eventName, callback)
{
	/** @type {AnimationEventCallback[]} */
	var handlersForType = this.eventHandlers[eventName];
	if(handlersForType){
		var index = handlersForType.indexOf(callback);
		if(index!==-1){
			handlersForType.splice(index, 1);
		}
	}
};

/**
 * Sets the speed of the animation.
 * @method jibo.animate.AnimationBuilder#setSpeed
 * @param {number} speed - Animation speed. 1 for normal speed, 2 for twice as fast, 0.5 for half speed, etc.
 */
AnimationBuilder.prototype.setSpeed = function(speed)
{
	this.clip = new RelativeTimeClip(this.clip.getInPoint(), this.clip.getOutPoint(), speed);
};

/**
 * Sets the number of times to loop the animation before stopping.
 * Specify 0 to loop forever.
 * @method jibo.animate.AnimationBuilder#setNumLoops
 * @param {number} numLoops - Number of times to loop the animation; 0 to loop forever.
 */
AnimationBuilder.prototype.setNumLoops = function(numLoops)
{
	if (numLoops < 0)
	{
		throw new Error("numLoops value is negative: "+numLoops);
	}
	this.numLoops = numLoops;
};

/**
 * Sets the DOFs to be used by this builder. The DOFs used are the intersection of
 * the DOFs passed as the argument here, the DOFs present in the underlying motion, and
 * the DOFs used by the layer to which this builder is bound.
 *
 * Commonly-used DOF groups are defined in [animate.dofs]{@link jibo.animate.dofs}.
 * @method jibo.animate.AnimationBuilder#setDOFs
 * @param {jibo.animate.DOFSet|string[]} dofNames - Names of DOFs to use; null to use all DOFs.
 */
AnimationBuilder.prototype.setDOFs = function(dofNames)
{
	if(dofNames == null) { //null means max out the dofs
		dofNames = this.motion.getMotion().getDOFs();
	}
	else if(dofNames instanceof DOFSet) {
		dofNames = dofNames.getDOFs();
	}

	this.dofNames = []; //add intersection of dofNames, dofs in this motion, and dofs in our layerDOFs
	for (var i = 0; i < dofNames.length; i++) {
		if(this.motion.getMotion().hasDOF(dofNames[i]) && //it's in the motion
			this.layerDOFs.indexOf(dofNames[i]) > -1){  //it's also in the layer
			this.dofNames.push(dofNames[i]);
		}
	}
};

/**
 * Gets the DOFs that will be used by this builder.
 * @method jibo.animate.AnimationBuilder#getDOFs
 * @return {string[]}
 */
AnimationBuilder.prototype.getDOFs = function()
{
	return this.dofNames;
};

/**
 * Set sub-clip to play in animation.  Times are in original time scale (rather than altered timescale resulting from setSpeed)
 * @param {number} inPoint - play from this time in seconds instead of start of animation.  will start from beginning if null/undefined
 * @param {number} outPoint - if present, play to this time in seconds instead of end of animation.  will play to end if null/undefined
 * @method jibo.animate.AnimationBuilder#setPlayBounds
 * @private
 */
AnimationBuilder.prototype.setPlayBounds = function(inPoint, outPoint)
{
	if (inPoint === null || inPoint === undefined)
	{
		inPoint = 0;
	}
	if (outPoint === null || outPoint === undefined)
	{
		outPoint = this.getSourceAnimationDuration();
	}

	this.clip = new RelativeTimeClip(inPoint, outPoint, this.clip.getSpeed());
};

/**
 * Gets the duration, in seconds, of the source animation for this builder (unaffected by settings such as speed, etc).
 * @method jibo.animate.AnimationBuilder#getSourceAnimationDuration
 * @return {number}
 */
AnimationBuilder.prototype.getSourceAnimationDuration = function()
{
	return this.motion.getMotion().getDuration();
};

/**
 * Gets the duration, in seconds, of the animation that will be produced by this builder given current settings (speed, etc).
 * @method jibo.animate.AnimationBuilder#getConfiguredAnimationDuration
 * @return {number}
 */
AnimationBuilder.prototype.getConfiguredAnimationDuration = function()
{
	return this.clip.getDuration();
};

/**
 * Sets the transition builder that will be used to generate a smooth
 * transition into the start of the animation.
 * @method jibo.animate.AnimationBuilder#setTransitionIn
 * @param {jibo.animate.TransitionBuilder} transition - Transition builder to use for the animation's 'in' transition.
 */
AnimationBuilder.prototype.setTransitionIn = function(transition) {
	this.transition = transition;
};

/**
 * Gets the transition builder currently specified for the animation's 'in' transition.
 * @method jibo.animate.AnimationBuilder#getTransitionIn
 * @return {jibo.animate.TransitionBuilder}
 */
AnimationBuilder.prototype.getTransitionIn = function() {
	return this.transition;
};

/**
 * Sets the animation's base-blending policy.
 *
 * This policy has an effect only if the animation is configured to control the robot's base DOF.
 * @method jibo.animate.AnimationBuilder#setStopOrient
 * @param {boolean} stopOrient If true, the animation will seize exclusive control of
 * the robot's base DOF, stopping any in-progress orient behavior on that DOF. If false, the animation
 * will blend additively with any ongoing orient/lookt behavior on the base DOF.
 */
AnimationBuilder.prototype.setStopOrient = function(stopOrient) {
	this.stopOrient = stopOrient;
};

/**
 * Sets the blending layer for the animation [warning: advanced usage only!]
 * @method jibo.animate.AnimationBuilder#setLayer
 * @param {string} layerName The name of the blending layer.
 */
AnimationBuilder.prototype.setLayer = function(layerName)
{
	if (this.timeline.getDOFsForLayer(layerName) === null)
	{
		slog.error("AnimationBuilder: ignoring setLayer with unknown layer name: "+layerName);
	}
	else
	{
		this.layer = layerName;
		this.layerDOFs = this.timeline.getDOFsForLayer(layerName);
		// trim our dofs to just the ones that are present in the layer
		this.setDOFs(this.dofNames.slice(0));
	}
};

/**
 * Protected constructor for internal use only.
 *
 * A LookatInstance is a handle for an ongoing instance of a particular
 * procedural lookat/orient behavior. LookatInstances are returned by
 * LookatBuilder's [startLookat]{@link jibo.animate.LookatBuilder#startLookat} method.
 *
 * @class LookatInstance
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
const LookatInstance = {};

/** @private */
LookatInstance.prototype = {

	/* interface definition:        */
	/* eslint-disable no-unused-vars */

	/**
	 * Stops this lookat behavior.
	 */
	stop: function(){},

	/**
	 * Modifies the target of this lookat behavior. The behavior will be
	 * redirected toward the specified target position, unless the behavior has
	 * already been stopped or interrupted.
	 * @method jibo.animate.LookatInstance#updateTarget
	 * @param {THREE.Vector3|number[]} target - The target position (in world-space) towards which the behavior will be redirected.
	 */
	updateTarget: function(target){},

	/**
	 * Gets the current target of the lookat behavior.
	 * @method jibo.animate.LookatInstance#getTarget
	 * @return {THREE.Vector3} current target
	 */
	getTarget: function(){},


	/**
	 * Gets the LookatBuilder that generated this instance through "startLookat".
	 * @method jibo.animate.LookatInstance#getBuilder
	 * @return {jibo.animate.LookatBuilder}
	 */
	getBuilder: function(){},

	/**
	 * Gets a descriptive name for this instance.
	 * @method jibo.animate.LookatInstance#getName
	 * @return {string}
	 */
	getName: function(){}

	/* end interface definition:        */
	/* eslint-enable no-unused-vars */

};

/**
 * Protected constructor for internal use only.
 *
 * A LookatBuilder is used to configure parameters and register event
 * listeners for a procedural lookat/orient behavior.  Instances of the configured
 * behavior can be triggered via the [startLookat]{@link jibo.animate.LookatBuilder#startLookat} method.
 *
 * LookatBuilders are created via the animate module's
 * [createLookatBuilder]{@link jibo.animate#createLookatBuilder} method.
 *
 * ```
 * var animate = require("jibo").animate;
 *
 * var target = new animate.THREE.Vector3(1.0, 0.0, 1.0);  // target position to look at
 *
 * var builder = animate.createLookatBuilder();
 * builder.startLookat(target);
 *
 * ```
 *
 * @class LookatBuilder
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
const LookatBuilder = {};

/**
 * @private
 */
LookatBuilder.prototype = {

	/* interface definition:        */
	/* eslint-disable no-unused-vars */

	/**
	 * Triggers an instance of a lookat/orient behavior, using the configuration represented
	 * in this LookatBuilder. The behavior will be directed toward the specified initial target position.
	 * @method jibo.animate.LookatBuilder#startLookat
	 * @param {THREE.Vector3|number[]} target - The target position (in world-space) towards which the behavior will be directed.
	 * @return {jibo.animate.LookatInstance}
	 */
	startLookat: function(target){
	},

	/**
	 * Function signature for lookat builder event listeners, for use with LookatBuilder's [on]{@link jibo.animate.LookatBuilder#on} method.
	 * @callback jibo.animate.LookatBuilder~LookatEventCallback
	 * @param {jibo.animate.LookatEventType} eventName - The event type.
	 * @param {jibo.animate.LookatInstance} lookatInstance - Lookat instance that generated this event.
	 */

	/**
	 * Registers an event listener.
	 * @method jibo.animate.LookatBuilder#on
	 * @param {jibo.animate.LookatEventType} eventName - The event type to listen for.
	 * @param {jibo.animate.LookatBuilder~LookatEventCallback} callback - The listener function.
	 */
	on: function(eventName, callback){
	},

	/**
	 * Un-registers an event listener.
	 * @method jibo.animate.LookatBuilder#off
	 * @param {jibo.animate.LookatEventType} eventName - The event type.
	 * @param {jibo.animate.LookatBuilder~LookatEventCallback} callback - The listener function.
	 */
	off: function(eventName, callback){
	},

	/**
	 * Sets the DOFs to be used in the lookat/orient behavior.
	 *
	 * Commonly-used DOF groups are defined in [animate.dofs]{@link jibo.animate.dofs}.
	 * @method jibo.animate.LookatBuilder#setDOFs
	 * @param {jibo.animate.DOFSet|string[]} dofNames - Names of DOFs to use; null to use all DOFs.
	 */
	setDOFs: function(dofNames){
	},

	/**
	 * Gets the DOFs currently specified for this builder.
	 * @method jibo.animate.LookatBuilder#getDOFs
	 * @return {string[]}
	 */
	getDOFs: function(){
	},

	/**
	 * Sets the lookat behavior's base-blending policy.
	 *
	 * This policy only has an effect if the behavior is configured to control the robot's base DOF.
	 * @method jibo.animate.LookatBuilder#setOrientFully
	 * @param {boolean} orientFully If `true`, the behavior will seize exclusive control of
	 * the robot's base DOF. If `false`, the behavior will blend additively with any ongoing animation or postural
	 * offset on the base DOF.
	 */
	setOrientFully: function(orientFully){
	},

	/**
	 * Turns continuous mode for the lookat behavior on or off.
	 * @method jibo.animate.LookatBuilder#setContinuousMode
	 * @param {boolean} isContinuous If `false`, the lookat behavior will stop when the target
	 * is reached. If `true`, the lookat behavior will continue indefinitely, allowing the target to be modified
	 * at any time via [updateTarget]{@link jibo.animate.LookatInstance#updateTarget}.
	 */
	setContinuousMode: function(isContinuous){
	}

	/* end interface definition:        */
	/* eslint-enable no-unused-vars */

};

const animate = {

	MODALITY_NAME: "MOTION",

	/**
	 * Create an instance of the Animation Utilities API.
	 * If both MotionTimeline and RobotInfo are provided, the instance will be fully initialized and ready for use.
	 * Otherwise, the init() method must be used to complete initialization.
	 * @method jibo.animate#createAnimationUtilities
	 * @param {MotionTimeline} [timeline]
	 * @param {RobotInfo} [robotInfo]
	 * @return {AnimationUtilities}
	 */
	createAnimationUtilities: function(timeline, robotInfo)
	{
		const animationUtilities = new AnimationUtilities();
		if (timeline && robotInfo)
		{
			animationUtilities.init(timeline, robotInfo);
		}
		return animationUtilities;
	}

};

animate.trajectory = {

	/**
	 * @private
	 * @callback jibo.animate~AnimationLoadedCallback
	 * @param {AnnotatedMotion} motion - motion that was loaded
	 */

	/**
	 * @method jibo.animate#getAnimation
   * @private
	 * @param {string} uri
	 * @param {AnimationLoadedCallback} callback
	 * @param {?boolean} [forceReload] - optional, defaults to not forcing reload
	 */
	getAnimation: function(uri, callback, forceReload){
		let result;
		if (!forceReload){
			result = animationCache[uri];
		}

		if (result){
			if(callback){
				callback(new AnnotatedMotion(result.motion, result.events));
			}
		}else{
			animationLoader.load(uri, function(){
				const animResult = animationLoader.getResult();
				if (animResult.success){
					animationCache[uri] = animResult;
					if (callback){
						callback(new AnnotatedMotion(animResult.motion, animResult.events));
					}
				}else{
					slog.error("animation load failed, "+animResult.message+" with URL:\""+uri+"\"");
					if (callback){
						callback(null);
					}
				}
			});
		}
	},

	/**
	 * Parse a pre-loaded (or pre-assembled) animation data structure.
	 * The data object must match the structure specified for on-disk animation files.
	 * @method jibo.animate#parseAnimation
	 * @param {Object} animationData - the animation data object
	 * @param {string} [parentDirectoryURI] - optional; if present, texture paths will be resolved relative to the specified directory
	 * @param {string} [cacheKey] - optional; if present, results will be cached using the specified key
	 *
	 * @return {AnnotatedMotion} The resulting motion instance, or null if parse failed
	 */
	parseAnimation: function(animationData, parentDirectoryURI, cacheKey){
		let result = null;
		if (cacheKey){
			result = animationCache[cacheKey];
		}

		if (result){
			return new AnnotatedMotion(result.motion, result.events);
		}else{
			const loader = new AnimationLoader();
			if (parentDirectoryURI){
				const lastChar = parentDirectoryURI.slice(-1);
				if (!(lastChar === "/" || lastChar === "\\")){
					parentDirectoryURI = parentDirectoryURI + "/";
				}
				loader.resolvePaths = true;
			}else{
				loader.resolvePaths = false;
			}

			loader.parseData(animationData, parentDirectoryURI);
			const animResult = loader.getResult();
			if (animResult.success){
				if (cacheKey){
					animationCache[cacheKey] = animResult;
				}
				return new AnnotatedMotion(animResult.motion, animResult.events);
			}else{
				slog.error("animation parse failed: "+animResult.message);
				return null;
			}
		}
	},

	createLinearTransitionBuilder: function(robotInfo){
		return new LinearTransitionBuilder(robotInfo);
	},

	createAccelerationTransitionBuilder: function(robotInfo, defaultMaxVelocity, defaultMaxAcceleration){
		return new AccelerationTransitionBuilder(robotInfo, defaultMaxVelocity, defaultMaxAcceleration);
	}
};

/**
 * Enum Values for animation builder event types, for use with AnimationBuilder's [on]{@link jibo.animate.AnimationBuilder#on} method.
 * @enum {string}
 * @memberof jibo.animate
 */
const AnimationEventType = {
	/**
	 * Animation started.
	 */
	STARTED: "STARTED",
	/**
	 * Animation stopped or interrupted; check event payload's 'interrupted' property (boolean).
	 */
	STOPPED: "STOPPED",     //check interrupted boolean description property
	/**
	 * Animation cancelled before starting.
	 */
	CANCELLED: "CANCELLED", //will not start
	/**
	 * Custom animation event fired.
	 */
	EVENT: "EVENT"  //custom event
};

animate.AnimationEventType = AnimationEventType;


/**
 * Enum Values for lookat builder event types, for use with LookatBuilder's [on]{@link jibo.animate.LookatBuilder#on} method.
 * @enum {string}
 * @memberof jibo.animate
 */
const LookatEventType = {
	/**
	 * Lookat started.
	 */
	STARTED: "STARTED",
	/**
	 * Lookat target reached.
	 */
	TARGET_REACHED: "TARGET_REACHED", //reported when look has reached target
	/**
	 * Lookat target superseded.
	 */
	TARGET_SUPERSEDED: "TARGET_SUPERSEDED", //reported when look given new target before reaching previous
	/**
	 * Lookat stopped or interrupted; check event payload's 'interrupted' property (boolean).
	 */
	STOPPED: "STOPPED",
	/**
	 * Lookat cancelled before starting.
	 */
	CANCELLED: "CANCELLED" //will not start
};

animate.LookatEventType = LookatEventType;

export default animate;
