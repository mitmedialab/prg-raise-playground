export default TimelineEventDispatcher;
declare namespace TimelineEventDispatcher {
    function queueEvent(theFunction: any, theArgs: any): void;
    function dispatchQueuedEvents(): void;
}
