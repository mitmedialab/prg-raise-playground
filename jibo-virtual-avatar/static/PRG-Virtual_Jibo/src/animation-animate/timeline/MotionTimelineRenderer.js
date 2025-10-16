/**
 *
 * @param {string[]} layerNames
 * @param {MotionTimelineLayerRenderer[]} layerRenderFunctions
 * @constructor
 */
class MotionTimelineRenderer {
    constructor(layerNames, layerRenderFunctions) {
        /** @type {string[]}*/
        this._layerNames = layerNames;

        /** @type {MotionTimelineLayerRenderer[]}*/
        this._layerRenderFunctions = layerRenderFunctions;
    }

    /**
     *
     * @param {Object.<string,MotionTimelineClip[]>} layers
     * @param {Object.<string,Pose>} defaultPoses
     * @param {Time} startTime
     * @param {Time} endTime
     * @return Motion
     */
    render(layers, defaultPoses, startTime, endTime) {
        let motionSoFar = null;
        for (let li = 0; li < this._layerNames.length; li++) {
            const layerName = this._layerNames[li];
            if (layers.hasOwnProperty(layerName)) {
                motionSoFar = this._layerRenderFunctions[li].render(layers[layerName], defaultPoses[layerName], startTime, endTime, motionSoFar);
            }
        }
        return motionSoFar;
    }
}

export default MotionTimelineRenderer;