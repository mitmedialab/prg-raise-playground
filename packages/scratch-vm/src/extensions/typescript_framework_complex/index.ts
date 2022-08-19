import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block, BlockDefinitions, RGBObject, MenuItem } from "../../typescript-support/types";
import addDefinition from "./addDefinition";

type DisplayDetails = {
  name: "Realistic Typescript-Based Extension",
  description: "Demonstrating how typescript can be used to write a realistic extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

const enum MatrixDimension {
  Row,
  Column,
  Both
}

const enum Animal {
  Leopard,
  Tiger,
  Gorilla,
  Monkey,
  Pig
}

type Blocks = {
  reportId: () => string;
  reportColorChannel: (color: RGBObject, channel: string) => number;
  sumMatrix: (matrix: boolean[][], dimension: MatrixDimension) => string;
  incrementStateViaThis: () => number;
  incrementStateViaSelf: () => number;
  selectNote: (note: number) => number;
  selectAngle: (angle: number) => number;
  useAnimalMenu1: (animal: Animal) => string;
  useAnimalMenu2: (animal: Animal) => string;
  multiplyUsingSelf: (left: number, right: number) => number;
  multiplyUsingThis: (left: number, right: number) => number;
  add: (left: number, right: number) => number;
}

class TypeScriptFrameworkExample extends Extension<DisplayDetails, Blocks> {
  lhsOptions: number[];
  animals: MenuItem<Animal>[];
  state: number = 0;

  init() { 
    this.lhsOptions = [3, 4, 5];
    this.animals = [
      {text: '🐆', value: Animal.Leopard},
      {text: '🐅', value: Animal.Tiger},
      {text: '🦍', value: Animal.Gorilla},
      {text: '🐒', value: Animal.Monkey},
      {text: '🐖', value: Animal.Pig},
    ];
  }

  defineBlocks(): BlockDefinitions<Blocks> {
    return {
      reportId: () => ({
        type: BlockType.Reporter,
        args: [],
        text: () => 'My Extension ID is',
        operation: () => this.id
      }),
      reportColorChannel: () => ({
        type: BlockType.Reporter,
        args: [ 
          ArgumentType.Color, 
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
          ArgumentType.Matrix, 
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

      'incrementStateViaThis': () => ({
        type: BlockType.Reporter,
        args: [],
        text: () => 'Increment (via \'this\')',
        operation: () => ++this.state
      }),

      'incrementStateViaSelf': (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        args: [],
        text: () => 'Increment (via \'self\')',
        operation: () => ++self.state
      }),

      'selectNote': () => ({
        type: BlockType.Reporter,
        args: [ ArgumentType.Note ],
        text: (note) => `Pick note ${note}`,
        operation: (note) => note
      }),

      'selectAngle': () => ({
        type: BlockType.Reporter,
        args: [ ArgumentType.Angle ],
        text: (angle) => `Pick angle ${angle}`,
        operation: (angle) => angle
      }),

      'useAnimalMenu1': () => ({
        type: BlockType.Reporter,
        args: [{ type: ArgumentType.Number, options: this.animals}],
        text: (animal) => `This is a ${animal}`,
        operation: (animal) => {
          switch (animal) {
            case Animal.Leopard:
              return 'leopard';
            case Animal.Tiger:
              return 'tiger';
            case Animal.Gorilla:
              return 'gorilla';
            case Animal.Monkey:
              return 'monkey';
            case Animal.Pig:
              return 'pig';
          }
        },
      }),

      'useAnimalMenu2': (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        args: [{ type: ArgumentType.Number, options: self.animals}],
        text: (animal) => `Where does the ${animal} live?`,
        operation: (animal) => {
          switch (animal) {
            case Animal.Leopard:
              return 'Africa and Asia';
            case Animal.Tiger:
              return 'Asia';
            case Animal.Gorilla:
              return 'Africa';
            case Animal.Monkey:
              return 'Africa, Asia, and South America';
            case Animal.Pig:
              return 'Almost everywhere (except Antartica)';
          }
        },
      }),

      // Example of class methods implementing a 'definition'
      'multiplyUsingSelf': this.multiplyUsingSelf,
      'multiplyUsingThis': this.multiplyUsingThis.bind(this), // NOTE: We must bind 'this' since it is used by our method

      // Example of an external 'definition'
      'add': addDefinition,
    }
  }

  private multiplyUsingSelf(self: TypeScriptFrameworkExample): Block<Blocks['multiplyUsingSelf']> {
    return ({
      type: BlockType.Reporter,
      args: [
        { type: ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
        ArgumentType.Number
      ],
      text: (left, right) => `${left} X ${right}`,
      operation: (left, right) => {
        return left * right;
      }
    })
  }

  private multiplyUsingThis(): Block<Blocks['multiplyUsingThis']> {
    return ({
      type: BlockType.Reporter,
      args: [
        { type: ArgumentType.Number, defaultValue: 3, options: this.lhsOptions },
        ArgumentType.Number
      ],
      text: (left, right) => `${left} X ${right}`,
      operation: (left, right) => {
        return left * right;
      }
    })
  }
}

export = TypeScriptFrameworkExample;