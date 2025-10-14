import SampleCombiner from "./SampleCombiner.js";

/**
 * @param {RobotInfo} robotInfo
 *
 * @constructor
 * @extends SampleCombiner
 */
class MixedSampleCombiner extends SampleCombiner {
    constructor(robotInfo) {
        super();

        const dofCount = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames().length;
        /** @type {Object.<string, number>} */
        this._dofNamesToIndices = robotInfo.getKinematicInfo().getDefaultPose().getDOFNamesToIndices();

        /** @type {SampleCombiner[]} */
        this._combinerList = new Array(dofCount).fill(null);
    }

    /**
     * Sets which combiner to use for the specified DOFs.
     *
     * @param {string[]} dofNames
     * @param {SampleCombiner} combiner
     */
    addCombiner(dofNames, combiner) {
        for (let i = 0; i < dofNames.length; i++) {
            this._combinerList[this._dofNamesToIndices[dofNames[i]]] = combiner;
        }
    }

    /**
     * Combines samples using whichever combiner is specified for the given DOF.
     *
     * @param {number} dofIndex
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew
     * @param {Object.<string, string|number|boolean>} properties
     * @return {number[]}
     * @override
     */
    combineSamples(dofIndex, samplePrev, sampleNew, properties) {
        const combiner = this._combinerList[dofIndex];
        if (!combiner) {
            throw new Error("no combiner specified for DOF: " + dofIndex);
        }
        return combiner.combineSamples(dofIndex, samplePrev, sampleNew, properties);
    }
}

export default MixedSampleCombiner;
