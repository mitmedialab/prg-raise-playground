import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import addBuilder from "./addBuilder";

type DisplayDetails = {
  title: "Realistic Typescript-Based Extension",
  description: "Demonstrating how typescript can be used to write a realistic extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  playNote: (a: number) => void;
  report: () => number;
  add: (left: number, right: number) => number;
}

class MyExtension extends Extension<{
  title: "Realistic Typescript-Based Extension",
  description: "Demonstrating how typescript can be used to write a realistic extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
}, Blocks>
{
  options = [3, 4, 5];
  name = () => "My Extension";

  init() { }

  blockBuilders() {
    return ({

    // Example of an external 'builder' function
    'add': addBuilder,

    // Example of a method 'builder' function
    'report': this.buildReport,

    // Example of an arrow 'builder' function 
    'playNote': (self: MyExtension): Block<(a: number) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number }],
        text: () => "",
        operation: (a,) => { },
      }
    },
  })};

  buildReport(): Block<() => number> {

    const getFive = () => 5;

    const myOP = (blockUtility) => getFive();

    return {
      type: BlockType.Command,
      args: [],
      text: () => "",
      operation: myOP,
    }
  }
}

export = MyExtension;