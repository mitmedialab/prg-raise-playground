export = StackFrame;
/**
 * A frame used for each level of the stack. A general purpose
 * place to store a bunch of execution context and parameters
 * @param {boolean} warpMode Whether this level of the stack is warping
 * @constructor
 * @private
 */
declare class StackFrame {
    /**
     * Create or recycle a stack frame object.
     * @param {boolean} warpMode Enable warpMode on this frame.
     * @returns {StackFrame} The clean stack frame with correct warpMode setting.
     */
    static create(warpMode: boolean): StackFrame;
    /**
     * Put a stack frame object into the recycle bin for reuse.
     * @param {StackFrame} stackFrame The frame to reset and recycle.
     */
    static release(stackFrame: StackFrame): void;
    constructor(warpMode: any);
    /**
     * Whether this level of the stack is a loop.
     * @type {boolean}
     */
    isLoop: boolean;
    /**
     * Whether this level is in warp mode.  Is set by some legacy blocks and
     * "turbo mode"
     * @type {boolean}
     */
    warpMode: boolean;
    /**
     * Reported value from just executed block.
     * @type {any}
     */
    justReported: any;
    /**
     * The active block that is waiting on a promise.
     * @type {string}
     */
    reporting: string;
    /**
     * Persists reported inputs during async block.
     * @type {Object}
     */
    reported: any;
    /**
     * Name of waiting reporter.
     * @type {string}
     */
    waitingReporter: string;
    /**
     * Procedure parameters.
     * @type {Object}
     */
    params: any;
    /**
     * A context passed to block implementations.
     * @type {Object}
     */
    executionContext: any;
    /**
     * Reset all properties of the frame to pristine null and false states.
     * Used to recycle.
     * @return {StackFrame} this
     */
    reset(): StackFrame;
    /**
     * Reuse an active stack frame in the stack.
     * @param {?boolean} warpMode defaults to current warpMode
     * @returns {StackFrame} this
     */
    reuse(warpMode?: boolean | null): StackFrame;
}
