export default BaseMotionGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {string} name
 * @param {jibo.animate.Time} startTime
 * @constructor
 * @extends MotionGenerator
 */
declare class BaseMotionGenerator extends MotionGenerator {
    constructor(animUtils: any, name: any, startTime: any);
    /** @type {AnimationUtilities} */
    _animUtils: AnimationUtilities;
    /** @type {string} */
    _name: string;
    /** @type {jibo.animate.Time} */
    _startTime: jibo.animate.Time;
    /** @type {Timeline~ClipStartedHandler} */
    _clipStartedHandler: Timeline;
    /** @type {Timeline~ClipStoppedHandler} */
    _clipStoppedHandler: Timeline;
    /** @type {Timeline~ClipRemovedHandler} */
    _clipRemovedHandler: Timeline;
    /** @type {Timeline~ClipEventHandler} */
    _clipEventHandler: Timeline;
    /** @type {number[]} */
    _dofs: number[];
    /** @type {boolean[]} */
    _dofMask: boolean[];
    /** @type {jibo.animate.Time[]} */
    _dofEndTimes: jibo.animate.Time[];
    /** @type {jibo.animate.Time} */
    _endTime: jibo.animate.Time;
    /** @type {boolean} */
    _entered: boolean;
    /** @type {boolean} */
    _exited: boolean;
    /** @type {boolean} */
    _interrupted: boolean;
    /** @type {jibo.animate.Time} */
    _currentTime: jibo.animate.Time;
    /**
     * @param {string[]} dofNames - include these DOFs
     * @param {jibo.animate.Time} endTime - end time, may be null for no end
     * @protected
     */
    protected _initWithDOFNames(dofNames: string[], endTime: jibo.animate.Time): void;
    /**
     * @param {number[]} dofIndices - include these DOFs
     * @param {jibo.animate.Time} endTime - end time, may be null for no end
     * @protected
     */
    protected _initWithDOFIndices(dofIndices: number[], endTime: jibo.animate.Time): void;
    /**
     * @param {Timeline~ClipStartedHandler} clipStartedHandler
     * @param {Timeline~ClipStoppedHandler} clipStoppedHandler
     * @param {Timeline~ClipRemovedHandler} clipRemovedHandler
     * @param {Timeline~ClipEventHandler} clipEventHandler
     */
    setHandlers(clipStartedHandler: any, clipStoppedHandler: any, clipRemovedHandler: any, clipEventHandler: any): void;
    /**
     * @virtual
     */
    queueCustomEvents(): void;
}
import MotionGenerator from "./MotionGenerator.js";
