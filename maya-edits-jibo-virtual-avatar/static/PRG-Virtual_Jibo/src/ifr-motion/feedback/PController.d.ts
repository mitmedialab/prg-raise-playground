export default PController;
declare class PController {
    setTarget(time: any, position: any, velocity: any): void;
    _targetTime: any;
    _targetPosition: any;
    _targetVelocity: any;
    acceptFeedback(receivedTime: any, measuredPosition: any, measuredVelocity: any, targetVelocity: any): void;
    _lastObservationTime: any;
    _lastObservedPosition: any;
    _lastObservedVelocity: any;
    _lastReportedTargetVelocity: any;
    /**
     *
     * @param {Time} time
     */
    calculateForTime(time: Time): void;
    _lastError: number;
    _commandVelocity: number;
    _commandAcceleration: number;
    /**
     *
     * @param {Time} time
     */
    predictedPosition(time: Time): number;
    getCommandVelocity(): number;
    getCommandAcceleration(): number;
    /**
     *
     * @param {Time} timeSent
     * @param {number} commandVelocity
     * @param {number} velocityLimit
     */
    noteCommandSent(timeSent: Time, commandVelocity: number, velocityLimit: number): void;
}
