import type Timer = require("../util/timer");

/**
 * Recycle bin for empty stackFrame objects
 * @type Array<_StackFrame>
 */
const stackFrameFreeList: StackFrame[] = [];

/**
  * A frame used for each level of the stack. A general purpose
  * place to store a bunch of execution context and parameters
  * @param {boolean} warpMode Whether this level of the stack is warping
  * @constructor
  * @private
  */
class StackFrame {
  /**
   * Whether this level of the stack is a loop.
   */
  isLoop: boolean = false;

  /**
   * Whether this level is in warp mode.  Is set by some legacy blocks and
   * "turbo mode"
   */
  warpMode: boolean;

  /**
   * Reported value from just executed block.
   */
  justReported: any = null;

  /**
   * The active block that is waiting on a promise.
   */
  reporting: string = '';

  /**
   * Persists reported inputs during async block.
   */
  reported: Object = null;

  /**
   * Name of waiting reporter.
   */
  waitingReporter: string = null;

  /**
   * Procedure parameters.
   */
  params: Object = null;

  /**
   * A context passed to block implementations.
   */
  executionContext = null;

  timer: Timer = null;
  duration: number = -1;

  constructor(warpMode: boolean) {
    this.warpMode = warpMode;
  }

  /**
   * Reset all properties of the frame to pristine null and false states.
   * Used to recycle.
   * @return {StackFrame} this
   */
  reset(): StackFrame {

    this.isLoop = false;
    this.warpMode = false;
    this.justReported = null;
    this.reported = null;
    this.waitingReporter = null;
    this.params = null;
    this.executionContext = null;

    return this;
  }

  /**
   * Reuse an active stack frame in the stack.
   * @param {?boolean} warpMode defaults to current warpMode
   * @returns {StackFrame} this
   */
  reuse(warpMode = this.warpMode): StackFrame {
    this.reset();
    this.warpMode = Boolean(warpMode);
    return this;
  }

  /**
   * Create or recycle a stack frame object.
   * @param {boolean} warpMode Enable warpMode on this frame.
   * @returns {StackFrame} The clean stack frame with correct warpMode setting.
   */
  static create(warpMode: boolean): StackFrame {
    const stackFrame = stackFrameFreeList.pop();
    if (typeof stackFrame !== 'undefined') {
      stackFrame.warpMode = Boolean(warpMode);
      return stackFrame;
    }
    return new StackFrame(warpMode);
  }

  /**
   * Put a stack frame object into the recycle bin for reuse.
   * @param {StackFrame} stackFrame The frame to reset and recycle.
   */
  static release(stackFrame: StackFrame) {
    if (typeof stackFrame !== 'undefined') {
      stackFrameFreeList.push(stackFrame.reset());
    }
  }
}

export = StackFrame;