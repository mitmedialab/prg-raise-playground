const blocklyPrefix = "./node_modules/imports-loader/index.js?this=>window!./node_modules/exports-loader/index.js?Blockly&goog!./node_modules/scratch-blocks/blockly_compressed_vertical.js";

export const printCallStack = () => {
  if (Error.stackTraceLimit) Error.stackTraceLimit = Infinity;
  try {
    throw new Error();
  }
  catch (e) {
    const lines = e.stack.split("\n");
    lines[0] = "Call stack:";
    console.log(lines.map(line => line.replace(blocklyPrefix, "")).join("\n"));
  }
}