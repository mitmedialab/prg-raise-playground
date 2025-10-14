export default LookatBlendGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {jibo.animate.Time} startTime
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class LookatBlendGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, startTime: any);
    /** @type {MotionTimeline} */
    _timeline: MotionTimeline;
    /** @type {string} */
    _baseDOFName: string;
    /** @type {InterpolatorSet} */
    _interpolatorSet: InterpolatorSet;
    /** @type {number} */
    _currentBaseHeading: number;
    /** @type {number} */
    _targetBaseHeading: number;
    /** @type {BlendMode} */
    _currentBaseBlendMode: BlendMode;
    /**
     * @param {string} layer
     * @param {Motion} toMotion - Motion to use as the destination for the transition.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     * @param {jibo.animate.TransitionBuilder} transition
     * @param {BlendMode} blendMode
     * @returns {Motion}
     */
    generateTransition(layer: string, toMotion: Motion, timeOffsetInTo: number, onDOFs: string[], transition: jibo.animate.TransitionBuilder, blendMode: BlendMode): Motion;
}
declare namespace LookatBlendGenerator {
    export { BlendMode };
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
/**
 * *
 */
type BlendMode = string;
declare namespace BlendMode {
    let ABSOLUTE: string;
    let RELATIVE_TO_CURRENT: string;
    let RELATIVE_TO_TARGET: string;
}
import Motion from "../../ifr-motion/base/Motion.js";
