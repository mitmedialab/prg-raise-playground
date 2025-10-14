export default BasicMesh;
/**
 * @constructor
 */
declare function BasicMesh(): void;
declare class BasicMesh {
    /** @type {string} */
    name: string;
    /** @type {string} */
    skeletonFrameName: string;
    /** @type {THREE.Mesh} */
    mesh: THREE.Mesh;
    /** @type {Array.<string>} */
    boneFrameNames: Array<string>;
    /** @type {Array.<THREE.Bone>} */
    bones: Array<THREE.Bone>;
}
