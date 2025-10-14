export default ExtraMath;
declare namespace ExtraMath {
    function convertDirectionLocalToWorld(frame: THREE.Object3D, localDirection: THREE.Vector3, inplaceResult: THREE.Vector3): any;
    /**
     * Find a Vector3 orthogonal to the given Vector3.
     *
     * @param {THREE.Vector3} direction
     * @param {THREE.Vector3} inplaceResult - (may be null or omitted or the same instance as direction)
     */
    function findOrthogonal(direction: THREE.Vector3, inplaceResult: THREE.Vector3): THREE.Vector3;
    function quatFromAxisAngle(axis: THREE.Vector3, angle: number, inplaceQuaternion: THREE.Quaternion): Quaternion;
    function toString(vec3: any): string;
}
