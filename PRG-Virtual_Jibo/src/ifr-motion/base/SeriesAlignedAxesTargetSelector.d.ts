export default SeriesAlignedAxesTargetSelector;
/**
 * CyclicDOFTargetSelector for the case where the parent motion we are compensating
 * for is on-axis with our own motion, and therefore the solution can be a computed
 * as a scalar without 3d math.
 *
 * @param {string} dofName
 * @param {string[]} alignedParents - all parents that contribute to motion of this joint (all must be axis aligned)
 * @param {number[]} parentDirections - sign of the direction for these parents, relative to us (-1 or 1)
 * @constructor
 * @extends CyclicDOFTargetSelector
 */
declare class SeriesAlignedAxesTargetSelector extends CyclicDOFTargetSelector {
    constructor(dofName: any, alignedParents: any, parentDirections: any);
    _alignedParents: any;
    _parentDirections: any;
}
import CyclicDOFTargetSelector from "./CyclicDOFTargetSelector.js";
