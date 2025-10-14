export default RelativeTimeClip;
/**
 * @param {number} inPoint - clip start time in seconds.
 * @param {number} outPoint - clip end time in seconds.
 * @param {number} speed - speed modifier (2 means twice as fast)
 * @constructor
 */
declare function RelativeTimeClip(inPoint: number, outPoint: number, speed: number): void;
declare class RelativeTimeClip {
    constructor(inPoint: number, outPoint: number, speed: number);
    /**
     * @return {number}
     */
    getInPoint: () => number;
    /**
     * @return {number}
     */
    getOutPoint: () => number;
    /**
     * @return {number}
     */
    getSpeed: () => number;
    /**
     * @return {number}
     */
    getDuration: () => number;
    /**
     * Gets the time in seconds relative to the source data for the given "clip time" in seconds.
     * @param {number} clipTime - time in seconds relative to the start of the clip
     * @return {number} - time in seconds relative to the start of the source data
     */
    getSourceTime: (clipTime: number) => number;
}
