export default MotionEventIterator;
/**
 * @param {MotionEvent[]} motionEvents
 * @param {RelativeTimeClip} clip
 * @constructor
 */
declare function MotionEventIterator(motionEvents: MotionEvent[], clip: RelativeTimeClip): void;
declare class MotionEventIterator {
    constructor(motionEvents: MotionEvent[], clip: RelativeTimeClip);
    /**
     * Gets whether or not there is at least one event available for the given clip time.
     * @param {number} clipTime - clip time in seconds
     * @return {boolean}
     */
    hasNext: (clipTime: number) => boolean;
    /**
     * Gets the next event for the given clip time, or null if there is no such event available.
     * @param {number} clipTime - clip time in seconds
     * @return {MotionEvent}
     */
    next: (clipTime: number) => MotionEvent;
    /**
     * Resets the iterator back to the beginning of the event list.
     */
    reset: () => void;
}
