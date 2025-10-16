export default AnnotatedMotion;
/**
 * @param {Motion} motion
 * @param {MotionEvent[]} [events]
 * @constructor
 */
declare function AnnotatedMotion(motion: Motion, events?: MotionEvent[]): void;
declare class AnnotatedMotion {
    constructor(motion: Motion, events?: MotionEvent[]);
    /**
     * @return {Motion}
     */
    getMotion: () => Motion;
    /**
     * @return {number}
     */
    getEventCount: () => number;
    /**
     * @param {number} index
     * @return {MotionEvent}
     */
    getEvent: (index: number) => MotionEvent;
    /**
     * @return {MotionEvent[]}
     */
    getEvents: () => MotionEvent[];
    /**
     * @return {number}
     */
    getSpeed: () => number;
    /**
     * Set the speed of this motion relative to the source motion.
     * @param {number} speed - speed modifier (2 means twice as fast as the source motion)
     */
    setSpeed: (speed: number) => void;
}
import Motion from "./Motion.js";
import MotionEvent from "./MotionEvent.js";
