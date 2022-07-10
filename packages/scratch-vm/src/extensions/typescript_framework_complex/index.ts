import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import addBuilder from "./addBuilder";

type Title = "Hello PArker"
class MyExtension extends Extension
  <
    {
      title: Title, //"Realistic Typescript-Based Extension",
      description: "Demonstrating how typescript can be used to write a realistic extension",
      iconURL: "Typescript_logo.png",
      insetIconURL: "typescript-logo.svg"
    },
    {
      playNote: (a: number) => void;
      report: () => number;
      add: (left: number, right: number) => number;
    }>
{
  options = [3, 4, 5];

  init() { }

  blockBuilders = () => ({

    // Example of an external 'builder' function
    'add': addBuilder,

    // Example of a method 'builder' function
    'report': this.buildReport,

    // Example of an arrow 'builder' function 
    'playNote': (self: MyExtension): Block<(a: number) => void> => {
      return {
        type: BlockType.Command,
        arguments: [{ type: ArgumentType.Number }],
        text: () => "",
        operation: (a,) => { },
      }
    },
  });

  buildReport(): Block<() => number> {

    const getFive = () => 5;

    const myOP = () => getFive();

    return {
      type: BlockType.Command,
      arguments: [],
      text: () => "",
      operation: myOP,
    }
  }
}

export = MyExtension;