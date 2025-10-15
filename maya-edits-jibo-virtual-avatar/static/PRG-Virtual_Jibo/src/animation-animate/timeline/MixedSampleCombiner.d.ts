export default MixedSampleCombiner;
/**
 * @param {RobotInfo} robotInfo
 *
 * @constructor
 * @extends SampleCombiner
 */
declare class MixedSampleCombiner extends SampleCombiner {
    constructor(robotInfo: any);
    /** @type {Object.<string, number>} */
    _dofNamesToIndices: {
        [x: string]: number;
    };
    /** @type {SampleCombiner[]} */
    _combinerList: SampleCombiner[];
    /**
     * Sets which combiner to use for the specified DOFs.
     *
     * @param {string[]} dofNames
     * @param {SampleCombiner} combiner
     */
    addCombiner(dofNames: string[], combiner: SampleCombiner): void;
}
import SampleCombiner from "./SampleCombiner.js";
