import SampleCombiner from "./SampleCombiner.js";

/**
 * @constructor
 * @extends SampleCombiner
 */
class AddSampleCombiner extends SampleCombiner {
    constructor() {
        super();
    }

    /**
     * Adds the components of sampleNew to the components of samplePrev
     *
     * @param {number} dofIndex
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew
     * @param {Object.<string, string|number|boolean>} properties
     * @return {number[]}
     * @override
     */
    combineSamples(dofIndex, samplePrev, sampleNew, properties) { // eslint-disable-line no-unused-vars
        const r = [];

        for (let i = 0; i < samplePrev.length; i++) {
            if (i < sampleNew.length) {
                r.push(samplePrev[i] + sampleNew[i]);
            } else {
                r.push(samplePrev[i]);
            }
        }

        return r;
    }
}

export default AddSampleCombiner;