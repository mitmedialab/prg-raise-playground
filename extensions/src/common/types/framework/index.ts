import { Extension } from "$common/extension/GenericExtension";
import type ExtensionManager from "$scratch-vm/extension-support/extension-manager";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import type { blockIDKey } from "../../globals";
import { ExtensionBlocks } from "./blocks";
import { Language } from "../enums";
import { MethodNames, ValueOf } from "../utils";
import { ExtensionInstance } from "$common/extension";
import { Tag } from "./tags";
import { Runtime } from "../scratch/vm";

export type BaseGenericExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;

export type BlockUtilityWithID = BlockUtility & { [blockIDKey]: string };

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
  extensionManager: ExtensionManager,
  scrollIntoView: () => void,
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
  /**
   * The display name of your extension
   */
  name: string;
  /**
   * A short description of your extension
   */
  description?: string;
  /**
   * This field encodes the graphic that will be associated with your extension in the extensions menu.
   * 
   * **IMPORTANT:** This field should be set to the name of a file (typically a png) that is in the same directory as your Extension's index.ts file.
   * @example
   * This example assumes that there is a file _myExtensionGraphic.png_ located in our extension's directory.
   * ```ts
   * iconURL: "myExtensionGraphic.png"
   * ```
   */
  iconURL?: string;
  /**
   * This field encodes the smaller image (like a thumbnail) that will appear both in the extensions menu, 
   * as well as on the edge of each of your extension's blocks.
   * 
   * **IMPORTANT:** This field should be set to the name of a file (typically an svg) that is in the same directory as your Extension's index.ts file.
   * @example This example assumes that there is a file _myExtensionLogo.svg_ located in our extension's directory.
   * ```ts
   * iconURL: "myExtensionLogo.svg"
   * ```
   */
  insetIconURL?: string;
  /** 
   * This field disables the inset icon that appears on the edge of each of your extension's blocks.
   * 
   * This field can only be set to true and should not be defined if you wish to keep the inset icon on your extension's blocks.
   */
  noBlockIcon?: true;
  /**
   * The overal color of the blocks in your extension.
   * Express as a hash code (e.g. #ff0000)
   */
  blockColor?: string;
  /**
   * The colors of the menus in your extension.
   * Express as a hash code (e.g. #ff0000)
   * 
   * **NOTE: In order for this setting to be respected, `blockColor` must also be defined**
   */
  menuColor?: string;
  /**
   * The color of the menu slots when a menu is clicked on.
   * Express as a hash code (e.g. #ff0000)
   * 
   * **NOTE: In order for this setting to be respected, `blockColor` must also be defined**
   */
  menuSelectColor?: string;
  /**
   * Associate certain tags with this extension so that it can be easily located within the extensions menu
   */
  tags?: Tag[];
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
} & Partial<Record<ValueOf<typeof Language>, { name: string, description: string }>>;