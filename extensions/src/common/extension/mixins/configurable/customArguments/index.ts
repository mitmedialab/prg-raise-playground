import CustomArgumentManager from "$common/extension/mixins/configurable/customArguments/CustomArgumentManager";
import { ArgumentType } from "$common/types/enums";
import { guiDropdownInterop } from "$common/globals";
import { Argument, CustomArgument, DynamicMenuThatAcceptsReporters, Expand } from "$common/types";
import { MinimalExtensionConstructor } from "../../base";
import { withDependencies } from "../../dependencies";
import customSaveData from "../customSaveData";
import { ArgumentEntry, ArgumentID, CustomArgumentComponent, CustomArgumentRecipe, RuntimeWithCustomArgumentSupport, renderToDropdown } from "./utils";
import { ExtensionBase } from "$common/extension/ExtensionBase";
import { isString } from "$common/utils";
import { ExtensionInstanceWithFunctionality } from "../..";

type SupportedExtension = ExtensionInstanceWithFunctionality<["customArguments"]>;
const isCustomArgument = (arg: Argument<unknown>): arg is CustomArgument<unknown, SupportedExtension> =>
  !isString(arg) && arg.type === 'custom';

const getMethods = (extension: SupportedExtension, id: string, { component, acceptReportersHandler }: CustomArgument<unknown, SupportedExtension>) => {
  const getItems = () => extension["processMenuForCustomArgument"](id, component);
  const resolveArgument = (param: any): unknown => {
    const isIdentifier = isString(param) && CustomArgumentManager.IsIdentifier(param);
    const value = isIdentifier ? extension.customArgumentManager.getEntry(param).value : param;
    return acceptReportersHandler?.call(extension, value) ?? value;
  }
  return { getItems, handler: resolveArgument };
}

/**
 * Mixin the ability for extensions to create custom argument types with their own specific UIs
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function mixin<T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithCustomArgumentSupport extends withDependencies(Ctor, customSaveData) {
    private argumentManager: CustomArgumentManager = null;

    constructor(...args: any[]) {
      super(...args);
      const _this = this;
      this.addModifier("args", (args) => {
        return args.map(arg => {
          if (!isCustomArgument(arg)) return arg;
          const { defaultEntry, acceptReportersHandler } = arg;
          const id = this.customArgumentManager.add(defaultEntry);
          const { getItems, handler } = getMethods(_this, id, arg);
          const acceptsReporters = Boolean(acceptReportersHandler) as true; // Hack
          const options: DynamicMenuThatAcceptsReporters<unknown> = { acceptsReporters, getItems, handler }
          return { type: ArgumentType.Custom, defaultValue: id, options } as Argument<unknown>
        });
      })
    }

    /**
     * Create a custom argument for one of this block's argument. Within the argument object, you must provide:
     * - `component`: The svelte component to render (import it directly in your file)
     * - `initial`: The arguments default value (you must provide both the value and the text representation)
     */
    protected makeCustomArgument = <T, TExtension extends ExtensionBase>({ component, initial, acceptReportersHandler: handler }: Expand<CustomArgumentRecipe<T, TExtension>>): Argument<T> => {
      const id = this.customArgumentManager.add(initial);
      const getItems = () => this.processMenuForCustomArgument(id, component);
      return {
        type: ArgumentType.Custom,
        defaultValue: id,
        options: handler === undefined ? getItems : { acceptsReports: true, getItems, handler },
      } as Argument<T>
    }

    public get customArgumentManager(): CustomArgumentManager {
      this.argumentManager ??= new CustomArgumentManager();
      return this.argumentManager
    }

    private processMenuForCustomArgument(initialID: ArgumentID, Component: CustomArgumentComponent): (ArgumentEntry<any>)[] {
      const { runtime, argumentManager } = this;
      const interop = (runtime as RuntimeWithCustomArgumentSupport)[guiDropdownInterop.runtimeKey];

      const { state, update, entry } = interop

      switch (state) {
        case "init":
        case "close":
          return argumentManager.entries;
        case "open":
          const id = entry?.value ?? initialID;
          const current = argumentManager.getEntry(id);
          const setter = argumentManager.request(id, update);
          renderToDropdown(Component, { setter, current, extension: this });
          return [{ text: current.text, value: id }];
        case "update":
          return [argumentManager.getCurrent()];
      }
    };

  }
  return ExtensionWithCustomArgumentSupport;
}