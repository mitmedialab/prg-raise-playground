export default AuxOutput;
/**
 * Auxiliary timeline output for alternative renderers, additional body services, logging/debugging, etc.
 *
 * @param {RobotInfo} robotInfo
 * @param {AuxOutputDelegate} outputDelegate
 * @constructor
 */
declare class AuxOutput {
    constructor(robotInfo: any, outputDelegate: any);
    /** @type {RobotInfo} */
    robotInfo: RobotInfo;
    /** @type {AuxOutputDelegate} */
    outputDelegate: AuxOutputDelegate;
    /** @type {string[]} */
    dofNames: string[];
    /** @type {Array.<Object.<string, Object>>} */
    dofValuesList: Array<{
        [x: string]: any;
    }>;
    /** @type {number} */
    tickCount: number;
    /**
     * @param {Time} time
     * @param {Pose} pose
     * @param {Object} blackboard
     */
    handleOutput(time: Time, pose: Pose, blackboard: any): void;
}
/**
 * Interface for auxiliary output delegates.
 *
 * @class AuxOutputDelegate
 * @private
 */
declare class AuxOutputDelegate {
    /**
     * Updates the delegate with the latest DOF values.
     *
     * @param {Time} timestamp - Timestamp of the latest DOF calculation.
     * @param {Object.<string, Object>} dofValues - DOF value map.
     * @param {Object} metadata - Rendering metadata/properties.
     */
    display: (timestamp: Time, dofValues: {
        [x: string]: any;
    }, metadata: any) => void;
}
