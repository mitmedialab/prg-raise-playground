export default MotionGenerator;
/**
 * @constructor
 */
declare class MotionGenerator {
    /**
     * @returns {string}
     * @virtual
     */
    getName(): string;
    /**
     * @returns {jibo.animate.Time}
     * @virtual
     */
    getStartTime(): jibo.animate.Time;
    /**
     * Returns true if this generator ends after the given time.
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @virtual
     */
    endsAfter(time: jibo.animate.Time): boolean;
    /**
     * Returns false if this generator has data for any DOF, true otherwise.
     * @returns {boolean}
     * @virtual
     */
    isEmpty(): boolean;
    /**
     * Returns true if this generator has data for the specified DOF past the given time.
     * @param {number} dofIndex
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @virtual
     */
    dofEndsAfter(dofIndex: number, time: jibo.animate.Time): boolean;
    /**
     * Force this motion to end the specified tracks at or before cropTime.  If a track
     * already ends before cropTime it is unchanged.  If a track starts after
     * cropTime it is completely removed.
     *
     * @param {jibo.animate.Time} cropTime - crop to end at this time if necessary
     * @param {number[]} dofIndices - crop tracks for these dofs
     * @virtual
     */
    cropEnd(cropTime: jibo.animate.Time, dofIndices: number[]): void;
    /**
     * get all DOFs that are involved in this motion
     *
     * @returns {number[]}
     * @virtual
     */
    getDOFIndices(): number[];
    /**
     * @param {jibo.animate.Time} currentTime
     * @virtual
     */
    notifyUpdateStarted(currentTime: jibo.animate.Time): void;
    /**
     * @param {jibo.animate.Time} currentTime
     * @virtual
     */
    notifyUpdateFinished(currentTime: jibo.animate.Time): void;
    /**
     * @virtual
     */
    notifyRemoved(): void;
    /**
     * @param {number} dofIndex
     * @param {LayerState} partialRender
     * @param {Object} blackboard
     * @returns {number[]}
     * @virtual
     */
    getDOFState(dofIndex: number, partialRender: LayerState, blackboard: any): number[];
}
