/**
 * @param {jibo.animate.Time} time
 * @param {Pose} pose
 * @constructor
 */
class LayerState {
    constructor(time, pose) {
        /**
         * @return {jibo.animate.Time}
         */
        this.getTime = function() {
            return time;
        };

        /**
         * @param {jibo.animate.Time} newTime
         */
        this.setTime = function(newTime) {
            time = newTime;
        };

        /**
         * @return {Pose}
         */
        this.getPose = function() {
            return pose;
        };

        /**
         * @return {Array.<string>}
         */
        this.getDOFNames = function() {
            return pose.getDOFNames();
        };

        /**
         * @param {string} dofName
         * @return {number[]}
         */
        this.getDOFState = function(dofName) {
            return pose.get(dofName);
        };

        /**
         * @param {number} dofIndex
         * @return {number[]}
         */
        this.getDOFStateByIndex = function(dofIndex) {
            return pose.getByIndex(dofIndex);
        };

        /**
         * @param {string} dofName
         * @param {number[]} dofState
         */
        this.setDOFState = function(dofName, dofState) {
            pose.set(dofName, dofState);
        };

        /**
         * @param {number} dofIndex
         * @param {number[]} dofState
         */
        this.setDOFStateByIndex = function(dofIndex, dofState) {
            pose.setByIndex(dofIndex, dofState);
        };

        /**
         * @param {jibo.animate.Time} [newTime]
         * @return {LayerState}
         */
        this.getCopy = function(newTime) {
            if (newTime === null || newTime === undefined) {
                newTime = time;
            }
            return new LayerState(newTime, pose.getCopy());
        };
    }
}

export default LayerState;