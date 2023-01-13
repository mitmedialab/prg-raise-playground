import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { Extension } from "./Extension";
import { closeDropdownState, customArgumentFlag, dropdownStateFlag, initDropdownState, openDropdownState } from "./globals";
import { waitForCondition, waitForObject } from "./utils";

/** Constructed based on Svelte documentation: https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component */
type Payload = {
  target: Element | HTMLElement;
  anchor?: Element | HTMLElement;
  props: {};
}


type CustomArgumentUIConstructor = (details: Payload) => void;

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
} as const;

const getIdentifier = () => new Date().getTime().toString();

const state = {
  selectedBlockID: null,
  current: -1,
  update() {
    this.current = getIdentifier();
    return this.current;
  }
}

export const isCustomArgumentHack = (arr: Array<string | { text: string }>) => {
  if (arr.length !== 1) return false;
  const item = arr[0];
  if (typeof item !== "object") return false;
  const { text } = item;
  return text === customArgumentFlag;
}

const renderToDropdown = async (compononentConstructor: CustomArgumentUIConstructor) => {
  const dropdownContainerClass = "blocklyDropDownContent";
  const elements = document.getElementsByClassName(dropdownContainerClass);
  if (elements.length !== 1) return console.error(`Uh oh! Expected 1 element with class '${dropdownContainerClass}', but found ${elements.length}`);
  const [target] = elements;
  const anchor = await waitForObject(() => target.children[0]);
  new compononentConstructor({ target, anchor, props: {} });
}

export function processCustomArgumentHack<T extends Extension<any, any>>(
  this: T,
  runtime: Runtime,
  [obj]: Array<{ value: string }>,
  getComponent: ComponentGetter
) {
  const context = runtime[dropdownStateFlag];

  switch (context) {
    case callingContext.Init:
      // This needs to keep track of all the currently being used 'states' / 'ids' / 'timestamps'.
      // This is so when a block is duplicated or draggged, it will work correctly.
      return [["Click me", "Click me"], ["Value of", state.current]];
    case callingContext.DropdownClose:
      return [[state.current, state.current]];
    case callingContext.DrowpdownOpen:
      renderToDropdown(getComponent(this.id, obj.value))
      return [["Apply", state.update()]];
  }

  throw new Error("Error during processing -- Context:" + callingContext);
}