export default VariableSpeedMotionGenerator;
/**
 * Wraps a motion generator to enable varying its playback speed.
 * @param {AnimationUtilities} animUtils
 * @param {MotionGenerator} generator - motion generator to wrap
 * @param {number} initialSpeed - initial speed
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class VariableSpeedMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, generator: any, initialSpeed: any);
    /** @type {MotionGenerator} */
    _generator: MotionGenerator;
    /** @type {RelativeTimeClip} */
    _clip: RelativeTimeClip;
    /** @type {jibo.animate.Time} */
    _latestUpdateTime: jibo.animate.Time;
    /** @type {jibo.animate.Time} */
    _latestSpeedChangeTime: jibo.animate.Time;
    /** @type {jibo.animate.Time} */
    _generatorTimeAtLatestUpdate: jibo.animate.Time;
    /** @type {jibo.animate.Time} */
    _latestMapInputTime: jibo.animate.Time;
    /** @type {jibo.animate.Time} */
    _latestMapOutputTime: jibo.animate.Time;
    /**
     * @returns {number}
     */
    getSpeed(): number;
    /**
     * @param {number} newSpeed - new speed
     */
    setSpeed(newSpeed: number): void;
    /**
     * Maps the specified time into the frame of the generator.
     * @param {jibo.animate.Time} time
     * @returns {jibo.animate.Time}
     * @override
     */
    override _mapTime(time: jibo.animate.Time): jibo.animate.Time;
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
import RelativeTimeClip from "../../ifr-motion/base/RelativeTimeClip.js";
