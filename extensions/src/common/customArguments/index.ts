import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { Extension } from "../Extension";
import { closeDropdownState, customArgumentFlag, dropdownEntryFlag, dropdownStateFlag, initDropdownState, openDropdownState } from "../globals";
import { ArgumentEntry } from "./CustomArgumentManager";
import { CustomArgumentUIConstructor, renderToDropdown } from "./dropdownOverride";

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
} as const;

/**
 * Checks if the value returned by a dyanmic menu indicates that it should be treated as a 'custom argument'
 * @param arr 
 * @returns 
 */
export const isCustomArgumentHack = (arr: Array<string | { text: string }>) => {
  if (arr.length !== 1) return false;
  const item = arr[0];
  if (typeof item !== "object") return false;
  const { text } = item;
  return text === customArgumentFlag;
}

/**
 * 
 * @param this The 'this' calling context of this function is assumed to be an Extension
 * @param runtime 
 * @param entry 
 * @param getComponent 
 * @returns 
 */
export function processCustomArgumentHack<T extends Extension<any, any>>(
  this: T,
  runtime: Runtime,
  [{ value }]: Array<{ value: string }>,
  getComponent: ComponentGetter
): (readonly [string, string])[] {
  const { id: extensionID, customArgumentManager } = this;
  const { component, id: initialID } = JSON.parse(value) as { component: string, id: string };
  const context = runtime[dropdownStateFlag];

  switch (context) {
    case callingContext.Init:
      return customArgumentManager.getCurrentEntries();
    case callingContext.DropdownClose: {
      const result = customArgumentManager.tryResolve();
      return result ? [[result.entry.text, result.id]] : customArgumentManager.getCurrentEntries();
    }
    case callingContext.DrowpdownOpen: {
      const currentEntry = runtime[dropdownEntryFlag] as ArgumentEntry<any>;
      const prevID = currentEntry?.value ?? initialID;
      const current = customArgumentManager.getEntry(prevID);
      const [id, setEntry] = customArgumentManager.request();
      renderToDropdown(getComponent(extensionID, component), setEntry, current);
      return [["Apply", id]];
    }
  }

  throw new Error("Error during processing -- Context:" + callingContext);
}