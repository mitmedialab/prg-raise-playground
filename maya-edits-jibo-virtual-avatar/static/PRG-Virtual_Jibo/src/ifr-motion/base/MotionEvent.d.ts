export default MotionEvent;
/**
 * @param {number} timestamp
 * @param {string} eventName
 * @param {*} payload
 * @constructor
 */
declare function MotionEvent(timestamp: number, eventName: string, payload: any): void;
declare class MotionEvent {
    constructor(timestamp: number, eventName: string, payload: any);
    /**
     * @return {number}
     */
    getTimestamp: () => number;
    /**
     * @return {string}
     */
    getEventName: () => string;
    /**
     * @return {*}
     */
    getPayload: () => any;
}
