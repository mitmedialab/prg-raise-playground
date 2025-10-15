export default KinematicGroup;
/**
 *
 * @param {ModelControlGroup} modelControlGroup
 * @param {THREE.Object3D} hierarchyRoot
 * @constructor
 */
declare class KinematicGroup {
    /**
     * @param {THREE.Vector3} hierarchyRoot
     * @returns {Object.<string, THREE.Object3D>}
     */
    static generateTransformMap(hierarchyRoot: THREE.Vector3): {
        [x: string]: THREE.Object3D;
    };
    constructor(modelControlGroup: any, hierarchyRoot: any);
    /**
     * @type {ModelControlGroup}
     * @private
     */
    private _modelControlGroup;
    /**
     * @type {THREE.Object3D}
     * @private
     */
    private _hierarchyRoot;
    /** @type {Object<string, THREE.Object3D>} */
    _modelMap: {
        [x: string]: THREE.Object3D;
    };
    /**
     * @type {Pose}
     * @private
     */
    private _lastPose;
    /**
     * if "true", we assume that no one else is modifying our transform hierarchy, so we can
     * lazy-update because we know which transforms will have changed
     *
     * @type {boolean}
     * @private
     */
    private _assumeKGHasSoleHierarcyControl;
    /**
     * Get a copy of this KinematicGroup, including a copy of the transform hierarchy and a copy of the ModelControls,
     * bound to the new hierarchy.  If requiredTransforms is present, the copy will include a sub-tree of the original
     * hierarchy, with only transforms required to connect the required transforms to the root.  Only ModelControls
     * associated with those branches will be included.
     *
     * If kinematicOnly is true, the copy will only include controls that are associated with the motion of transforms,
     * not any render-only controls (e.g, texture, color, etc.).
     *
     * @param {string[]} [requiredTransforms] - if present, only include chains connecting root to required transforms
     * @param {boolean} [kinematicOnly=true] - if true, only include ModelControls that represent kinematic motions
     * @returns {KinematicGroup}
     */
    getCopy(requiredTransforms?: string[], kinematicOnly?: boolean): KinematicGroup;
    /**
     *
     * @param {Pose} inplacePose
     * @return {Pose}
     */
    getPose(inplacePose: Pose): Pose;
    /**
     *
     * @param {Pose} pose
     */
    setFromPose(pose: Pose): void;
    /**
     * Update the world coordinate frames of the attached hierarchy.  This function relies on all
     * modifies of the Object3D tree setting the _nodeDirtyToKG flag on the objects.
     */
    updateWorldCoordinateFrames(): void;
    /**
     * Called by updateWorldCoordinateFrames to recursively update the rest of the tree
     * as necessary.
     *
     * @param {THREE.Object3D} node - node to update (can NOT be the root of the tree)
     * @param {boolean} parentDirty - true if the parents of this node have been updated
     * @private
     */
    private _updateWorldCoordinateFramesRecurse;
    /**
     * @return {string[]}
     */
    getDOFNames(): string[];
    /**
     * @return {ModelControlGroup}
     */
    getModelControlGroup(): ModelControlGroup;
    /**
     * @return {THREE.Object3D}
     */
    getRoot(): THREE.Object3D;
    /**
     * @return {Object<string, THREE.Object3D>}
     */
    getModelMap(): {
        [x: string]: THREE.Object3D;
    };
    /**
     * @param {string} transformName
     * @return {THREE.Object3D}
     */
    getTransform(transformName: string): THREE.Object3D;
    toString(): string;
}
import Pose from "../base/Pose.js";
