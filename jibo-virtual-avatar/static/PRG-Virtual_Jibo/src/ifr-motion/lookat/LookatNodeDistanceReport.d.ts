export default LookatNodeDistanceReport;
declare class LookatNodeDistanceReport {
    /**
     * @param {Pose} holdPose
     * @param {Pose} optimalPose
     * @param {Pose} filteredOutput
     */
    compute(holdPose: Pose, optimalPose: Pose, filteredOutput: Pose): void;
    highestDistanceHoldToFiltered: number;
    highestDistanceHoldToOptimal: number;
    highestDistanceOptimalToFiltered: number;
    highestVelocityFiltered: number;
}
