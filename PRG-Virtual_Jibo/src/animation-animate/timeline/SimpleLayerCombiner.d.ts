export default SimpleLayerCombiner;
/**
 * @param {RobotInfo} robotInfo
 * @constructor
 */
declare class SimpleLayerCombiner extends LayerCombiner {
    constructor(robotInfo: any);
    /** @type {SampleCombiner[]} */
    sampleCombiners: SampleCombiner[];
    /** @type {string[]} */
    layerNames: string[];
    /** @type {string[]} */
    dofNames: string[];
    /** @type {DOFInfo[]} */
    dofInfoList: DOFInfo[];
    /**
     * @param {string} layerName
     * @param {SampleCombiner} sampleCombiner
     */
    addSampleCombiner(layerName: string, sampleCombiner: SampleCombiner): void;
    /**
     * @param {number[]} layerIndices
     * @param {LayerState[]} layerStates
     * @returns {LayerState}
     * @override
     */
    override combineLayers(layerIndices: number[], layerStates: LayerState[]): LayerState;
}
import LayerCombiner from "./LayerCombiner.js";
import LayerState from "./LayerState.js";
