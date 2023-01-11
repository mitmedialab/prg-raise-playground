export const identifier = "eee";

const callingContext = {  

};

const getCallStack = () => {
  const newLineIdentifier = "\n    at ";
  const blocklyFileIndentifier = "blockly_compressed_vertical.js.";
  return new Error().stack
    .split(newLineIdentifier)
    .map(line => line.split(blocklyFileIndentifier)[1] ?? line);
}

export const getCallingContext = () => {
  const items = getCallStack();
  const last = items[items.length - 1];
  return last;
}