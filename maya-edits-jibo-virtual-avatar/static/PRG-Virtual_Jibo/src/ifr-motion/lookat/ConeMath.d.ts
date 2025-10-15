export default ConeMath;
declare class ConeMath {
    /**
     * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
     * rays from that same origin.  Consider the plane on which both cone1Axis and cone2Axis lie.
     * If cone1 and cone2 intersect, both intersections will project down to the same line on that plane (or,
     * there may be a single intersection, which will already lie on the plane).  This function finds the on-plane
     * projection of the intersection(s) between the cones.  It describes that intersection by the angle from cone1Axis
     * to that intersection ray projection, with positive angles moving in the direction towards cone1Axis.
     *
     * Behavior not defined if there is no solution or infinite solutions (equal plane axes and angles).
     *
     * @param {number} angleBetweenCones - the angle between the cone axes (positive number)
     * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
     * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
     * @returns {number} the angle from cone1 axis to the projection of the intersection of the cones (positive angles in the direction of cone2 axis)
     */
    flatConeIntersection(angleBetweenCones: number, cone1Angle: number, cone2Angle: number): number;
    /**
     * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
     * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
     * Behavior is undefined in the 0, 1, or infinite intersection cases.
     *
     * @param {THREE.Vector3} cone1Axis - central axis of cone1, normalized, pointing the direction of increasing radius
     * @param {THREE.Vector3} cone2Axis - central axis of cone2, normalized, pointing the direction of increasing radius
     * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
     * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
     * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
     * @return {THREE.Vector3} a vector representing an intersection line of the 2 cones (will be inplaceVec if provided)
     */
    sharedOriginConeIntersection(cone1Axis: THREE.Vector3, cone2Axis: THREE.Vector3, cone1Angle: number, cone2Angle: number, inplaceVec?: THREE.Vector3): THREE.Vector3;
    /**
     * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
     * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
     * Behavior is undefined in the 0, 1, or infinite intersection cases.
     *
     * Cone1 is defined to have axis (0,0,1), and cone2 is defined to have axis (cone2AxisX, 0, cone2AxisZ); that is, it lies on the
     * "y" plane.  Any 2 cones can be rotated to this configuration without affecting their relationship, and this configuration
     * simplifies the math significantly.  Cone2 axis must be normalized.  Axes point in the direction of increasing radius.
     *
     *
     * @param {number} cone2AxisX - X value of central axis of cone2,
     * @param {number} cone2AxisZ - Z value of central axis of cone2,
     * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
     * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
     * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
     * @return {THREE.Vector3} a vector representing an intersection line of the 2 cones (will be inplaceVec if provided)
     */
    sharedOriginConeIntersectionSimplified(cone2AxisX: number, cone2AxisZ: number, cone1Angle: number, cone2Angle: number, inplaceVec?: THREE.Vector3): THREE.Vector3;
    /**
     * Cone1 and cone2 are cones with the same origin; if they intersect, their intersections will be 1 or 2 (or infinite)
     * rays from that same origin.  In case where there are 2 intersections, this function finds one of those intersections.
     * Behavior is undefined in the 0, 1, or infinite intersection cases.
     *
     * The answer is expressed as the "flat angle" of the result, e.g., the angle from cone1Axis to the projection
     * of the intersection ray on the plane defined by the two axes.  0 means the same as cone1Axis, positive
     * values move in the direction of cone2axis
     *
     *
     * @param {number} angleBetweenCones - the angle between the 2 cone axes
     * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
     * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
     * @return {number} the flat angle identifying the intersecting ray
     */
    sharedOriginConeIntersectionAngle(angleBetweenCones: number, cone1Angle: number, cone2Angle: number): number;
    /**
     * Consider a cone viewed from the side, projected onto a plane that contains its central axis.
     * All of the rays that make up that cone are also projected onto this plane.  A single pair
     * of rays is identified by an angle on the plane from the cone axis to the projection of the
     * ray ("flatAngle").
     *
     * This function converts this "flatAngle" identification of the ray into an identification
     * of the ray as a rotation around the axis of the original, unprojected cone.  The zero point
     * for that around-axis rotation is defined to be the direction of +flatAngle.  That is, the zero-rotation
     * ray is the ray most in the flatAngle direction, and if that ray is rotated by by the value computed
     * here its projecting will be flatAngle from the cone axis
     *
     *
     * @param {number} flatAngle - the flat angle from cone-axis to target ray projected onto the plane
     * @param {number} coneAngle - angle from the cone central axis to the cone walls
     * @returns {number} the rotation around coneAxis to get to the ray identified by flatAngle
     */
    flatAngleToConeRotation(flatAngle: number, coneAngle: number): number;
    /**
     * Operates on 2 cones with the same origin.
     * Get the around-axis rotation for each cone that would move their canonical ray
     * into the the point of intersection of the 2 cones.  The canonical ray for both
     * cones is defined as the ray most in the + direction where + is defined as the direction
     * from cone1Axis to cone2Axis.
     *
     * @param {number} angleBetweenCones - the angle between the cone axes
     * @param {number} cone1Angle - angle from the cone central axis to the cone walls for cone1
     * @param {number} cone2Angle - angle from the cone central axis to the cone walls for cone2
     * @returns {*[]} a two element array rot the around-axis rotation required for cone1 and cone2
     */
    coneIntersectionAsDualRotations(angleBetweenCones: number, cone1Angle: number, cone2Angle: number): any[];
    /**
     * Cone's origin lies on plane.  Cone has axis (0,0,1) and plane has normal
     * (planeNormalX, 0, planeNormalZ), (must be normalized).  Cone can be defined by
     * rotating a ray which is "coneAngle" from Z around the Z axis.  This function finds the ray from that
     * rotation which is perpendicular to the plane.
     *
     * In other words, this function finds the direction which is "coneAngle" from the Z axis and 0 degrees (parallel)
     * to "planeNormal".
     *
     * There are either 0, 1, 2, or infinite solutions based on the arguments; the behavior of this function is
     * defined only in the 2 solution cases, when it will return one of the two solutions.
     *
     * @param {number} coneAngle - angle from the cone central axis to the cone walls
     * @param {number} planeNormalX - x value of the plane normal
     * @param {number} planeNormalZ - y value of the plane normal
     * @param {THREE.Vector3} [inplaceVec] - optional, solution will be placed here if present
     * @return {THREE.Vector3} a vector representing an a ray on the cone perpendicular to the plane (will be inplaceVec if provided)
     */
    sharedOriginPlaneConeIntersectionSimplified(coneAngle: number, planeNormalX: number, planeNormalZ: number, inplaceVec?: THREE.Vector3): THREE.Vector3;
    /**
     * Cone's origin lies on plane.  Cone can be defined by rotating a ray which is "coneAngle" from Z around the
     * Z axis.  This function finds the ray from that rotation which is perpendicular to the plane.
     *
     * In other words, this function finds the direction which is "coneAngle" from the Z axis and 0 degrees (parallel)
     * to "planeNormal".
     *
     * There are either 0, 1, 2, or infinite solutions based on the arguments; the behavior of this function is
     * defined only in the 2 solution cases, when it will return one of the two solutions.
     *
     * The direction is described as a rotation from the min-vec on the plane around the plane axis.  The min-vec
     * is the direction on the plane which is defined by rotating the plane normal PI/2 degrees directly away from the cone
     * axis.  The return value will be a rotation around plane normal from min-vec to the solution direction.
     *
     * @param {number} coneAngle - angle from the cone central axis to the cone walls
     * @param {number} planeNormalOffZ - angle from coneAxis to planeNormal
     * @returns {number} rotation from plane min vec to on-plane-direction perpendicular to the cone
     */
    rotationFromMinPlaneDirToIntersector(coneAngle: number, planeNormalOffZ: number): number;
}
