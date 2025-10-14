export default TransitionBuilder;
/**
 * Protected constructor for internal use only.
 *
 * TransitionBuilders are used to generate procedural transitions between animations or
 * static poses that require intermediate motion.
 *
 * TransitionBuilders can be created via the animation module's
 * [createAccelerationTransitionBuilder]{@link jibo.animate#createAccelerationTransitionBuilder} or
 * [createLinearTransitionBuilder]{@link jibo.animate#createLinearTransitionBuilder} methods.
 *
 * @class TransitionBuilder
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
declare class TransitionBuilder {
    /**
     * Protected method for internal/subclass use only.
     *
     * Generates a procedural transition motion using the configuration specified by this builder.
     * @method jibo.animate.TransitionBuilder#generateTransition
     * @param {Pose} fromPose - Starting pose for the transition.
     * @param {Motion} toMotion - Motion to use as the destination for the transition.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     *
     * @return {Motion} Procedural transition motion.
     * @protected
     */
    protected generateTransition(fromPose: Pose, toMotion: Motion, timeOffsetInTo: number, onDOFs: string[]): Motion;
    /**
     * Clones this builder.
     * The returned builder can be safely modified without affecting this source builder.
     * @method jibo.animate.TransitionBuilder#clone
     * @return {jibo.animate.TransitionBuilder} A new TransitionBuilder with identical parameters to the source builder.
     */
    clone(): jibo.animate.TransitionBuilder;
}
