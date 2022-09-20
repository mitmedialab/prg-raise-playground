export = Thread;
/**
 * A thread is a running stack context and all the metadata needed.
 * @param {?string} firstBlock First block to execute in the thread.
 * @constructor
 */
declare class Thread {
    /**
     * Thread status for initialized or running thread.
     * This is the default state for a thread - execution should run normally,
     * stepping from block to block.
     * @const
     */
    static get STATUS_RUNNING(): number;
    /**
     * Threads are in this state when a primitive is waiting on a promise;
     * execution is paused until the promise changes thread status.
     * @const
     */
    static get STATUS_PROMISE_WAIT(): number;
    /**
     * Thread status for yield.
     * @const
     */
    static get STATUS_YIELD(): number;
    /**
     * Thread status for a single-tick yield. This will be cleared when the
     * thread is resumed.
     * @const
     */
    static get STATUS_YIELD_TICK(): number;
    /**
     * Thread status for a finished/done thread.
     * Thread is in this state when there are no more blocks to execute.
     * @const
     */
    static get STATUS_DONE(): number;
    constructor(firstBlock: any);
    /**
     * ID of top block of the thread
     * @type {!string}
     */
    topBlock: string;
    /**
     * Stack for the thread. When the sequencer enters a control structure,
     * the block is pushed onto the stack so we know where to exit.
     * @type {Array.<string>}
     */
    stack: Array<string>;
    /**
     * Stack frames for the thread. Store metadata for the executing blocks.
     * @type {Array.<_StackFrame>}
     */
    stackFrames: Array<_StackFrame>;
    /**
     * Status of the thread, one of three states (below)
     * @type {number}
     */
    status: number;
    /**
     * Whether the thread is killed in the middle of execution.
     * @type {boolean}
     */
    isKilled: boolean;
    /**
     * Target of this thread.
     * @type {?import("./target")}
     */
    target: import("./target") | null;
    /**
     * The Blocks this thread will execute.
     * @type {import("./blocks")}
     */
    blockContainer: import("./blocks");
    /**
     * Whether the thread requests its script to glow during this frame.
     * @type {boolean}
     */
    requestScriptGlowInFrame: boolean;
    /**
     * Which block ID should glow during this frame, if any.
     * @type {?string}
     */
    blockGlowInFrame: string | null;
    /**
     * A timer for when the thread enters warp mode.
     * Substitutes the sequencer's count toward WORK_TIME on a per-thread basis.
     * @type {?import("../util/timer")}
     */
    warpTimer: import("../util/timer") | null;
    justReported: any;
    /**
     * Push stack and update stack frames appropriately.
     * @param {string} blockId Block ID to push to stack.
     */
    pushStack(blockId: string): void;
    /**
     * Reset the stack frame for use by the next block.
     * (avoids popping and re-pushing a new stack frame - keeps the warpmode the same
     * @param {string} blockId Block ID to push to stack.
     */
    reuseStackForNextBlock(blockId: string): void;
    /**
     * Pop last block on the stack and its stack frame.
     * @return {string} Block ID popped from the stack.
     */
    popStack(): string;
    /**
     * Pop back down the stack frame until we hit a procedure call or the stack frame is emptied
     */
    stopThisScript(): void;
    /**
     * Get top stack item.
     * @return {?string} Block ID on top of stack.
     */
    peekStack(): string | null;
    /**
     * Get top stack frame.
     * @return {?object} Last stack frame stored on this thread.
     */
    peekStackFrame(): object | null;
    /**
     * Get stack frame above the current top.
     * @return {?object} Second to last stack frame stored on this thread.
     */
    peekParentStackFrame(): object | null;
    /**
     * Push a reported value to the parent of the current stack frame.
     * @param {*} value Reported value to push.
     */
    pushReportedValue(value: any): void;
    /**
     * Initialize procedure parameters on this stack frame.
     */
    initParams(): void;
    /**
     * Add a parameter to the stack frame.
     * Use when calling a procedure with parameter values.
     * @param {!string} paramName Name of parameter.
     * @param {*} value Value to set for parameter.
     */
    pushParam(paramName: string, value: any): void;
    /**
     * Get a parameter at the lowest possible level of the stack.
     * @param {!string} paramName Name of parameter.
     * @return {*} value Value for parameter.
     */
    getParam(paramName: string): any;
    /**
     * Whether the current execution of a thread is at the top of the stack.
     * @return {boolean} True if execution is at top of the stack.
     */
    atStackTop(): boolean;
    /**
     * Switch the thread to the next block at the current level of the stack.
     * For example, this is used in a standard sequence of blocks,
     * where execution proceeds from one block to the next.
     */
    goToNextBlock(): void;
    /**
     * Attempt to determine whether a procedure call is recursive,
     * by examining the stack.
     * @param {!string} procedureCode Procedure code of procedure being called.
     * @return {boolean} True if the call appears recursive.
     */
    isRecursiveCall(procedureCode: string): boolean;
}
/**
 * A frame used for each level of the stack. A general purpose
 * place to store a bunch of execution context and parameters
 * @param {boolean} warpMode Whether this level of the stack is warping
 * @constructor
 * @private
 */
declare class _StackFrame {
    /**
     * Create or recycle a stack frame object.
     * @param {boolean} warpMode Enable warpMode on this frame.
     * @returns {_StackFrame} The clean stack frame with correct warpMode setting.
     */
    static create(warpMode: boolean): _StackFrame;
    /**
     * Put a stack frame object into the recycle bin for reuse.
     * @param {_StackFrame} stackFrame The frame to reset and recycle.
     */
    static release(stackFrame: _StackFrame): void;
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
     * @return {_StackFrame} this
     */
    reset(): _StackFrame;
    /**
     * Reuse an active stack frame in the stack.
     * @param {?boolean} warpMode defaults to current warpMode
     * @returns {_StackFrame} this
     */
    reuse(warpMode?: boolean | null): _StackFrame;
}
