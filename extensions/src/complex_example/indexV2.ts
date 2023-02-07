import { ArgumentType, BlockType, Block, BlockDefinitions, RGBObject, MenuItem, ButtonBlock, Extension, BlockInfo, SaveDataHandler, copyTo } from "$common";
import { ExtensionV2 } from "$common/ExtensionV2";
import { block, buttonBlock } from "$common/decorators";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
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


export const nameByAnimal: Record<Animal, string> = {
  [Animal.Leopard]: 'leopard',
  [Animal.Tiger]: 'tiger',
  [Animal.Gorilla]: 'gorilla',
  [Animal.Monkey]: 'monkey',
  [Animal.Pig]: 'pig',
}

export const emojiByAnimal: Record<Animal, string> = {
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

export default class TypeScriptFrameworkExample extends ExtensionV2 {
  lhsOptions: number[];
  animals: MenuItem<Animal>[];
  collection: Animal[] = [Animal.Gorilla];
  getAnimalCollection: () => MenuItem<Animal>[];

  getAnimalCollectionEmojis() { return this.collection.map(animal => emojiByAnimal[animal]) }

  addAnimalToCollection(animal: Animal) { return this.collection.push(animal) }

  state: number = 0;

  saveDataHandler = new SaveDataHandler({
    Extension: TypeScriptFrameworkExample,
    onSave: ({ collection, state }) => ({ collection, state }),
    onLoad: (target, source) => copyTo({ target, source })
  });

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

      reportId: {
        type: BlockType.Reporter,
        text: 'My Extension ID is',
        operation: () => this.id
      },

      reportColorChannel: {
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
      },

      'sumMatrix': {
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
      },

      incrementStateViaThis: {
        type: BlockType.Reporter,
        text: 'Increment (via \'this\')',
        operation: () => ++this.state
      },

      'incrementStateViaSelf': (self: TypeScriptFrameworkExample) => ({
        type: BlockType.Reporter,
        text: 'Increment (via \'self\')',
        operation: () => ++self.state
      }),

      'selectNote': {
        type: BlockType.Reporter,
        arg: ArgumentType.Note,
        text: (note) => `Pick note ${note}`,
        operation: (note) => note
      },

      'selectAngle': {
        type: BlockType.Reporter,
        arg: ArgumentType.Angle,
        text: (angle) => `Pick angle ${angle}`,
        operation: (angle) => angle
      },

      'useAnimalMenu1': {
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
      },

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
        arg: self.makeCustomArgument({
          component: "AnimalArgument",
          initial: { value: Animal.Leopard, text: nameByAnimal[Animal.Leopard] }
        }),
        text: (animal) => `Add ${animal} to collection`,
        operation: (animal) => {
          this.addAnimalToCollection(animal);
          this.openUI("Alert");
        },
      }),

      // Example of an external 'definition'
      add: addDefinition,
    }
  }

  @block((self) => ({
    type: BlockType.Command,
    arg: self.makeCustomArgument({
      component: "AnimalArgument",
      initial: { value: Animal.Leopard, text: nameByAnimal[Animal.Leopard] }
    }),
    text: (animal) => `Add ${animal} to collection`,
  }))
  addAnimalToCollectionAndAlert(animal: Animal) {
    this.addAnimalToCollection(animal);
    this.openUI("Alert");
  }

  @block((self) => ({
    type: BlockType.Reporter,
    arg: { type: ArgumentType.Number, options: self.getAnimalCollection },
    text: (animal) => `Animals in collection: ${animal}`,
  }))
  chooseBetweenAnimals(animal: Animal) {
    return nameByAnimal[animal];
  }

  @buttonBlock("Show Animal Collection")
  showAnimalCollectionUI() {
    this.openUI("Animals", "Here's your animal collection");
  }

  // Details of block defined using a 'block getter' function implemented using 'method' syntax.
  // This block is functionally equivalent to the one for 'multiplyUsingSelf' below.
  @block(function () {
    return {
      type: BlockType.Reporter,
      args: [
        { type: ArgumentType.Number, defaultValue: 3, options: this.lhsOptions },
        ArgumentType.Number
      ],
      text: (left, right) => `${left} X ${right}`,
    }
  })
  multiplyUsingThis(left: number, right: number) {
    return left * right;
  }

  // Details of block defined using a 'block getter' function implemented using 'arrow' syntax.
  // This block is functionally equivalent to the one for 'multiplyUsingThis' above.
  @block((self) => ({
    type: BlockType.Reporter,
    text: (left, right) => `${left} X ${right}`,
    args: [
      { type: ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
      ArgumentType.Number
    ],
  }))
  multiplyUsingSelf(left: number, right: number) {
    return left * right;
  }
}