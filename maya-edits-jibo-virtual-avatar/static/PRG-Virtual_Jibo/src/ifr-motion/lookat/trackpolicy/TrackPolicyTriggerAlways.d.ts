export default TrackPolicyTriggerAlways;
declare class TrackPolicyTriggerAlways {
    /**
     *
     * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
     * @param {number} timeDelta
     * @return {StartStatus}
     * @override
     */
    override shouldStartTracking(lookatNodeDistanceReport: LookatNodeDistanceReport, timeDelta: number): StartStatus;
    /**
     *
     * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
     * @param {number} timeDelta
     * @return {?boolean}
     */
    shouldStopTracking(lookatNodeDistanceReport: LookatNodeDistanceReport, timeDelta: number): boolean | null;
}
