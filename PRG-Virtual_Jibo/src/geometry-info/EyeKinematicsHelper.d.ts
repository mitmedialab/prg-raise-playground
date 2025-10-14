export default EyeKinematicsHelper;
declare namespace EyeKinematicsHelper {
    /**
     * Compute the vertex positions that would result from the given set of dof
     * values, and return them in a map (does not actually move the vertices).
     *
     * Keys of dofValues argument are expected to be DOF names; keys of the
     * returned map are the vertex names.
     *
     * Only gets values from TranslationControl types
     *
     * @param {Object.<string, Object>} dofValues
     * @param {RobotInfo} robotInfo - use the eye dof controls from this robot info to compute the values
     * @return {Object.<string, THREE.Vector3>} map from vertices to local positions
     */
    function verticesForDOFValues(dofValues: {
        [x: string]: any;
    }, robotInfo: RobotInfo): {
        [x: string]: THREE.Vector3;
    };
}
