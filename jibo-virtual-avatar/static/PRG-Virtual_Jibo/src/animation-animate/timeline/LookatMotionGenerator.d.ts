export default LookatMotionGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {MotionLookat} motionLookat
 * @param {jibo.animate.Time} startTime
 * @param {THREE.Vector3} target
 * @param {string[]} [onDOFs=null] - use only these dofs (all dofs of motionLookat used if omitted/null)
 * @param {LookatMultiLayerStatusManager} multiLayerLookatStatus - handle statekeeping here to allow for multiple generators per lookat
 * @param {LookatOrientationStatusReporter} statusReporter
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class LookatMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, motionLookat: any, startTime: any, target: any, onDOFs: any, multiLayerLookatStatus: any, statusReporter: any);
    /** @type {MotionLookat} */
    _motionLookat: MotionLookat;
    /** @type {THREE.Vector3} */
    _target: THREE.Vector3;
    /** @type {Pose} */
    _generatedPose: Pose;
    /**
     * pose frozen after particular dofs roll off the end
     * @type {Pose} */
    _frozenPose: Pose;
    /** @type {LookatMultiLayerStatusManager} */
    _multiLayerLookatStatus: LookatMultiLayerStatusManager;
    /** @type {LookatOrientationStatusReporter} */
    _statusReporter: LookatOrientationStatusReporter;
    /**
     *
     * @param {THREE.Vector3} target
     */
    setTarget(target: THREE.Vector3): void;
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
import Pose from "../../ifr-motion/base/Pose.js";
