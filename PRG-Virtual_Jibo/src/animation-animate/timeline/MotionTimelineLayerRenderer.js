class MotionTimelineLayerRenderer {
    constructor() {
        // Base constructor - same signature as original
    }

    /**
     *
     * @param {MotionTimelineClip[]} layerClips
     * @param {Pose} defaultPose
     * @param {Time} startTime
     * @param {Time} endTime
     * @param {Motion} motionSoFar
     * @return Motion
     * @abstract
     */
    render(layerClips, defaultPose, startTime, endTime, motionSoFar) { // eslint-disable-line no-unused-vars
        // Abstract method - same signature as original
    }
}

export default MotionTimelineLayerRenderer;