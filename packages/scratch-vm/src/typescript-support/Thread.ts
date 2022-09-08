import type Timer = require("../util/timer");
import StackFrame = require("./StackFrame");

// TODO: #161 Convert engine classes to Typescript 
import Target = require("../engine/target");

type BlockID = string;

const enum Status {
  /**
   * Thread status for initialized or running thread.
   * This is the default state for a thread - execution should run normally,
   * stepping from block to block.
   */
  Running,
  /**
   * Threads are in this state when a primitive is waiting on a promise;
   * execution is paused until the promise changes thread status.
   */
  Promise_Wait,
  /**
   * Thread status for yield.
   */
  Yield,
  /**
   * Thread status for a single-tick yield. This will be cleared when the
   * thread is resumed.
   */
  Yield_Tick,
  /**
   * Thread status for a finished/done thread.
   * Thread is in this state when there are no more blocks to execute.
   */
  Done
}

/**
 * A thread is a running stack context and all the metadata needed.
 */
class Thread {
  /**
   * ID of top block of the thread
   */
  topBlock: BlockID;

  /**
   * Stack for the thread. When the sequencer enters a control structure,
   * the block is pushed onto the stack so we know where to exit.
   */
  stack: BlockID[] = [];

  /**
   * Stack frames for the thread. Store metadata for the executing blocks.
   */
  stackFrames: StackFrame[] = [];

  /**
   * Status of the thread, one of three states (below)
   */
  status: Status = Status.Running;

  /**
   * Whether the thread is killed in the middle of execution.
   */
  isKilled: boolean = false;

  /**
   * Target of this thread.
   */
  target: Target = null;

  /**
   * The Blocks this thread will execute.
   */
  blockContainer: Object /*TODO*/ = null;

  /**
   * Whether the thread requests its script to glow during this frame.
   */
  requestScriptGlowInFrame: boolean = false;

  /**
   * Which block ID should glow during this frame, if any.
   */
  blockGlowInFrame: string = null;

  /**
   * A timer for when the thread enters warp mode.
   * Substitutes the sequencer's count toward WORK_TIME on a per-thread basis.
   */
  warpTimer: Timer = null

  justReported: any = null;

  /**
   * 
   * @param firstBlock First block to execute in the thread.
   */
  constructor(firstBlock: BlockID) {
    this.topBlock = firstBlock;
  }

  static get STATUS_RUNNING() { return Status.Running }
  static get STATUS_PROMISE_WAIT() { return Status.Promise_Wait }
  static get STATUS_YIELD() { return Status.Yield }
  static get STATUS_YIELD_TICK() { return Status.Yield_Tick }
  static get STATUS_DONE() { return Status.Done }

  /**
   * Push stack and update stack frames appropriately.
   * @param {string} blockId Block ID to push to stack.
   */
  pushStack(blockId: BlockID) {
    this.stack.push(blockId);
    // Push an empty stack frame, if we need one.
    // Might not, if we just popped the stack.
    if (this.stack.length > this.stackFrames.length) {
      const parent = this.stackFrames[this.stackFrames.length - 1];
      this.stackFrames.push(StackFrame.create(typeof parent !== 'undefined' && parent.warpMode));
    }
  }

  /**
   * Reset the stack frame for use by the next block.
   * (avoids popping and re-pushing a new stack frame - keeps the warpmode the same
   * @param {string} blockId Block ID to push to stack.
   */
  reuseStackForNextBlock(blockId: BlockID) {
    this.stack[this.stack.length - 1] = blockId;
    this.stackFrames[this.stackFrames.length - 1].reuse();
  }

  /**
   * Pop last block on the stack and its stack frame.
   * @return {string} Block ID popped from the stack.
   */
  popStack(): BlockID {
    StackFrame.release(this.stackFrames.pop());
    return this.stack.pop();
  }

  /**
   * Pop back down the stack frame until we hit a procedure call or the stack frame is emptied
   */
  stopThisScript() {
    let blockID = this.peekStack();
    while (blockID !== null) {
      const block = this.target.blocks.getBlock(blockID);
      if (typeof block !== 'undefined' && block.opcode === 'procedures_call') {
        break;
      }
      this.popStack();
      blockID = this.peekStack();
    }

    if (this.stack.length === 0) {
      // Clean up!
      this.requestScriptGlowInFrame = false;
      this.status = Thread.STATUS_DONE;
    }
  }

  /**
   * Get top stack item.
   * @return {?string} Block ID on top of stack.
   */
  peekStack(): BlockID {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }


  /**
   * Get top stack frame.
   * @return {?object} Last stack frame stored on this thread.
   */
  peekStackFrame(): StackFrame | null {
    return this.stackFrames.length > 0 ? this.stackFrames[this.stackFrames.length - 1] : null;
  }

  /**
   * Get stack frame above the current top.
   * @return {?object} Second to last stack frame stored on this thread.
   */
  peekParentStackFrame(): StackFrame | null {
    return this.stackFrames.length > 1 ? this.stackFrames[this.stackFrames.length - 2] : null;
  }

  /**
   * Push a reported value to the parent of the current stack frame.
   * @param {*} value Reported value to push.
   */
  pushReportedValue(value: any) {
    this.justReported = typeof value === 'undefined' ? null : value;
  }

  /**
   * Initialize procedure parameters on this stack frame.
   */
  initParams() {
    const stackFrame = this.peekStackFrame();
    if (stackFrame.params === null) {
      stackFrame.params = {};
    }
  }

  /**
   * Add a parameter to the stack frame.
   * Use when calling a procedure with parameter values.
   * @param {!string} paramName Name of parameter.
   * @param {*} value Value to set for parameter.
   */
  pushParam(paramName: string, value: any) {
    const stackFrame = this.peekStackFrame();
    stackFrame.params[paramName] = value;
  }

  /**
   * Get a parameter at the lowest possible level of the stack.
   * @param {!string} paramName Name of parameter.
   * @return {*} value Value for parameter.
   */
  getParam(paramName: string) {
    for (let i = this.stackFrames.length - 1; i >= 0; i--) {
      const frame = this.stackFrames[i];
      if (frame.params === null) {
        continue;
      }
      if (frame.params.hasOwnProperty(paramName)) {
        return frame.params[paramName];
      }
      return null;
    }
    return null;
  }

  /**
   * Whether the current execution of a thread is at the top of the stack.
   * @return {boolean} True if execution is at top of the stack.
   */
  atStackTop(): boolean {
    return this.peekStack() === this.topBlock;
  }


  /**
   * Switch the thread to the next block at the current level of the stack.
   * For example, this is used in a standard sequence of blocks,
   * where execution proceeds from one block to the next.
   */
  goToNextBlock() {
    const nextBlockId = this.target.blocks.getNextBlock(this.peekStack());
    this.reuseStackForNextBlock(nextBlockId);
  }

  /**
   * Attempt to determine whether a procedure call is recursive,
   * by examining the stack.
   * @param {!string} procedureCode Procedure code of procedure being called.
   * @return {boolean} True if the call appears recursive.
   */
  isRecursiveCall(procedureCode: string): boolean {
    let callCount = 5; // Max number of enclosing procedure calls to examine.
    const sp = this.stack.length - 1;
    for (let i = sp - 1; i >= 0; i--) {
      const block = this.target.blocks.getBlock(this.stack[i]);
      if (block.opcode === 'procedures_call' &&
        block.mutation.proccode === procedureCode) {
        return true;
      }
      if (--callCount < 0) return false;
    }
    return false;
  }
}

export = Thread;