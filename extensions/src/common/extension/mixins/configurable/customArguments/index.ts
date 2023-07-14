import CustomArgumentManager from "$common/extension/mixins/configurable/customArguments/CustomArgumentManager";
import { ArgumentType } from "$common/types/enums";
import { guiDropdownInterop } from "$common/globals";
import { Argument, MenuItem } from "$common/types";
import { MinimalExtensionConstructor } from "../../base";
import { withDependencies } from "../../dependencies";
import customSaveData from "../customSaveData";
import { ArgumentEntry, ArgumentID, CustomArgumentComponent, CustomArgumentRecipe, RuntimeWithCustomArgumentSupport, renderToDropdown } from "./utils";
import { ExtensionBase } from "$common/extension/ExtensionBase";

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
    protected makeCustomArgument = <T, TExtension extends ExtensionBase>({ component, initial, acceptReportersHandler: handler }: CustomArgumentRecipe<T, TExtension>): Argument<T> => {
      this.argumentManager ??= new CustomArgumentManager();
      const id = this.argumentManager.add(initial);
      const getItems = () => this.processMenuForCustomArgument(id, component);
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
    private processMenuForCustomArgument(initialID: ArgumentID, Component: CustomArgumentComponent): (ArgumentEntry<any>)[] {
      const { runtime, argumentManager } = this;
      const interop = (runtime as RuntimeWithCustomArgumentSupport)[guiDropdownInterop.runtimeKey];

      const { state, update, entry } = interop

      switch (state) {
        case "init":
          return argumentManager.getCurrentEntries();
        case "open": {
          const id = entry?.value ?? initialID;
          const current = argumentManager.getEntry(id);
          const setter = argumentManager.request(update);
          renderToDropdown(Component, { setter, current, extension: this });
          return [{ text: current.text, value: id }];
        }
        case "update": {
          const result = argumentManager.peek();
          return [{ text: result.entry.text, value: result.id }];
        }
        case "close": {
          const result = argumentManager.tryResolve();
          return result
            ? [{ text: result.entry.text, value: result.id }]
            : argumentManager.getCurrentEntries();
        }
      }

      throw new Error("Error during processing -- Context:" + state);
    };

  }
  return ExtensionWithCustomArgumentSupport;
}