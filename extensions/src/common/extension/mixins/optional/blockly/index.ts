import { MinimalExtensionConstructor } from "../../required";
import type * as Blockly from "blockly";

type Getters =
  {
    getMainWorkspace(): Blockly.Workspace & {
      getToolbox(): Blockly.Toolbox;
      getFlyout(): Blockly.Flyout;
    }
  }

type MinimalBlockly = Pick<typeof Blockly, keyof Getters | "Xml" | "Mutator" | "Msg">

/**
 * Mixin the ability to manipulate the Blockly workspace
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithUISupport extends Ctor {
    blockly: MinimalBlockly & Getters = window["Blockly"];
  }

  return ExtensionWithUISupport;
}