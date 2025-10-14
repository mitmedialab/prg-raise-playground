export default PoseMotionGenerator;
/**
 * @param {AnimationUtilities} animUtils
 * @param {string} name
 * @param {jibo.animate.Time} startTime
 * @param {Pose} pose
 * @param {number} duration - duration in seconds
 * @constructor
 * @extends BaseMotionGenerator
 */
declare class PoseMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils: any, name: any, startTime: any, pose: any, duration: any);
    /** @type {Pose} */
    _pose: Pose;
}
import BaseMotionGenerator from "./BaseMotionGenerator.js";
