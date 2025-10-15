export default ScaleSampleCombiner;
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
declare class ScaleSampleCombiner extends SampleCombiner {
    constructor(robotInfo: any, unityScalePose: any, zeroScalePose: any, dofNames: any);
    _unityScales: any[];
    _zeroScales: any[];
}
import SampleCombiner from "./SampleCombiner.js";
