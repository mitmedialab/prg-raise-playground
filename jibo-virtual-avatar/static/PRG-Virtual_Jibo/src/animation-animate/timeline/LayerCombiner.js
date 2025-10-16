/**
 * @constructor
 */
class LayerCombiner {
    constructor() {
        // Base constructor - same signature as original
    }

    /* superclass definition:        */
    /* eslint-disable no-unused-vars */

    /**
     * @param {number[]} layerIndices
     * @param {LayerState[]} layerStates
     * @returns {LayerState}
     * @abstract
     */
    combineLayers(layerIndices, layerStates) {
        // Abstract method - same signature as original
    }

    /**
     * @param {LayerState} combinedState
     * @param {number} layerIndex
     * @param {LayerState} layerState
     * @param {number} dofIndex
     * @abstract
     */
    incrementState(combinedState, layerIndex, layerState, dofIndex) {
        // Abstract method - same signature as original
    }

    /* end superclass definition:    */
    /* eslint-enable no-unused-vars */

    static getSkipLayerProperty(layerName) {
        return "skip_layer:" + layerName;
    }
}

export default LayerCombiner;