export default CyclicMath;
declare function CyclicMath(): void;
declare namespace CyclicMath {
    /**
     * Return the angle whose value is closest to "referenceAngle" and
     * with the same angular position as "angle"
     *
     * @param {number} angle
     * @param {number} referenceAngle
     */
    function closestEquivalentRotation(angle: number, referenceAngle: number): number;
}
