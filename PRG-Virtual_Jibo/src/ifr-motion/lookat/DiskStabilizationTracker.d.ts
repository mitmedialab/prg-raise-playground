export default DiskStabilizationTracker;
/**
 *
 * @param {LookatNode} lookatNode
 * @param {DOFGlobalAlignment} dofAligner
 * @param {string[]} parentDiskDOFNames
 * @constructor
 */
declare function DiskStabilizationTracker(lookatNode: LookatNode, dofAligner: DOFGlobalAlignment, parentDiskDOFNames: string[]): void;
declare class DiskStabilizationTracker {
    constructor(lookatNode: LookatNode, dofAligner: DOFGlobalAlignment, parentDiskDOFNames: string[]);
    /**
     *
     * @param {Pose} currentPose
     * @param {Pose} optimalPoseForCurrentTarget
     * @param {THREE.Vector3} currentTarget
     * @returns {Pose}
     */
    computeStabilizationDelta: (currentPose: Pose, optimalPoseForCurrentTarget: Pose, currentTarget: THREE.Vector3) => Pose;
    /**
     * This function computes the portion of each node's velocity that is used to stabilize it against
     * parent motion (e.g., the portion that would be produced by computeStabilizationDelta).  It then subtracts
     * that portion off, and returns the remainder which represents the post-stabilized motion of the node.  These
     * velocities are computed for each dof used by this node, and provided through the inplacePostStabilizationPose
     * argument.
     *
     * @param {Pose} currentPose - current pose and velocities (can be same as inplacePostStabilizationPose)
     * @param {Pose} inplacePostStabilizationPose - inplace argument to receive computed velocities (other values unchanged)
     * @param {THREE.Vector3} target - stabilize with respect to this target
     * @param {number} [rejectionVelocityThreshold=0] - limit the delta component (represented as raw distance over 1/50s) related to stabilization to this value (0 means no limit)
     */
    decomposeVelocity: (currentPose: Pose, inplacePostStabilizationPose: Pose, target: THREE.Vector3, rejectionVelocityThreshold?: number) => void;
    /**
     * Reset between tracking sessions, so the first frame of a new track isn't treated
     * as part of the last tracking (with a large jump).  When computeStabilizationDelta is
     * called multiple times in a row with no intervening reset, it is assumed to be part of
     * a single stabilization session.
     */
    reset: () => void;
}
import Pose from "../base/Pose.js";
