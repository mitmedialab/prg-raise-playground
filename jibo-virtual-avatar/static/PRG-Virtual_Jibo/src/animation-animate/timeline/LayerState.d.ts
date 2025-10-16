export default LayerState;
/**
 * @param {jibo.animate.Time} time
 * @param {Pose} pose
 * @constructor
 */
declare class LayerState {
    constructor(time: any, pose: any);
    /**
     * @return {jibo.animate.Time}
     */
    getTime: () => jibo.animate.Time;
    /**
     * @param {jibo.animate.Time} newTime
     */
    setTime: (newTime: jibo.animate.Time) => void;
    /**
     * @return {Pose}
     */
    getPose: () => Pose;
    /**
     * @return {Array.<string>}
     */
    getDOFNames: () => Array<string>;
    /**
     * @param {string} dofName
     * @return {number[]}
     */
    getDOFState: (dofName: string) => number[];
    /**
     * @param {number} dofIndex
     * @return {number[]}
     */
    getDOFStateByIndex: (dofIndex: number) => number[];
    /**
     * @param {string} dofName
     * @param {number[]} dofState
     */
    setDOFState: (dofName: string, dofState: number[]) => void;
    /**
     * @param {number} dofIndex
     * @param {number[]} dofState
     */
    setDOFStateByIndex: (dofIndex: number, dofState: number[]) => void;
    /**
     * @param {jibo.animate.Time} [newTime]
     * @return {LayerState}
     */
    getCopy: (newTime?: jibo.animate.Time) => LayerState;
}
