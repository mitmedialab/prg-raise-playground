import { ArgumentType, BlockType } from "../../typescript-support/enums";
import ExtensionBase from "../../typescript-support/ExtensionBase";
import { Block, Extension, Output } from "../../typescript-support/types";

interface MyBlocks {
  playNote: Block<(a: number) => void>;
  report: Block<() => number>;
  add: Block<(left: number, right: number) => number>;
}

class MyExtension extends ExtensionBase<MyBlocks> implements Extension<MyBlocks> {
  init() { }

  definition = () => ({
    'add': this.add,
    'report': this.report,
    'playNote': this.playNote,
  });

  add: MyBlocks['add'] = (self: MyExtension) => ({
    type: BlockType.Command,
    operation(left, right /* util? */) {
      return left + right;
    },
    arguments: [
      { type: ArgumentType.Number, defaultValue: 3, options: [3, 4, 5] },
      { type: ArgumentType.Angle }
    ],
    text: (left, right) => `Add ${left} to ${right}`,
  })

  report(): Output<MyBlocks['report']> {

    const getFive = () => 5;

    const myOP = () => getFive();

    return {
      type: BlockType.Command,
      arguments: [],
      text: () => "",
      operation: myOP,
    }
  }

  playNote(): Output<MyBlocks['playNote']> {
    return {
      type: BlockType.Command,
      arguments: [{ type: ArgumentType.Number }],
      text: () => "",
      operation: (a) => { },
    }
  }
}