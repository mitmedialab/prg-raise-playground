export default MotionTimeline;
/**
 * @param {string} name
 * @param {RobotInfo} robotInfo
 * @param {Clock} clock
 * @param {LayerCombiner} layerCombiner
 * @param {string} modalityName
 *
 * @constructor
 */
declare class MotionTimeline {
    constructor(name: any, robotInfo: any, clock: any, layerCombiner: any, modalityName: any);
    /** @type {string} */
    _name: string;
    /** @type {Array.<MotionGenerator[]>} */
    _layers: Array<MotionGenerator[]>;
    /** @type {string[]} */
    _layerNames: string[];
    /** @type {Object.<string, number>} */
    _layerNameToIndex: {
        [x: string]: number;
    };
    /** @type {RobotInfo} */
    _robotInfo: RobotInfo;
    /** @type {string[]} */
    _dofNames: string[];
    /** @type {Object.<string, number>} */
    _dofNamesToIndices: {
        [x: string]: number;
    };
    /**
     * current state for each layer
     * @type {Array.<LayerState>}*/
    _layerStates: Array<LayerState>;
    /**
     * previous state for each layer
     * @type {Array.<LayerState>}*/
    _previousLayerStates: Array<LayerState>;
    /**
     * full combined system state
     * @type {LayerState} */
    _systemState: LayerState;
    /**
     * previous combined system state
     * @type {LayerState}*/
    _previousSystemState: LayerState;
    /** @type {Object} */
    _blackboard: any;
    /** @type {Array.<*>} */
    _outputs: Array<any>;
    /** @type {Clock} */
    _clock: Clock;
    /** @type {LayerCombiner} */
    _layerCombiner: LayerCombiner;
    /** @type {string} */
    _modalityName: string;
    /** @type {DOFGlobalAlignment} */
    _dofAlignment: DOFGlobalAlignment;
    /** @type {number[]} */
    _sortedDOFIndices: number[];
    /** @type {Array.<boolean[]>} */
    _layerDOFFlags: Array<boolean[]>;
    /** @type {DOFInfo[]} */
    _dofInfoList: DOFInfo[];
    /** @type {number} */
    _minimumUpdateDelay: number;
    /**
     * @param {string} modality
     *
     * @return {MotionTimeline}
     */
    getModalityDelegate(modality: string): MotionTimeline;
    /**
     * @return {Clock}
     */
    getClock(): Clock;
    /**
     * @return {string}
     */
    getName(): string;
    /**
     * @param {string} layerName
     * @param {string[]} [dofs]
     */
    createLayer(layerName: string, dofs?: string[]): void;
    /**
     * @return {Array.<string>}
     */
    getLayerNames(): Array<string>;
    /**
     * @return {LayerCombiner}
     */
    getLayerCombiner(): LayerCombiner;
    /**
     * get the current combined state for the timeline.
     * the state will combine all layers by default, or optionally just a
     * specified subset of layers.
     * @param {string[]} [layerNames] - the subset of layers to combine (defaults to all layers)
     * @return {LayerState}
     */
    getCurrentState(layerNames?: string[]): LayerState;
    /**
     * @param {MotionGenerator} motionGenerator
     * @param {string} layerName
     * @return {MotionGenerator} - the motion generator, or null if add failed
     */
    add(motionGenerator: MotionGenerator, layerName: string): MotionGenerator;
    /**
     * Remove any clips that end on or before cullToTime.
     *
     * @param {jibo.animate.Time} cullToTime
     */
    cullUpToTime(cullToTime: jibo.animate.Time): void;
    /**
     * @param {jibo.animate.Time} currentTime
     */
    render(currentTime: jibo.animate.Time): void;
    addOutput(output: any): void;
    removeOutput(output: any): void;
    /**
     * @return {Object[]}
     */
    getOutputs(): any[];
    /**
     * compute velocity between two layer states, storing the result in the second state
     * @param {LayerState} previousLayerState
     * @param {LayerState} currentLayerState
     */
    computeVelocity(previousLayerState: LayerState, currentLayerState: LayerState): void;
    update(): void;
    /**
     * @param {string} layerName
     * @return {string[]}
     */
    getDOFsForLayer(layerName: string): string[];
}
import LayerState from "./LayerState.js";
import DOFGlobalAlignment from "../../ifr-motion/base/DOFGlobalAlignment.js";
