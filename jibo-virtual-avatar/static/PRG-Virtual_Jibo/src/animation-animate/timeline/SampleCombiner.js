class SampleCombiner {
    constructor() {
        // Base constructor - same signature as original
    }

    /**
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew  
     * @param {number} dofIndex
     * @param {DOFInfo} dofInfo
     * @return {number[]}
     */
    combine(samplePrev, sampleNew, dofIndex, dofInfo) {
        // Delegate to the abstract combineSamples method
        return this.combineSamples(dofIndex, samplePrev, sampleNew, dofInfo || {});
    }

    /**
     * @param {number} dofIndex
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew
     * @param {Object.<string, string|number|boolean>} properties
     * @return {number[]}
     * @abstract
     */
    combineSamples(dofIndex, samplePrev, sampleNew, properties) {
        // Abstract method - same signature as original
    }
}

export default SampleCombiner;