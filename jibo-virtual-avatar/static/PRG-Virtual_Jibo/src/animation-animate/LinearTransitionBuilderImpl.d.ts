export default LinearTransitionBuilder;
/**
 * Protected constructor for internal use only.
 *
 * LinearTransitionBuilders generate transition motions via simple linear blending.
 *
 * LinearTransitionBuilders can be created via the animation module's
 * [createLinearTransitionBuilder]{@link jibo.animate#createLinearTransitionBuilder} method.
 *
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @class LinearTransitionBuilder
 * @intdocs
 * @memberof jibo.animate
 * @extends jibo.animate.TransitionBuilder
 * @protected
 */
declare class LinearTransitionBuilder {
    constructor(robotInfo: any);
    /** @type {number} */
    /** @private */
    private _transitionTime;
    /** @type {number} */
    /** @private */
    private _defaultMaxVelocity;
    /** @type {Object<string,number>} */
    /** @private */
    private _maxVelocityByDOF;
    /** @type {RobotInfo} */
    /** @private */
    private _robotInfo;
    /**
     * Sets this transition to use a fixed duration transition regardless of joint positions.
     *
     * Overrides previous settings from setTransitionTime or setMaxVelocity.
     * @method jibo.animate.LinearTransitionBuilder#setTransitionTime
     * @param {number} time - Fixed transition time.
     */
    setTransitionTime(time: number): void;
    /**
     * Sets this transition to compute time based on the distance to travel and max velocity
     * of the joints.
     *
     * Overrides previous settings from setTransitionTime or setMaxVelocity.
     * @method jibo.animate.LinearTransitionBuilder#setMaxVelocity
     * @param {number} defaultMaxVelocity - Use this velocity for all joints not in the map.
     * @param {Object<string,number>} maxVelocityByDOFMap - Override default for joints present in the map.
     */
    setMaxVelocity(defaultMaxVelocity: number, maxVelocityByDOFMap: {
        [x: string]: number;
    }): void;
    /**
     *
     * Generates a procedural transition motion using the configuration specified by this builder.
     * @method jibo.animate.LinearTransitionBuilder#generateTransition
     * @param {Pose} fromPose - Starting pose for the transition.  Should have at least onDOFs, and also all unused DOFs (ancestors) required to calculate correct global paths.
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
     * @method jibo.animate.LinearTransitionBuilder#clone
     * @return {jibo.animate.LinearTransitionBuilder}
     * @override
     */
    override clone(): jibo.animate.LinearTransitionBuilder;
}
import Motion from "../ifr-motion/base/Motion.js";
