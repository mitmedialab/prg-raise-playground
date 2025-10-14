export default AccelerationTransitionBuilder;
/**
 * Protected constructor for internal use only.
 *
 * AccelerationTransitionBuilders generate transition motions using configurable
 * acceleration and velocity limits.
 *
 * AccelerationTransitionBuilders can be created via the animation module's
 * [createAccelerationTransitionBuilder]{@link jibo.animate#createAccelerationTransitionBuilder} method.
 *
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @param {number} defaultMaxVelocity - Protected constructor parameter.
 * @param {number} defaultMaxAcceleration - Protected constructor parameter.
 * @class AccelerationTransitionBuilder
 * @memberof jibo.animate
 * @protected
 * @extends jibo.animate.TransitionBuilder
 */
declare class AccelerationTransitionBuilder {
    constructor(robotInfo: any, defaultMaxVelocity: any, defaultMaxAcceleration: any);
    /** @type {number} */
    /** @private */
    private minTransitionTime;
    /** @type {number} */
    /** @private */
    private defaultMaxVelocity;
    /** @type {number} */
    /** @private */
    private defaultMaxAccel;
    /** @type {Object<string,number>} */
    /** @private */
    private maxVelocityByDOF;
    /** @type {Object<string,number>} */
    /** @private */
    private maxAccelByDOF;
    /** @type {Object<string,boolean>} */
    /** @private */
    private preferValueByDOF;
    /** @type {RobotInfo} */
    /** @private */
    private robotInfo;
    /** @type {AccelPlanner} */
    /** @private */
    private planner;
    /**
     * Sets this transition to use the specified max velocity and acceleration by default; i.e. for
     * all joints that do not have their own custom settings.
     * @method jibo.animate.AccelerationTransitionBuilder#setDefaultLimits
     * @param {number} defaultMaxVelocity - Max velocity to use by default.
     * @param {number} defaultMaxAcceleration - Max acceleration to use by default.
     */
    setDefaultLimits(defaultMaxVelocity: number, defaultMaxAcceleration: number): void;
    /**
     * Sets this transition to use the specified minimum duration regardless of joint positions.
     * @method jibo.animate.AccelerationTransitionBuilder#setMinTransitionTime
     * @param {number} time - Minimum transition time.
     */
    setMinTransitionTime(time: number): void;
    /**
     * Sets this transition to use the specified max velocity and acceleration for the specified joints/DOFs.
     * @method jibo.animate.AccelerationTransitionBuilder#setLimits
     * @param {string[]} dofNames - DOF names for which the specified limits should apply.
     * @param {number} maxVelocity - Max velocity to use for the specified DOFs.
     * @param {number} maxAcceleration - Max acceleration to use for the specified DOFs.
     */
    setLimits(dofNames: string[], maxVelocity: number, maxAcceleration: number): void;
    /**
     * Sets this transition to prefer the boolean value provided for the dofs listed.  Assumes the dofs described are
     * boolean valued dofs, behavior undefined if these dofs are metric.
     *
     * @param {string[]} dofNames - DOF names for which the specified limits should apply.
     * @param {number} preferValue - value to prefer, 0 or 1
     */
    setPreferValue(dofNames: string[], preferValue: number): void;
    /**
     *
     * Generates a procedural transition motion using the configuration specified by this builder.
     * @method jibo.animate.AccelerationTransitionBuilder#generateTransition
     * @param {Pose} fromPose - Starting pose for the transition. Should have at least onDOFs, and also all unused DOFs (ancestors) required to calculate correct global paths.
     * @param {Motion} toMotion - Motion to use as the destination for the transition.  Should have at least onDOFs.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     *
     * @return {Motion}
     * @override
     */
    override generateTransition(fromPose: Pose, toMotion: Motion, timeOffsetInTo: number, onDOFs: string[]): Motion;
    /**
     * Clones this builder.
     * @method jibo.animate.AccelerationTransitionBuilder#clone
     * @return {jibo.animate.AccelerationTransitionBuilder}
     * @override
     */
    override clone(): jibo.animate.AccelerationTransitionBuilder;
}
import Motion from "../ifr-motion/base/Motion.js";
