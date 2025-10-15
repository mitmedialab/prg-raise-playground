export default LookatMultiLayerStatusManager;
/**
 * @param {AnimationUtilities} animUtils
 * @param {MotionLookat} lookat
 * @param {jibo.animate.Time} startTime
 * @param {THREE.Vector3} target
 * @param {boolean} continuous
 * @param {LookatOrientationStatusReporter} orientationReporter
 * @constructor
 */
declare class LookatMultiLayerStatusManager {
    constructor(animUtils: any, lookat: any, startTime: any, target: any, continuous: any, orientationReporter: any);
    /** @type {AnimationUtilities} */
    _animUtils: AnimationUtilities;
    /** @type {Map<LookatMotionGenerator,LayerStatus>} */
    _layerStatuses: Map<LookatMotionGenerator, LayerStatus>;
    _clipStartedHandler: any;
    _clipStoppedHandler: any;
    _clipRemovedHandler: any;
    _targetReachedHandler: any;
    _targetSupersededHandler: any;
    /** @type {THREE.Vector3} */
    _waitingToNotifyOnTarget: THREE.Vector3;
    /** @type {MotionLookat} */
    _lookat: MotionLookat;
    /** @type {jibo.animate.Time} */
    _startTime: jibo.animate.Time;
    /** @type {THREE.Vector3} */
    _target: THREE.Vector3;
    /** @type {boolean} */
    _continuous: boolean;
    /** @type {LookatOrientationStatusReporter} */
    _orientationReporter: LookatOrientationStatusReporter;
    /** @type {boolean} */
    _haveSentStart: boolean;
    /**
     * This is an array of booleans (active) indexed by global DOF index
     * @type {boolean[]}
     */
    _activeDOFMask: boolean[];
    /**
     * Create generator to render nodes on a particular layer with the provided dofs.
     *
     * @param {string[] }dofNames
     * @return {LookatMotionGenerator}
     */
    createGenerator(dofNames: string[]): LookatMotionGenerator;
    setHandlers(clipStartedHandler: any, clipStoppedHandler: any, clipRemovedHandler: any, targetReachedHandler: any, targetSupersededHandler: any): void;
    /**
     *
     * @param {THREE.Vector3} newTarget
     */
    setTarget(newTarget: THREE.Vector3): void;
    /**
     *
     * @param {LookatMotionGenerator} generator
     * @param {jibo.animate.Time} currentTime
     * @return {boolean} true if generator should truncate to current time (end now naturally)
     */
    handleUpdateFinishedForGenerator(generator: LookatMotionGenerator, currentTime: jibo.animate.Time): boolean;
    /**
     * Returns the indices of all DOFs with motion data past the given time.
     * @param {jibo.animate.Time} time - The query time.
     * @return {number[]} - A list of active DOF indices.
     */
    getActiveDOFIndices(time: jibo.animate.Time): number[];
    /**
     * Called by each generator when they start.  We will pass through 1 started when
     * at least one has started and all have been either started or removed.
     */
    handleStarted(generator: any): void;
    /**
     * Called by each generator when/if they stopped
     *
     * Each clip will be either removed exactly once and stopped at most once.  We will
     * pass through a single stop if it comes in on the last active (not stopped or removed) layer.
     *
     * @param {LookatMotionGenerator} generator - the generator sending this event
     * @param {boolean} interrupted
     */
    handleStopped(generator: LookatMotionGenerator, interrupted: boolean): void;
    /**
     * Called by each generator when/if they are removed.
     *
     * Each clip will be either removed exactly once and stopped at most once.  We will
     * pass through a single "remove" when all have been removed.
     *
     * @param {LookatMotionGenerator} generator - the generator sending this event
     * @param {boolean} started
     * @param {boolean} stopped
     */
    handleRemoved(generator: LookatMotionGenerator, started: boolean, stopped: boolean): void;
}
import LookatMotionGenerator from "./LookatMotionGenerator.js";
/**
 * @param {LookatMotionGenerator} generator
 * @constructor
 */
declare class LayerStatus {
    constructor(generator: any);
    generator: any;
    layerHasStarted: boolean;
    layerHasStopped: boolean;
    layerHasRemoved: boolean;
}
