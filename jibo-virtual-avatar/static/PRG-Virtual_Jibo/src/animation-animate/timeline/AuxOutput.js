/**
 * Interface for auxiliary output delegates.
 *
 * @class AuxOutputDelegate
 * @private
 */
class AuxOutputDelegate {
    /* interface definition:        */
    /* eslint-disable no-unused-vars */

    /**
     * @private
     */
    constructor() {
        /**
         * Updates the delegate with the latest DOF values.
         *
         * @param {Time} timestamp - Timestamp of the latest DOF calculation.
         * @param {Object.<string, Object>} dofValues - DOF value map.
         * @param {Object} metadata - Rendering metadata/properties.
         */
        this.display = function(timestamp, dofValues, metadata) {
            // Interface method - same signature as original
        };
    }

    /* end interface definition:        */
    /* eslint-enable no-unused-vars */
}

/**
 * Auxiliary timeline output for alternative renderers, additional body services, logging/debugging, etc.
 *
 * @param {RobotInfo} robotInfo
 * @param {AuxOutputDelegate} outputDelegate
 * @constructor
 */
class AuxOutput {
    constructor(robotInfo, outputDelegate) {
        /** @type {RobotInfo} */
        this.robotInfo = robotInfo;
        /** @type {AuxOutputDelegate} */
        this.outputDelegate = outputDelegate;
        /** @type {string[]} */
        this.dofNames = robotInfo.getKinematicInfo().getDefaultPose().getDOFIndicesToNames();
        /** @type {Array.<Object.<string, Object>>} */
        this.dofValuesList = [{}, {}];
        /** @type {number} */
        this.tickCount = 0;
    }

    /**
     * @param {Time} time
     * @param {Pose} pose
     * @param {Object} blackboard
     */
    handleOutput(time, pose, blackboard) {
        /** @type {Object.<string, Object>} */
        const dofValues = this.dofValuesList[this.tickCount % this.dofValuesList.length];
        for (let dofIndex = 0; dofIndex < this.dofNames.length; dofIndex++) {
            const dofValue = pose.getByIndex(dofIndex, 0);
            dofValues[this.dofNames[dofIndex]] = dofValue;
        }

        this.outputDelegate.display(time, dofValues, blackboard);
        this.tickCount++;
    }
}

export default AuxOutput;
