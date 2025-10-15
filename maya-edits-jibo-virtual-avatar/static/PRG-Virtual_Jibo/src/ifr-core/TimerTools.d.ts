export default TimerTools;
export type Timer = {
    /**
     * - stops the timer
     */
    stop: Function;
};
declare namespace TimerTools {
    /**
     * Creates a timer to repeatedly call the specified callback with the given time interval.
     * Call stop() on the returned object to cancel/stop the timer.
     * @param {function} callback - the callback
     * @param {number} intervalTimeMillis - interval in milliseconds at which to call the callback
     * @return {Timer}
     */
    export function setInterval(callback: Function, intervalTimeMillis: number): Timer;
    /**
     * Stops the specified timer object.
     * @param {Timer} timer - the timer to stop
     */
    export function clearInterval(timer: Timer): void;
    export { WebWorkerTimerFactory };
}
/**
 * @constructor
 */
declare function WebWorkerTimerFactory(): void;
declare class WebWorkerTimerFactory {
    /**
     * @param {function} callback - the callback
     * @param {number} intervalTimeMillis - interval in milliseconds at which to call the callback
     * @return {Timer}
     */
    createTimer: (callback: Function, intervalTimeMillis: number) => Timer;
}
