import type Runtime from "$scratch-vm/engine/runtime";
import CustomArgumentManager, { ArgumentEntry } from "$common/extension/mixins/optional/customArguments/CustomArgumentManager";
import { CustomArgumentUIConstructor, renderToDropdown } from "$common/extension/mixins/optional/customArguments/dropdownOverride";
import { ArgumentType } from "$common/types/enums";
import { openDropdownState, closeDropdownState, initDropdownState, customArgumentFlag, customArgumentCheck, dropdownStateFlag, dropdownEntryFlag } from "$common/globals";
import { Argument, BaseGenericExtension } from "$common/types";
import { MinimalExtensionConstructor } from "../../required";
import { WithDependencies } from "../../dependencies";

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
} as const;

/**
 * Mixin the ability for extensions to create custom argument types with their own specific UIs
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function mixin<T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithCustomArgumentSupport extends Ctor implements WithDependencies<["customSaveData"]> {

    getStaticDependencies() {
      return ["customSaveData"] as const;
    }

    /**
     * Create a custom argument for one of this block's arguments
     * @param param0 
     * - component: The svelte component to render the custom argument UI
     * - initial: The starting value of the the custom argument (including both its value and text representation)
     * - acceptReportersHandler: A function that must be defined if you'd like for your custom argument to accept reporters
     * @returns 
     */
    protected makeCustomArgument = <T>({ component, initial, acceptReportersHandler: handler }: { component: string, initial: ArgumentEntry<T>, acceptReportersHandler?: (x: any) => ArgumentEntry<T> }): Argument<T> => {
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
     * Utilized externally by scratch-vm to check if a given argument should be treated as a 'custom argument'.
     * Checks if the value returned by a dyanmic menu indicates that it should be treated as a 'custom argument'
     */
    private [customArgumentCheck](arr: Array<string | { text: string }>) {
      if (arr.length !== 1) return false;
      const item = arr[0];
      if (typeof item !== "object") return false;
      const { text } = item;
      return text === customArgumentFlag;
    };

    /**
     * Utilized externally by scratch-vm to process custom arguments
     * @param runtime NOTE: once we switch to V2, we can remove this and instead use the extension's runtime
     * @param param1 
     * @param getComponent 
     * @returns 
     */
    private processCustomArgumentHack(runtime: Runtime, [{ value }]: { value: string }[], getComponent: ComponentGetter): (readonly [string, string])[] {

      const { id: extensionID, customArgumentManager: argumentManager } = this;
      const { component, id: initialID } = JSON.parse(value) as { component: string, id: string };
      const context = runtime[dropdownStateFlag];

      switch (context) {
        case callingContext.Init:
          return argumentManager.getCurrentEntries();
        case callingContext.DropdownClose: {
          const result = argumentManager.tryResolve();
          return result ? [[result.entry.text, result.id]] : argumentManager.getCurrentEntries();
        }
        case callingContext.DrowpdownOpen: {
          const currentEntry = runtime[dropdownEntryFlag] as ArgumentEntry<any>;
          const prevID = currentEntry?.value ?? initialID;
          const current = argumentManager.getEntry(prevID);
          const [id, setEntry] = argumentManager.request();
          renderToDropdown(getComponent(extensionID, component), { setter: setEntry, current, extension: this as any as BaseGenericExtension });
          return [["Apply", id]];
        }
      }

      throw new Error("Error during processing -- Context:" + callingContext);
    };

  }
  return ExtensionWithCustomArgumentSupport;
}