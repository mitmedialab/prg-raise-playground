import { Extension } from "$common/extension/GenericExtension";
import type ExtensionManager from "$scratch-vm/extension-support/extension-manager";
import type Runtime from "$scratch-vm/engine/runtime";
import { ExtensionBlocks } from "./blocks";
import { Language } from "../enums";
import { MethodNames, ValueOf } from "../utils";
import { ExtensionInstance } from "$common/extension";

export type BaseGenericExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;

/**
 * @summary An object passed to extensions on initialization. 
 * @description The Environment object should contain anything necessary for an extension to interact with the Scratch/Blockly environment
 * (and can therefore grow and evolve overtime).
 * 
 * A good rule of thumb is: If you have to access a nested object on the Runtime more than once, consider adding it to the 'Environment'
 */
export type Environment = {
  /**
   * The scratch runtime 
   */
  runtime: Runtime,
  /**
   * An example of a convenient property to have on the Environment.
   * Prior to the Extension Framework, video (and other io) was available via the runtime and thus required overly intimate knowledge of that class. 
   * NOTE: This will have type-safety soon, but currently has none.
   * @todo #161 
   */
  videoFeed: undefined | any,
  extensionManager: ExtensionManager,
}

export type Opocde<TExtension extends ExtensionInstance> = TExtension extends Extension<any, any>
  ? keyof TExtension["BlockFunctions"]
  : MethodNames<TExtension>;

export type ParameterOf<
  TExtension extends ExtensionInstance,
  TBlockKey extends Opocde<TExtension>,
  TIndex extends number,
> = Parameters<TExtension extends Extension<any, any> ? TExtension["BlockFunctions"][TBlockKey] : TExtension[TBlockKey]>[TIndex];

/**
 * How an extension should display in the extensions menu.
 * 
 * IMPORTANT! You can NOT use template literal types. 
 * @link https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html (Not allowed!)
 */
export type ExtensionMenuDisplayDetails = {
  name: string;
  description?: string;
  iconURL?: string;
  insetIconURL?: string;
  internetConnectionRequired?: boolean;
  collaborator?: string;
  bluetoothRequired?: boolean;
  launchPeripheralConnectionFlow?: boolean;
  useAutoScan?: boolean;
  connectionIconURL?: string;
  connectionSmallIconURL?: string;
  connectionTipIconURL?: string;
  connectingMessage?: string;
  helpLink?: string;
  featured?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  implementationLanguage?: ValueOf<typeof Language>;
} & Partial<Record<ValueOf<typeof Language>, { name: string, description: string }>>
