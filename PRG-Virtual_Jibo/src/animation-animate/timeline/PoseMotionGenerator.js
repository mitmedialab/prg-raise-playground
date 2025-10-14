import BaseMotionGenerator from "./BaseMotionGenerator.js";

/**
 * @param {AnimationUtilities} animUtils
 * @param {string} name
 * @param {jibo.animate.Time} startTime
 * @param {Pose} pose
 * @param {number} duration - duration in seconds
 * @constructor
 * @extends BaseMotionGenerator
 */
class PoseMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils, name, startTime, pose, duration) {
        super(animUtils, name, startTime);
        this._initWithDOFIndices(pose.getDOFIndices(), startTime.add(duration));

        /** @type {Pose} */
        this._pose = pose;
    }

    /**
     * @param {number} dofIndex
     * @param {LayerState} partialRender
     * @param {Object} blackboard
     * @returns {number[]}
     * @override
     */
    getDOFState(dofIndex, partialRender, blackboard) { // eslint-disable-line no-unused-vars
        return this._pose.getByIndex(dofIndex);
    }
}

export default PoseMotionGenerator;
