export default Clock;
declare namespace Clock {
    /**
     * Gets the current time.
     *
     * Internally, time is calculated as time since epoch and is
     * represented as two integers— seconds and fractions of a second in microseconds.
     * @method jibo.animate.Clock#currentTime
     * @returns {jibo.animate.Time}
     */
    function currentTime(): jibo.animate.Time;
}
