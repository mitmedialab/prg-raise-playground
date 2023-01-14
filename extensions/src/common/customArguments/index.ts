import { printCallStack } from "$common/callStack";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { Extension } from "../Extension";
import { closeDropdownState, customArgumentFlag, dropdownEntryFlag, dropdownStateFlag, initDropdownState, openDropdownState } from "../globals";
import { waitForCondition, waitForObject } from "../utils";
import CustomArgumentManager, { ArgumentEntry, ArgumentEntrySetter } from "./CustomArgumentManager";
import { CustomArgumentUIConstructor, renderToDropdown } from "./dropdownOverride";

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
} as const;

const manager = new CustomArgumentManager();

export const isCustomArgumentHack = (arr: Array<string | { text: string }>) => {
  if (arr.length !== 1) return false;
  const item = arr[0];
  if (typeof item !== "object") return false;
  const { text } = item;
  return text === customArgumentFlag;
}

const defaultText = "Click me";

export function processCustomArgumentHack<T extends Extension<any, any>>(
  this: T,
  runtime: Runtime,
  [{ value }]: Array<{ value: string }>,
  getComponent: ComponentGetter
): (readonly [string, string])[] {
  const { component, defaultEntry } = JSON.parse(value) as { component: string, defaultEntry: ArgumentEntry };
  const context = runtime[dropdownStateFlag];
  switch (context) {
    case callingContext.Init:
      return [[defaultText, defaultText], ...manager.getCurrentEntries()];
    case callingContext.DropdownClose: {
      const result = manager.tryResolve();
      if (!result) return manager.getCurrentEntries();
      const { id, entry: { text } } = result;
      return [[text, id]];
    }
    case callingContext.DrowpdownOpen: {
      const currentEntry = runtime[dropdownEntryFlag] as ArgumentEntry;

      const current = !currentEntry || (currentEntry.text === defaultText && currentEntry.value === defaultText)
        ? defaultEntry
        : manager.getEntry(currentEntry.value);

      const [id, setEntry] = manager.request();
      renderToDropdown(getComponent(this.id, component), setEntry, current);
      return [["Apply", id]];
    }
  }

  throw new Error("Error during processing -- Context:" + callingContext);
}