export const identifier = "eee";

export const customArgumentFlag = "internal_IsCustomArgument";
export const customArgumentHTMLTextIdentifier = "...loading...";

const callingContext = {  
  DrowpdownOpen: "open",
  DropdownClose: "close",
  Init: "init",
};

const state = {
  selectedBlockID: null,
  current: -1,
  update() {
    this.current = new Date().getTime().toString();
    return this.current;
  }
}

const getCallStack = () => {
  Error.stackTraceLimit = Infinity;
  const newLineIdentifier = "\n";
  const blocklyFileIndentifier = "blockly_compressed_vertical.js.";
  return new Error().stack
    .split(newLineIdentifier)
    .map(line => line.split(blocklyFileIndentifier)[1] ?? line);
}

export const getCallingContext = () => {
  const items = getCallStack();
  const last = items[items.length - 1];
  if (last.startsWith("HTMLDocument")) return callingContext.DrowpdownOpen;
  if (last.startsWith("goog")) return callingContext.DropdownClose;
  if (last.startsWith("Blockly")) return callingContext.Init;
  throw new Error("Unhandled calling context: " + last)
}

export const isCustomArgumentHack = (arr) => {
  if (arr.length !== 1) return false;
  const item = arr[0];
  if (typeof item !== "object") return false;
  const { text } = item;
  return text === customArgumentFlag;
}

const handleOpen = () => {

}

export const processCustomArgumentHack = ([obj]) => {
  const {value} = obj;
  const context = getCallingContext();
  switch (context) {
    case callingContext.Init:
      // This needs to keep track of all the currently being used 'states' / 'ids' / 'timestamps'.
      // This is so when a block is duplicated or draggged, it will work correctly.
      return [["Click me", "Click me"], ["Value of", state.current]]; 
    case callingContext.DropdownClose:
      return [["Value of", state.current]];
    case callingContext.DrowpdownOpen:
      return [["Apply", state.update()]];
  }

  if (context === callingContext.Init) return [["Click me", "Click me"], ["Value of", state.current]];
  if (context === callingContext.DropdownClose) return [["Value of", state.current]];
  if (context === callingContext.DrowpdownOpen) return [["Apply", state.update()]];
  throw new Error("Error during processing");
}

export const processBlocklyEvent = (e) => {
  const {element, newValue} = e;
  if (element === "selected") state.selectedBlockID = newValue;
}

const x = async () => {
  await Promise.resolve();
  // id = state.selectedBlockID
  // element = "field"
  // name = "" get from item
  // value = ""
  const y = {

  }
  
}

/**
 * this.changeBlock({
                id: e.blockId,
                element: e.element,
                name: e.name,
                value: e.newValue
            });
 */