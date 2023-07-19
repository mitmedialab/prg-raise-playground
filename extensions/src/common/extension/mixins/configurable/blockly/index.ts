import { MinimalExtensionConstructor } from "../../base";
import type * as Blockly from "blockly";

type Methods =
  {
    getMainWorkspace(): Blockly.Workspace & {
      getToolbox(): Blockly.Toolbox;
      getFlyout(): Blockly.Flyout;
      zoom: Blockly.WorkspaceSvg["zoom"];
      reportValue(blockID: string, serializedValue: string);
    }
  }

export type BlockSvg = Blockly.BlockSvg;
type MinimalBlockly = Omit<typeof Blockly, keyof Methods>

/**
 * Mixin the ability to manipulate the Blockly workspace
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithUISupport extends Ctor {
    blockly: MinimalBlockly & Methods = window["Blockly"];
  }

  return ExtensionWithUISupport;
}