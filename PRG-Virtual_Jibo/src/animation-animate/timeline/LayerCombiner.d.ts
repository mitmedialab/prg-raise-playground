export default LayerCombiner;
/**
 * @constructor
 */
declare class LayerCombiner {
    static getSkipLayerProperty(layerName: any): string;
    /**
     * @param {number[]} layerIndices
     * @param {LayerState[]} layerStates
     * @returns {LayerState}
     * @abstract
     */
    combineLayers(layerIndices: number[], layerStates: LayerState[]): LayerState;
    /**
     * @param {LayerState} combinedState
     * @param {number} layerIndex
     * @param {LayerState} layerState
     * @param {number} dofIndex
     * @abstract
     */
    incrementState(combinedState: LayerState, layerIndex: number, layerState: LayerState, dofIndex: number): void;
}
