export default TrackPolicyTriggerOnOtherNode;
declare class TrackPolicyTriggerOnOtherNode {
    /**
     * Enabled/disable this trigger
     * @param {boolean} trigger
     */
    setTriggerThisNodeOnOtherNode(trigger: boolean): void;
    _triggerThisNodeWhenOtherTracks: boolean;
    /**
     *
     * @param {LookatNodeDistanceReport} lookatNodeDistanceReport
     * @param {number} timeDelta
     * @return {StartStatus}
     * @override
     */
    override shouldStartTracking(lookatNodeDistanceReport: LookatNodeDistanceReport, timeDelta: number): StartStatus;
    _otherNodeIsTracking: boolean;
    /**
     * Will be called when the TrackPolicy starts a track
     */
    notifyTrackStarted(): void;
    /**
     * Will be called when the TrackPolicy stops tracking
     */
    notifyTrackStopped(): void;
    /**
     * Called each time a TrackPolicy updates, passes in current mode
     * @param {TrackMode} trackMode
     */
    notifyTrackMode(trackMode: TrackMode): void;
}
