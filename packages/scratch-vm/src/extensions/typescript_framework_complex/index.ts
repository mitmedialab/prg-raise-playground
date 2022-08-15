import { count } from "console";
import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block, DefineBlock, BlockOperation, BlockDefinitions, RGBObject } from "../../typescript-support/types";
import addDefinition from "./addBuilder";

type DisplayDetails = {
  title: "Realistic Typescript-Based Extension",
  description: "Demonstrating how typescript can be used to write a realistic extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

const enum MatrixDimension {
  Row,
  Column,
  Both
}

type Blocks = {
  reportChannel: (color: RGBObject, channel: string) => number;
  sumMatrix: (matrix: boolean[][], dimension: MatrixDimension) => string;
  playNote: (a: number) => void;
  report: () => string;
  add: (left: number, right: number) => number;
}

class MyExtension extends Extension<DisplayDetails, Blocks> {
  options: number[];
  name = () => "My Extension";

  init() { 
    this.options = [3, 4, 5];
  }

  defineBlocks(): BlockDefinitions<Blocks> {
    return {
      
      'reportChannel': () => ({
        type: BlockType.Reporter,
        args: [
          { type: ArgumentType.Color }, 
          { type: ArgumentType.String, options: [
            { value: 'r', text: 'red' },
            { value: 'g', text: 'green' },
            { value: 'b', text: 'blue' }
          ]}],
        text: (color, channel) => `Report ${channel} of ${color}`,
        operation: (color, channel) => color[channel]
      }),

      'sumMatrix': () => ({
        type: BlockType.Reporter,
        args: [ 
          { type: ArgumentType.Matrix }, 
          { type: ArgumentType.Number, options: [
            { value: MatrixDimension.Row, text: 'rows' },
            { value: MatrixDimension.Column, text: 'columns' },
            { value: MatrixDimension.Both, text: 'rows and columns'}
        ]}],
        text: (matrix, dimension) => `Sum ${dimension} of ${matrix}`,
        operation: (matrix, dimension) => {
          switch (dimension) {
            case MatrixDimension.Row: 
              return matrix.map(row => row.reduce((count, current) => count + Number(current), 0)).join("\n");
            case MatrixDimension.Column:
              const columnSums = [0, 0, 0, 0, 0];
              matrix.forEach(row => row.forEach((value, index) => {
                columnSums[index] += Number(value);
              }));
              return columnSums.join(" ");
            case MatrixDimension.Both:
              return matrix
              .map(row => row.reduce((count, current) => count + Number(current), 0))
              .reduce((count, current) => count + current, 0)
              .toString();
          }
        }
      }),

      // Example of an external 'builder' function
      'add': addDefinition,

      // Example of a method 'builder' function
      'report': this.defineReport,

      // Example of an arrow 'builder' function 
      'playNote': (self: MyExtension) => ({
          type: BlockType.Command,
          args: [{ type: ArgumentType.Number }],
          text: (a: number) => `Play note: ${a}`,
          operation: (a: number) => { console.log(`Playing ${a}`)},
      }),
    }
  };

  defineReport(): Block<() => void> {

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