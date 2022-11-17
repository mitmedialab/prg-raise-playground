/**
 * A frame used for each level of the stack. A general purpose
 * place to store a bunch of execution context and parameters
 * @param {boolean} warpMode Whether this level of the stack is warping
 * @constructor
 * @private
 */
 class StackFrame {
  constructor (warpMode) {
      /**
       * Whether this level of the stack is a loop.
       * @type {boolean}
       */
      this.isLoop = false;

      /**
       * Whether this level is in warp mode.  Is set by some legacy blocks and
       * "turbo mode"
       * @type {boolean}
       */
      this.warpMode = warpMode;

      /**
       * Reported value from just executed block.
       * @type {any}
       */
      this.justReported = null;

      /**
       * The active block that is waiting on a promise.
       * @type {string}
       */
      this.reporting = '';

      /**
       * Persists reported inputs during async block.
       * @type {Object}
       */
      this.reported = null;

      /**
       * Name of waiting reporter.
       * @type {string}
       */
      this.waitingReporter = null;

      /**
       * Procedure parameters.
       * @type {Object}
       */
      this.params = null;

      /**
       * A context passed to block implementations.
       * @type {Object}
       */
      this.executionContext = null;
  }

  /**
   * Reset all properties of the frame to pristine null and false states.
   * Used to recycle.
   * @return {StackFrame} this
   */
  reset () {

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
  reuse (warpMode = this.warpMode) {
      this.reset();
      this.warpMode = Boolean(warpMode);
      return this;
  }

  /**
   * Create or recycle a stack frame object.
   * @param {boolean} warpMode Enable warpMode on this frame.
   * @returns {StackFrame} The clean stack frame with correct warpMode setting.
   */
  static create (warpMode) {
      const stackFrame = _stackFrameFreeList.pop();
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
  static release (stackFrame) {
      if (typeof stackFrame !== 'undefined') {
          _stackFrameFreeList.push(stackFrame.reset());
      }
  }
}

/**
 * Recycle bin for empty stackFrame objects
 * @type {Array<StackFrame>}
 */
 const _stackFrameFreeList = [];

module.exports = StackFrame;