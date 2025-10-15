export default DOFGlobalAlignment;
/**
 * Collection of tools to help alignment of DOFs accounting
 * for their global-space (world space) positions.
 *
 * @param {KinematicGroup} kinematicGroup
 * @param {Object.<string,CyclicDOFTargetSelector>} [customGlobalSelectors]
 * @constructor
 */
declare class DOFGlobalAlignment {
    constructor(kinematicGroup: any, customGlobalSelectors: any);
    /** @type {KinematicGroup} */
    _kinematicGroup: KinematicGroup;
    /** @type {Array.<string>} */
    _sortedDOFNames: Array<string>;
    /** @type {Object.<string,CyclicDOFTargetSelector>} */
    _globalTargetSelectors: {
        [x: string]: CyclicDOFTargetSelector;
    };
    /** @type {Object.<string,CyclicDOFTargetSelector>} */
    _localTargetSelectors: {
        [x: string]: CyclicDOFTargetSelector;
    };
    /**
     * Sort the provided list of dof names inplace by the order of the hierarchical location of
     * their corresponding transforms, from root to leaves.  Each node will precede
     * its children, and order amongst same-level nodes is arbitrary.  DOFs with no corresponding
     * transforms will be at the beginning of the list in an arbitrary order.
     *
     * @param {string[]} dofNames - inplace list of dofnames to be sorted
     * @return {string[]} the inplace dofNames list is sorted (modified) and also returned for convenience
     */
    sortDOFsByDepth: (dofNames: string[]) => string[];
    /**
     * Get the target selector for this DOF.  May be the default CyclicDOFTargetSelector,
     * or a custom implementation for this joint that takes into account parent motion
     * to find a better preferred direction.
     *
     * @param {string} dofName
     * @returns {CyclicDOFTargetSelector}
     */
    getGlobalTargetSelector: (dofName: string) => CyclicDOFTargetSelector;
    /**
     * Get the target selector for this DOF.
     *
     * @param {string} dofName
     * @returns {CyclicDOFTargetSelector}
     */
    getLocalTargetSelector: (dofName: string) => CyclicDOFTargetSelector;
    /**
     * Modifies toPose inplace to represent an equivalent orientation for each dof, but with the values
     * potentially modified to cyclically equivalent values to represent less global motion between
     * fromPose and toPose.
     *
     * @param {Pose} fromPose - starting position
     * @param {Pose} toPose - target position, will be modified to have the same orientation but less rotation
     * @param {string[]} [onDOFs] - computed for these dofs.  dofs from fomPose used if null or undefined
     */
    refineToGloballyClosestTargetPose: (fromPose: Pose, toPose: Pose, onDOFs?: string[]) => void;
    /**
     * Modifies toPose inplace to represent an equivalent orientation for each dof, with the values
     * computed to have each DOF have the least local motion to get to target.
     *
     * @param {Pose} fromPose - starting position
     * @param {Pose} toPose - target position, will be modified to have the same orientation but less rotation
     * @param {string[]} [onDOFs] - computed for these dofs.  dofs from fomPose used if null or undefined
     */
    refineToLocallyClosestTargetPose: (fromPose: Pose, toPose: Pose, onDOFs?: string[]) => void;
}
import CyclicDOFTargetSelector from "./CyclicDOFTargetSelector.js";
