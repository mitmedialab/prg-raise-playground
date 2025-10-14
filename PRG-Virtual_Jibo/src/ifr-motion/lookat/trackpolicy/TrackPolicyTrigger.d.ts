export default TrackPolicyTrigger;
declare class TrackPolicyTrigger {
    /**
     *
     * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
     * @param {number} timeDelta
     * @return {?StartStatus}
     */
    shouldStartTracking(lookatNodeDistanceReport: LookatNodeDistanceReport, timeDelta: number): StartStatus | null;
    /**
     *
     * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
     * @param {number} timeDelta
     * @return {?boolean}
     */
    shouldStopTracking(lookatNodeDistanceReport: LookatNodeDistanceReport, timeDelta: number): boolean | null;
    /**
     * Called to notify trigger to reset state (start/end of lookat)
     */
    reset(): void;
}
/**
 * Enum Values for track mode, informs Lookat to go to target or delay motion.
 */
type StartStatus = string;
declare namespace StartStatus {
    let YES: string;
    let NO: string;
    let LATER: string;
}
