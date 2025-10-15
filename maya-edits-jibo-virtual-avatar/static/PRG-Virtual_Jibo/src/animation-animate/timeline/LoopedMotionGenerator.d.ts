export default LoopedMotionGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {Motion[]} motionList
 * @param {RelativeTimeClip[]} clipList
 * @param {number} numLoops - number of times to loop through the motion list, 0 to loop forever
 * @param {jibo.animate.Time} startTime
 * @param {RobotInfo} robotInfo
 * @param {string[]} [dofNames]
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class LoopedMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, motionList: any, clipList: any, numLoops: any, startTime: any, robotInfo: any, dofNames: any);
    /** @type {number[]} */
    _durationList: number[];
    /** @type {number} */
    _loopDuration: number;
    /** @type {RelativeTimeClip[]} */
    _clipList: RelativeTimeClip[];
    /** @type {string[]} */
    _nameList: string[];
    /** @type {Array.<MotionTrack[]>} */
    _motionTracksList: Array<MotionTrack[]>;
    /** @type {Interpolators.BaseInterpolator[]} */
    _interpolators: Interpolators.BaseInterpolator[];
    /** @type {number} */
    _numLoops: number;
    /** @type {MotionEventIterator[]} */
    _customEvents: MotionEventIterator[];
    /** @type {number} */
    _eventLoopIndex: number;
    /** @type {boolean[]} */
    _sourceTimeReportingFlags: boolean[];
    /** @type {number} */
    _baseDOFIndex: number;
    /** @type {BlendMode} */
    _baseBlendMode: BlendMode;
    /**
     * @param {MotionEventIterator[]} motionEventsList
     */
    setEvents(motionEventsList: MotionEventIterator[]): void;
    /**
     * @param {boolean[]} enabledFlags
     */
    setSourceTimeReportingEnabled(enabledFlags: boolean[]): void;
    /**
     * @param {BlendMode} blendMode
     */
    setBaseBlendMode(blendMode: BlendMode): void;
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
