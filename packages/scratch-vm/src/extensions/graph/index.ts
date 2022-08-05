import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import { Graph } from './graph';
type DisplayDetails = {
  title: "Basic Graph Theory",
  description: "Visualize some basic properties of graphs and graph algorithms",
  iconURL: "graph.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  playNote: (a: number) => void;
  report: () => number;
  // add: (left: number, right: number) => number;
}

class GraphExtension extends Extension<DisplayDetails, Blocks> {
  options: number[];
  name = () => "ScratchGraph";

  init() { 
    console.log('Get ready to graph it up.')
  }

  blockBuilders() {
    return ({

    // Example of an external 'builder' function
    // 'add': addBuilder,

    // Example of a method 'builder' function
    'report': this.buildReport,

    // Example of an arrow 'builder' function 
    'playNote': (self: GraphExtension): Block<(a: number) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number }],
        text: (a) => `Play note: ${a}`,
        operation: (a) => { console.log(`Playing ${a}`); let foo = new Graph(); foo.addVertex('a'); foo.addVertex('b'); foo.removeVertex('a')},
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

export = GraphExtension;