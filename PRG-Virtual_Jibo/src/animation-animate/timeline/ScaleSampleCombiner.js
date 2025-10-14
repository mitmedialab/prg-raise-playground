import SampleCombiner from "./SampleCombiner.js";

/**
 * Scale incoming samples by our samples.  Our samples will first be mapped
 * from their raw dof values, using linear interpolation, based on the 2 poses
 * provided the constructor.
 *
 * @param {RobotInfo} robotInfo
 * @param {Pose} unityScalePose - dof values to map to scale of 1 (defaults to 1's)
 * @param {Pose} zeroScalePose - dof values to map to scale of 0 (defaults to 0's)
 * @param {string[]} dofNames - used to initialize defaults.  should include at least all dofs that this combined will be combining
 * @constructor
 * @extends SampleCombiner
 */
class ScaleSampleCombiner extends SampleCombiner {
    constructor(robotInfo, unityScalePose, zeroScalePose, dofNames) {
        super();

        const dofCount = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames().length;
        /** @type {Object.<string, number>} */
        const dofNamesToIndices = robotInfo.getKinematicInfo().getDefaultPose().getDOFNamesToIndices();

        //init the interpolation mapping
        this._unityScales = new Array(dofCount).fill(1);
        this._zeroScales = new Array(dofCount).fill(0);

        //for some dofs, unity and zero may be the same value.  in those cases we will not scale.
        //use this epsilon when considering if the values are "the same"; we will modify the save
        //unity value to match the zero value so the runtime computation can just check with "==="
        const epsilon = 0.00001;

        for (let i = 0; i < dofNames.length; i++) {
            const dofName = dofNames[i];
            const dofIndex = dofNamesToIndices[dofName];
            if (unityScalePose != null && unityScalePose.get(dofName) != null) {
                this._unityScales[dofIndex] = unityScalePose.get(dofName)[0];
            } else {
                this._unityScales[dofIndex] = 1;
            }
            if (zeroScalePose != null && zeroScalePose.get(dofName) != null) {
                this._zeroScales[dofIndex] = zeroScalePose.get(dofName)[0];
            } else {
                this._zeroScales[dofIndex] = 0;
            }
            if (Math.abs(this._unityScales[dofIndex] - this._zeroScales[dofIndex]) < epsilon) {
                this._unityScales[dofIndex] = this._zeroScales[dofIndex];
            }
        }
    }

    /**
     * Scales all components of samplePrev by sampleNew's 0th component
     * mapped to a scale using unityScale and zeroScale values.
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
        const unityVal = this._unityScales[dofIndex];
        const zeroVal = this._zeroScales[dofIndex];
        let scale = 1;
        if (unityVal !== zeroVal) {
            scale = (sampleNew[0] - zeroVal) / (unityVal - zeroVal) + zeroVal;
        }
        if (isNaN(scale)) {
            scale = 1;
        }

        for (let i = 0; i < samplePrev.length; i++) {
            r.push(samplePrev[i] * scale);
        }
        return r;
    }
}

export default ScaleSampleCombiner;