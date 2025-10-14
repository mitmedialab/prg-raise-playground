export default SimpleMotionGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {Motion} motion
 * @param {jibo.animate.Time} startTime
 * @param {RobotInfo} robotInfo
 * @param {string[]} [dofNames]
 * @param {RelativeTimeClip} [clip] - optional clip info
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class SimpleMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, motion: any, startTime: any, robotInfo: any, dofNames: any, clip: any);
    /** @type {RelativeTimeClip} */
    _clip: RelativeTimeClip;
    /** @type {MotionTrack[]} */
    _motionTracks: MotionTrack[];
    /** @type {Interpolators.BaseInterpolator[]} */
    _interpolators: Interpolators.BaseInterpolator[];
    /** @type {MotionEventIterator} */
    _customEvents: MotionEventIterator;
    /** @type {boolean} */
    _sourceTimeReportingEnabled: boolean;
    /** @type {number} */
    _baseDOFIndex: number;
    /** @type {BlendMode} */
    _baseBlendMode: BlendMode;
    /**
     * @param {MotionEventIterator} motionEvents
     */
    setEvents(motionEvents: MotionEventIterator): void;
    /**
     * @param {boolean} enabled
     */
    setSourceTimeReportingEnabled(enabled: boolean): void;
    /**
     * @param {BlendMode} blendMode
     */
    setBaseBlendMode(blendMode: BlendMode): void;
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
import RelativeTimeClip from "../../ifr-motion/base/RelativeTimeClip.js";
