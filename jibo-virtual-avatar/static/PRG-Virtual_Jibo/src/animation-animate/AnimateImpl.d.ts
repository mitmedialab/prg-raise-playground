export default animate;
export namespace jibo {
    /**
     * ~AnimationBuilderCreatedCallback
     */
    export type animate = (animationBuilder: jibo.animate.AnimationBuilder) => any;
    export namespace animate {
        /**
         * ~AnimationEventCallback
         */
        type AnimationBuilder = (eventName: jibo.animate.AnimationEventType, animationInstance: jibo.animate.AnimationInstance, payload: any) => any;
    }
    class AnimationBuilder {
        protected constructor();
        /**
         * Removes all event listeners and resets this builder to default settings.
         * @method jibo.animate.AnimationBuilder#reset
         */
        reset(): void;
        layer: string;
        layerDOFs: any;
        dofNames: any[] | string[];
        eventHandlers: {};
        clip: any;
        numLoops: number;
        transition: any;
        stopOrient: boolean;
        /**
         * Gets a copy of this AnimationBuilder with all event listeners removed and reset to default settings.
         * Configuration changes made to the copy will not affect the original.
         * @method jibo.animate.AnimationBuilder#getCleanCopy
         * @return {jibo.animate.AnimationBuilder} A newly-created AnimationBuilder instance with default settings.
         */
        getCleanCopy(): animate.AnimationBuilder;
        _createStartedHandler(animationInstance: any): () => void;
        _createStoppedHandler(animationInstance: any): (interrupted: any) => void;
        _createRemovedHandler(animationInstance: any): (started: any, stopped: any) => void;
        _createEventHandler(animationInstance: any): (motionEvent: any) => void;
        /**
         * Triggers an instance of the animation to start playing, using the configuration represented
         * in this AnimationBuilder.
         * @method jibo.animate.AnimationBuilder#play
         * @return {jibo.animate.AnimationInstance}
         */
        play(): jibo.animate.AnimationInstance;
        /**
         * Function signature for animation builder event listeners, for use with AnimationBuilder's [on]{@link jibo.animate.AnimationBuilder#on} method.
         * @callback jibo.animate.AnimationBuilder~AnimationEventCallback
         * @param {jibo.animate.AnimationEventType} eventName - The event type.
         * @param {jibo.animate.AnimationInstance} animationInstance - Instance that generated this event.
         * @param {Object} payload - Event-specific payload.
         */
        /**
         * Registers an event listener.
         * @method jibo.animate.AnimationBuilder#on
         * @param {jibo.animate.AnimationEventType} eventName - The event type to listen for.
         * @param {jibo.animate.AnimationBuilder~AnimationEventCallback} callback - The listener function.
         */
        on(eventName: jibo.animate.AnimationEventType, callback: any): void;
        /**
         * Un-registers an event listener.
         * @method jibo.animate.AnimationBuilder#off
         * @param {jibo.animate.AnimationEventType} eventName - The event type.
         * @param {jibo.animate.AnimationBuilder~AnimationEventCallback} callback - The listener function.
         */
        off(eventName: jibo.animate.AnimationEventType, callback: any): void;
        /**
         * Sets the speed of the animation.
         * @method jibo.animate.AnimationBuilder#setSpeed
         * @param {number} speed - Animation speed. 1 for normal speed, 2 for twice as fast, 0.5 for half speed, etc.
         */
        setSpeed(speed: number): void;
        /**
         * Sets the number of times to loop the animation before stopping.
         * Specify 0 to loop forever.
         * @method jibo.animate.AnimationBuilder#setNumLoops
         * @param {number} numLoops - Number of times to loop the animation; 0 to loop forever.
         */
        setNumLoops(numLoops: number): void;
        /**
         * Sets the DOFs to be used by this builder. The DOFs used are the intersection of
         * the DOFs passed as the argument here, the DOFs present in the underlying motion, and
         * the DOFs used by the layer to which this builder is bound.
         *
         * Commonly-used DOF groups are defined in [animate.dofs]{@link jibo.animate.dofs}.
         * @method jibo.animate.AnimationBuilder#setDOFs
         * @param {jibo.animate.DOFSet|string[]} dofNames - Names of DOFs to use; null to use all DOFs.
         */
        setDOFs(dofNames: any): void;
        /**
         * Gets the DOFs that will be used by this builder.
         * @method jibo.animate.AnimationBuilder#getDOFs
         * @return {string[]}
         */
        getDOFs(): string[];
        private setPlayBounds;
        /**
         * Gets the duration, in seconds, of the source animation for this builder (unaffected by settings such as speed, etc).
         * @method jibo.animate.AnimationBuilder#getSourceAnimationDuration
         * @return {number}
         */
        getSourceAnimationDuration(): number;
        /**
         * Gets the duration, in seconds, of the animation that will be produced by this builder given current settings (speed, etc).
         * @method jibo.animate.AnimationBuilder#getConfiguredAnimationDuration
         * @return {number}
         */
        getConfiguredAnimationDuration(): number;
        /**
         * Sets the transition builder that will be used to generate a smooth
         * transition into the start of the animation.
         * @method jibo.animate.AnimationBuilder#setTransitionIn
         * @param {jibo.animate.TransitionBuilder} transition - Transition builder to use for the animation's 'in' transition.
         */
        setTransitionIn(transition: jibo.animate.TransitionBuilder): void;
        /**
         * Gets the transition builder currently specified for the animation's 'in' transition.
         * @method jibo.animate.AnimationBuilder#getTransitionIn
         * @return {jibo.animate.TransitionBuilder}
         */
        getTransitionIn(): jibo.animate.TransitionBuilder;
        /**
         * Sets the animation's base-blending policy.
         *
         * This policy has an effect only if the animation is configured to control the robot's base DOF.
         * @method jibo.animate.AnimationBuilder#setStopOrient
         * @param {boolean} stopOrient If true, the animation will seize exclusive control of
         * the robot's base DOF, stopping any in-progress orient behavior on that DOF. If false, the animation
         * will blend additively with any ongoing orient/lookt behavior on the base DOF.
         */
        setStopOrient(stopOrient: boolean): void;
        /**
         * Sets the blending layer for the animation [warning: advanced usage only!]
         * @method jibo.animate.AnimationBuilder#setLayer
         * @param {string} layerName The name of the blending layer.
         */
        setLayer(layerName: string): void;
    }
}
declare namespace animate {
    export namespace trajectory {
        function getAnimation(uri: string, callback: AnimationLoadedCallback, forceReload?: boolean): void;
        function parseAnimation(animationData: any, parentDirectoryURI?: string, cacheKey?: string): AnnotatedMotion;
        function createLinearTransitionBuilder(robotInfo: any): LinearTransitionBuilder;
        function createAccelerationTransitionBuilder(robotInfo: any, defaultMaxVelocity: any, defaultMaxAcceleration: any): AccelerationTransitionBuilder;
    }
    export { AnimationEventType };
    export { LookatEventType };
}
import AnnotatedMotion from "../ifr-motion/base/AnnotatedMotion.js";
import LinearTransitionBuilder from "./LinearTransitionBuilderImpl.js";
import AccelerationTransitionBuilder from "./AccelerationTransitionBuilder.js";
/**
 * *
 */
type AnimationEventType = string;
declare namespace AnimationEventType {
    let STARTED: string;
    let STOPPED: string;
    let CANCELLED: string;
    let EVENT: string;
}
/**
 * *
 */
type LookatEventType = string;
declare namespace LookatEventType {
    let STARTED_1: string;
    export { STARTED_1 as STARTED };
    export let TARGET_REACHED: string;
    export let TARGET_SUPERSEDED: string;
    let STOPPED_1: string;
    export { STOPPED_1 as STOPPED };
    let CANCELLED_1: string;
    export { CANCELLED_1 as CANCELLED };
}
