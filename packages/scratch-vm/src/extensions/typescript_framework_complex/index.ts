import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block, Implementation, Implements } from "../../typescript-support/types";

interface MyBlocks {
  playNote: Block<(a: number) => void>;
  report: Block<() => number>;
  add: Block<(left: number, right: number) => number>;
}

//BlockImplementation<(left: number, right: number) => number>
const add: Implements<MyBlocks['add']> = (self: MyExtension) => ({
  type: BlockType.Command,
  operation(left, right) {
    return left + right;
  },
  arguments: [
    { type: ArgumentType.Number, defaultValue: 3, options: self.options },
    { type: ArgumentType.Angle }
  ],
  text: (left, right) => `Add ${left} to ${right}`,
});

type Title = "Realistic Typescript-Based Extension";
type Description = "Demonstrating how typescript can be used to write an extension";
type IconURL = "Typescript_logo.png";
type InsetIconURL = "typescript-logo.svg";

class MyExtension extends Extension<Title, Description, IconURL, InsetIconURL, {
  playNote: Block<(a: number) => void>;
  report: Block<() => number>;
  add: Block<(left: number, right: number) => number>;
}> {
  options = [3, 4, 5];

  init() {
  }

  blockDefinitions = () => ({
    'add': add,
    'report': this.report,
    'playNote': this.playNote,
  });


  report(): Implementation<MyBlocks['report']> {

    const getFive = () => 5;

    const myOP = () => getFive();

    return {
      type: BlockType.Command,
      arguments: [],
      text: () => "",
      operation: myOP,
    }
  }

  playNote(): Implementation<MyBlocks['playNote']> {
    return {
      type: BlockType.Command,
      arguments: [{ type: ArgumentType.Number }],
      text: () => "",
      operation: (a) => { },
    }
  }
}

export = MyExtension;