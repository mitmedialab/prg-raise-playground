import CustomArgumentManager, { ArgumentEntry, ArgumentEntrySetter } from "$common/extension/mixins/configurable/customArguments/CustomArgumentManager";
import { CustomArgumentUIConstructor, renderToDropdown } from "$common/extension/mixins/configurable/customArguments/dropdownOverride";
import { ArgumentType } from "$common/types/enums";
import { openDropdownState, closeDropdownState, initDropdownState, customArgumentFlag, dropdownStateFlag, dropdownEntryFlag, customArgumentMethod, updateDropdownState, updateDropdownMethod } from "$common/globals";
import { Argument, BaseGenericExtension, Environment, MenuItem } from "$common/types";
import { MinimalExtensionConstructor } from "../../base";
import { withDependencies } from "../../dependencies";
import customSaveData from "../customSaveData";

export type RuntimeWithCustomArgumentSupport = Environment["runtime"] &
  { [k in typeof dropdownStateFlag]: typeof openDropdownState | typeof closeDropdownState | typeof initDropdownState | typeof updateDropdownState } &
  { [k in typeof dropdownEntryFlag]: ArgumentEntry<any> } &
  { [k in typeof updateDropdownMethod]: (x: any) => void };

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
  Update: updateDropdownState
} as const;

type CustomArgumentContainer = Exclude<MenuItem<string>, string>;

const isCustomArgumentContainer = (arr: Array<MenuItem<string>>): arr is [CustomArgumentContainer] => {
  if (arr.length !== 1) return false;
  const item = arr[0];
  if (typeof item !== "object") return false;
  const { text } = item;
  return text === customArgumentFlag;
}

type CustomArgumentRecipe<T> = {
  /**
   * The svelte component to render the custom argument UI
   */
  component: string,
  /**
   * The starting value of the the custom argument (including both its value and text representation)
   */
  initial: ArgumentEntry<T>,
  /**
   * A function that must be defined if you'd like for your custom argument to accept reporters
   * @param x 
   * @returns 
   */
  acceptReportersHandler?: (x: any) => ArgumentEntry<T>
};

/**
 * Mixin the ability for extensions to create custom argument types with their own specific UIs
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function mixin<T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithCustomArgumentSupport extends withDependencies(Ctor, customSaveData) {
    /**
     * Create a custom argument for one of this block's arguments
     */
    protected makeCustomArgument = <T>({ component, initial, acceptReportersHandler: handler }: CustomArgumentRecipe<T>): Argument<T> => {
      this.argumentManager ??= new CustomArgumentManager();
      const id = this.argumentManager.add(initial);
      const getItems = () => [{ text: customArgumentFlag, value: JSON.stringify({ component, id }) }];
      return {
        type: ArgumentType.Custom,
        defaultValue: id,
        options: handler === undefined ? getItems : { acceptsReports: true, getItems, handler },
      } as Argument<T>
    }

    protected argumentManager: CustomArgumentManager = null;

    public get customArgumentManager(): CustomArgumentManager {
      return this.argumentManager
    }

    public getOrCreateCustomArgumentManager(): CustomArgumentManager {
      this.argumentManager ??= new CustomArgumentManager();
      return this.argumentManager;
    }

    /**
     * Utilized externally by scratch-vm to process custom arguments
     * @param runtime NOTE: once we switch to V2, we can remove this and instead use the extension's runtime
     * @param param1 
     * @param getComponent 
     * @returns 
     */
    private [customArgumentMethod](menuItems: MenuItem<string>[], getComponent: ComponentGetter): (readonly [string, string])[] {
      if (!isCustomArgumentContainer(menuItems)) return null;

      const runtime = this.runtime as RuntimeWithCustomArgumentSupport;
      const [{ value }] = menuItems;

      const { id: extensionID, customArgumentManager: argumentManager } = this;
      const { component, id: initialID } = JSON.parse(value) as { component: string, id: string };
      const dropdownContext = runtime[dropdownStateFlag];

      switch (dropdownContext) {
        case callingContext.Init:
          return argumentManager.getCurrentEntries();
        case callingContext.DrowpdownOpen: {
          const currentEntry = runtime[dropdownEntryFlag];
          const prevID = currentEntry?.value ?? initialID;
          const current = argumentManager.getEntry(prevID);
          const setEntry = argumentManager.request();
          const setter: ArgumentEntrySetter<T> = (entry) => {
            const id = setEntry(entry);
            console.log("set", id);
            runtime.manualDropdownUpdate(setEntry(entry));
          }
          renderToDropdown(runtime, getComponent(extensionID, component), { setter, current, extension: this });
          return [["Close", setEntry(current)]];
        }
        case callingContext.Update:
        case callingContext.DropdownClose: {
          const result = argumentManager.tryPeek();
          return result ? [[result.entry.text, result.id]] : argumentManager.getCurrentEntries();
        }
      }

      throw new Error("Error during processing -- Context:" + callingContext);
    };

  }
  return ExtensionWithCustomArgumentSupport;
}