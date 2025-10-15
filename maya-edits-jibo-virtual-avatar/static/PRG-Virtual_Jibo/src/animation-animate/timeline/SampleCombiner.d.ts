export default SampleCombiner;
declare class SampleCombiner {
    /**
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew
     * @param {number} dofIndex
     * @param {DOFInfo} dofInfo
     * @return {number[]}
     */
    combine(samplePrev: number[], sampleNew: number[], dofIndex: number, dofInfo: DOFInfo): number[];
    /**
     * @param {number} dofIndex
     * @param {number[]} samplePrev
     * @param {number[]} sampleNew
     * @param {Object.<string, string|number|boolean>} properties
     * @return {number[]}
     * @abstract
     */
    combineSamples(dofIndex: number, samplePrev: number[], sampleNew: number[], properties: {
        [x: string]: string | number | boolean;
    }): number[];
}
