export default TimelineBuilder;
declare namespace TimelineBuilder {
    function createTimeline(robotInfo: RobotInfo, cb: any, updateIntervalMillis?: number, useTimer?: any): MotionTimeline;
    function connectRenderer(timeline: MotionTimeline, renderer: RobotRenderer): void;
    function disconnectRenderer(timeline: MotionTimeline, renderer: RobotRenderer): void;
    function disposeTimeline(timeline: MotionTimeline, disposeOutputs: boolean): void;
}
import MotionTimeline from "../animation-animate/timeline/MotionTimeline.js";
