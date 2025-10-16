/**
 * @constructor
 */
class MotionGenerator {
    constructor() {
        // Base constructor - same signature as original
    }

    /* superclass definition:        */
    /* eslint-disable no-unused-vars */

    /**
     * @returns {string}
     * @virtual
     */
    getName() {
        // Virtual method - same signature as original
    }

    /**
     * @returns {jibo.animate.Time}
     * @virtual
     */
    getStartTime() {
        // Virtual method - same signature as original
    }

    /**
     * Returns true if this generator ends after the given time.
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @virtual
     */
    endsAfter(time) {
        // Virtual method - same signature as original
    }

    /**
     * Returns false if this generator has data for any DOF, true otherwise.
     * @returns {boolean}
     * @virtual
     */
    isEmpty() {
        // Virtual method - same signature as original
    }

    /**
     * Returns true if this generator has data for the specified DOF past the given time.
     * @param {number} dofIndex
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @virtual
     */
    dofEndsAfter(dofIndex, time) {
        // Virtual method - same signature as original
    }

    /**
     * Force this motion to end the specified tracks at or before cropTime.  If a track
     * already ends before cropTime it is unchanged.  If a track starts after
     * cropTime it is completely removed.
     *
     * @param {jibo.animate.Time} cropTime - crop to end at this time if necessary
     * @param {number[]} dofIndices - crop tracks for these dofs
     * @virtual
     */
    cropEnd(cropTime, dofIndices) {
        // Virtual method - same signature as original
    }

    /**
     * get all DOFs that are involved in this motion
     *
     * @returns {number[]}
     * @virtual
     */
    getDOFIndices() {
        // Virtual method - same signature as original
    }

    /**
     * @param {jibo.animate.Time} currentTime
     * @virtual
     */
    notifyUpdateStarted(currentTime) {
        // Virtual method - same signature as original
    }

    /**
     * @param {jibo.animate.Time} currentTime
     * @virtual
     */
    notifyUpdateFinished(currentTime) {
        // Virtual method - same signature as original
    }

    /**
     * @virtual
     */
    notifyRemoved() {
        // Virtual method - same signature as original
    }

    /**
     * @param {number} dofIndex
     * @param {LayerState} partialRender
     * @param {Object} blackboard
     * @returns {number[]}
     * @virtual
     */
    getDOFState(dofIndex, partialRender, blackboard) {
        // Virtual method - same signature as original
    }
}

export default MotionGenerator;
