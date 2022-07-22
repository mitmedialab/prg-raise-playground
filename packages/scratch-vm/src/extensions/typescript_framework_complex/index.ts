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

class MyExtension extends Extension<DisplayDetails, Blocks> {
  options: number[];
  name = () => "My Extension";

  init() { 
    this.options = [3, 4, 5];
  }

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
        text: (a) => `Play note: ${a}`,
        operation: (a) => { console.log(`Playing ${a}`)},
      }
    },
  })};

  buildReport(): Block<() => void> {

    const getFive = () => console.log(5);

    const myOP = (blockUtility) => getFive();

    return {
      type: BlockType.Command,
      args: [],
      text: () => "Hi Five!",
      operation: myOP,
    }
  }
}

export = MyExtension;