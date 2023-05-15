import { MinimalExtensionConstructor } from "../../required";
import type * as Blockly from "blockly";

type Getters = {
  getToolbox(): Blockly.Toolbox;
  getFlyout(): Blockly.Flyout;
}

/**
 * Mixin the ability to manipulate the Blockly workspace
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithUISupport extends Ctor {
    blockly: typeof Blockly & Getters = window["Blockly"];
  }

  return ExtensionWithUISupport;
}
