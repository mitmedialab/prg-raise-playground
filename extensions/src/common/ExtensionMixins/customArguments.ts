import { isCustomArgumentHack, processCustomArgumentHack } from "$common/customArguments";
import CustomArgumentManager, { ArgumentEntry } from "$common/customArguments/CustomArgumentManager";
import { ArgumentType } from "$common/enums";
import { closeDropdownState, customArgumentCheck, customArgumentFlag, dropdownEntryFlag, dropdownStateFlag, initDropdownState, openDropdownState } from "$common/globals";
import { Argument, BaseExtension, Menu, MenuItem } from "$common/types";
import { ExtensionConstructor } from ".";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { CustomArgumentUIConstructor, renderToDropdown } from "$common/customArguments/dropdownOverride";

type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

const callingContext = {
  DrowpdownOpen: openDropdownState,
  DropdownClose: closeDropdownState,
  Init: initDropdownState,
} as const;

/**
 * Mixin the ability for extensions to create custom arguments types with their own specific UIs
 * @param Ctor 
 * @returns 
 */
export default function <T extends ExtensionConstructor>(Ctor: T) {
  abstract class _ extends Ctor {

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

    /**
     * Utilized externally by scratch-vm to check if a given argument should be treated as a 'custom argument'
     */
    private [customArgumentCheck] = isCustomArgumentHack.bind(this) as typeof isCustomArgumentHack;

    /**
     * Utilized externally by scratch-vm to process custom arguments
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
          renderToDropdown(getComponent(extensionID, component), { setter: setEntry, current, extension: this as any as BaseExtension });
          return [["Apply", id]];
        }
      }

      throw new Error("Error during processing -- Context:" + callingContext);
    };

  }

  return _;
}