import StackTrace from "stacktrace-js";

const blocklyPrefix = "./node_modules/imports-loader/index.js?this=>window!./node_modules/exports-loader/index.js?Blockly&goog!./node_modules/scratch-blocks/blockly_compressed_vertical.js";

const printCallStack = () => {
  if (Error.stackTraceLimit) Error.stackTraceLimit = Infinity;
  const traces = StackTrace.getSync()
    .map(({ functionName }) => functionName)
    .map(name => name?.replace(blocklyPrefix, ""));
  console.log(traces);
}