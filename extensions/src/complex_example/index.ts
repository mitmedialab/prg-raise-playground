import { ArgumentType, BlockType, Block, BlockDefinitions, RGBObject, MenuItem, ButtonBlock, Extension } from "$common";
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

export const enum Animal {
  Leopard,
  Tiger,
  Gorilla,
  Monkey,
  Pig
}


const nameByAnimal: Record<Animal, string> = {
  [Animal.Leopard]: 'leopard',
  [Animal.Tiger]: 'tiger',
  [Animal.Gorilla]: 'gorilla',
  [Animal.Monkey]: 'monkey',
  [Animal.Pig]: 'pig',
}

const emojiByAnimal: Record<Animal, string> = {
  [Animal.Leopard]: '🐆',
  [Animal.Tiger]: '🐅',
  [Animal.Gorilla]: '🦍',
  [Animal.Monkey]: '🐒',
  [Animal.Pig]: '🐖',
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
  addAnimalToCollection: (animal: Animal) => void;
  chooseBetweenAnimals: (animal: Animal) => string;
  multiplyUsingSelf: (left: number, right: number) => number;
  multiplyUsingThis: (left: number, right: number) => number;
  add: (left: number, right: number) => number;
  showAnimalCollectionUI: ButtonBlock;
}

export default class TypeScriptFrameworkExample extends Extension<DisplayDetails, Blocks> {
  lhsOptions: number[];
  animals: MenuItem<Animal>[];
  collection: Animal[] = [Animal.Gorilla];
  getAnimalCollection: () => MenuItem<Animal>[];

  getAnimalCollectionEmojis() { return this.collection.map(animal => emojiByAnimal[animal]) }

  addAnimalToCollection(animal: Animal) { return this.collection.push(animal) }

  state: number = 0;

  defineTranslations() { return undefined };

  init() {
    this.lhsOptions = [3, 4, 5];
    this.animals = Object.entries(emojiByAnimal).map(([animal, emoji]) => ({
      value: parseInt(animal), text: emoji
    }));

    this.getAnimalCollection = () => this.collection.map(
      animal => ({
        text: emojiByAnimal[animal],
        value: animal
      })
    );
  }

  defineBlocks(): BlockDefinitions<TypeScriptFrameworkExample> {
    return {

      reportId: () => ({
        type: BlockType.Reporter,
        text: 'My Extension ID is',
        operation: () => this.id
      }),

      reportColorChannel: () => ({
        type: BlockType.Reporter,
        args: [
          ArgumentType.Color,
          {
            type: ArgumentType.String, options: [
              { value: 'r', text: 'red' },
              { value: 'g', text: 'green' },
              { value: 'b', text: 'blue' }
            ]
          }],
        text: (color, channel) => `Report ${channel} of ${color}`,
        operation: (color, channel) => color[channel]
      }),

      'sumMatrix': () => ({
        type: "reporter",
        args: [
          ArgumentType.Matrix,
          {
            type: ArgumentType.Number, options: [
              { value: MatrixDimension.Row, text: 'rows' },
              { value: MatrixDimension.Column, text: 'columns' },
              { value: MatrixDimension.Both, text: 'rows and columns' }
            ]
          }],
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

      incrementStateViaThis: () => ({
        type: BlockType.Reporter,
        text: 'Increment (via \'this\')',
        operation: () => ++this.state
      }),

      'incrementStateViaSelf': (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        text: 'Increment (via \'self\')',
        operation: () => ++self.state
      }),

      'selectNote': () => ({
        type: BlockType.Reporter,
        arg: ArgumentType.Note,
        text: (note) => `Pick note ${note}`,
        operation: (note) => note
      }),

      'selectAngle': () => ({
        type: BlockType.Reporter,
        arg: ArgumentType.Angle,
        text: (angle) => `Pick angle ${angle}`,
        operation: (angle) => angle
      }),

      'useAnimalMenu1': () => ({
        type: BlockType.Reporter,
        arg:
        {
          type: ArgumentType.Number,
          options: {
            items: this.animals,
            acceptsReporters: true,
            handler: (input: any) => {
              switch (input) {
                case `${Animal.Leopard}`:
                case `${Animal.Tiger}`:
                case `${Animal.Gorilla}`:
                case `${Animal.Monkey}`:
                case `${Animal.Pig}`:
                  return input as Animal;
                default:
                  alert(`You silly goose! ${input} is not an animal.`);
                  return Animal.Leopard;
              }
            }
          }
        }
        ,
        text: (animal) => `This is a ${animal}`,
        operation: (animal) => nameByAnimal[animal],
      }),

      'useAnimalMenu2': (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        arg: { type: ArgumentType.Number, options: self.animals },
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

      addAnimalToCollection: (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Command,
        arg: { type: ArgumentType.Number, options: self.animals },
        text: (animal) => `Add ${animal} to collection`,
        operation: (animal) => {
          this.addAnimalToCollection(animal);
          this.openUI("Alert");
        },
      }),


      chooseBetweenAnimals: (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        arg: { type: ArgumentType.Number, options: self.getAnimalCollection },
        text: (animal) => `Animals in collection: ${animal}`,
        operation: (animal) => nameByAnimal[animal],
      }),

      // Example of class methods implementing a 'definition'
      multiplyUsingSelf: this.multiplyUsingSelf,
      multiplyUsingThis: this.multiplyUsingThis.bind(this), // NOTE: We must bind 'this' since it is used by our method

      // Example of an external 'definition'
      add: addDefinition,

      showAnimalCollectionUI: () => ({
        type: BlockType.Button,
        text: "Show Animal Collection",
        operation: () => {
          this.openUI("Animals", "Here's your animal collection");
        }
      })
    }
  }

  private multiplyUsingSelf(self: TypeScriptFrameworkExample): Block<TypeScriptFrameworkExample, Blocks['multiplyUsingSelf']> {
    return ({
      type: BlockType.Reporter,
      args: [
        { type: ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
        ArgumentType.Number
      ],
      text: (left, right) => `${left} X ${right}`,
      operation: (left, right) => left * right,
    })
  }

  private multiplyUsingThis(): Block<TypeScriptFrameworkExample, Blocks['multiplyUsingThis']> {
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