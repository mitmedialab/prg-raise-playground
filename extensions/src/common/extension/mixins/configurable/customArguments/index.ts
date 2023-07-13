import CustomArgumentManager from "$common/extension/mixins/configurable/customArguments/CustomArgumentManager";
import { renderToDropdown } from "$common/extension/mixins/configurable/customArguments/ui";
import { ArgumentType } from "$common/types/enums";
import { customArgumentFlag, dropdownStateFlag, dropdownEntryFlag, customArgumentMethod, } from "$common/globals";
import { Argument, MenuItem } from "$common/types";
import { MinimalExtensionConstructor } from "../../base";
import { withDependencies } from "../../dependencies";
import customSaveData from "../customSaveData";
import { ComponentGetter, CustomArgumentRecipe, RuntimeWithCustomArgumentSupport, isCustomArgumentContainer } from "./common";

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

      const { id: extensionID, argumentManager } = this;
      const { component, id: initialID } = JSON.parse(value) as { component: string, id: string };
      const dropdownContext = runtime[dropdownStateFlag];

      switch (dropdownContext) {
        case "init":
          return argumentManager.getCurrentEntries();
        case "open": {
          const currentEntry = runtime[dropdownEntryFlag];
          const current = argumentManager.getEntry(currentEntry?.value ?? initialID);
          const setter = argumentManager.request(runtime);
          renderToDropdown(runtime, getComponent(extensionID, component), { setter, current, extension: this });
          return [["", ""]];
        }
        case "update": {
          const result = argumentManager.peek();
          return [[result.entry.text, result.id]];
        }
        case "close": {
          const result = argumentManager.tryResolve();
          return result ? [[result.entry.text, result.id]] : argumentManager.getCurrentEntries();
        }
      }

      throw new Error("Error during processing -- Context:" + dropdownContext);
    };

  }
  return ExtensionWithCustomArgumentSupport;
}