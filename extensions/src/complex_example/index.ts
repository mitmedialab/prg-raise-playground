import { ArgumentType, BlockType, RGBObject, MenuItem, copyTo, SaveDataHandler, block, buttonBlock, extension } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

const MatrixDimension = {
  Row: 0,
  Column: 1,
  Both: 2
} as const;

type DimensionName = keyof typeof MatrixDimension;
type Dimensionvalue = typeof MatrixDimension[DimensionName];

export const nameByAnimal = {
  Leopard: 'leopard',
  Tiger: 'tiger',
  Gorilla: 'gorilla',
  Monkey: 'monkey',
  Pig: 'pig',
} as const;

export type Animal = keyof typeof nameByAnimal;

export const emojiByAnimal = {
  Leopard: '🐆',
  Tiger: '🐅',
  Gorilla: '🦍',
  Monkey: '🐒',
  Pig: '🐖',
} satisfies Record<Animal, string>;

export default class TypeScriptFrameworkExample extends extension(
  {
    name: "Realistic Typescript-Based Extension",
    description: "Demonstrating how typescript can be used to write a realistic extension",
    iconURL: "Typescript_logo.png",
    insetIconURL: "typescript-logo.svg",
  },
  "ui",
  "customSaveData",
  "customArguments"
) {
  lhsOptions: number[];
  animals: MenuItem<Animal>[];
  collection: Animal[] = ["Gorilla"];
  getAnimalCollection: () => MenuItem<Animal>[];

  getAnimalCollectionEmojis() { return this.collection.map(animal => emojiByAnimal[animal]) }

  addAnimalToCollection(animal: Animal) { return this.collection.push(animal) }

  state: number = 0;

  override saveDataHandler = new SaveDataHandler({
    Extension: TypeScriptFrameworkExample,
    onSave: ({ collection, state }) => ({ collection, state }),
    onLoad: (target, source) => copyTo({ target, source })
  });

  init() {
    this.lhsOptions = [3, 4, 5];
    this.animals = Object.entries(emojiByAnimal).map(([animal, emoji]) => ({
      value: animal as Animal, text: emoji
    }));


    this.getAnimalCollection = () => this.collection.map(
      animal => ({
        text: emojiByAnimal[animal],
        value: animal
      })
    );
  }

  @block({
    type: BlockType.Reporter,
    text: 'My Extension ID is',
  })
  getID() {
    return this.id as string;
  }

  @block({
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
  })
  getColorChannel(color: RGBObject, channel: string) {
    return color[channel];
  }

  @block((self) => ({
    type: BlockType.Reporter,
    args: [
      { type: ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
      { type: ArgumentType.Number }
    ],
    text: (left, right) => `Add ${left} to ${right}`,
  }))
  add(left: number, right: number) {
    return left + right;
  }

  @block({
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
  })
  sumMatrix(matrix: boolean[][], dimension: Dimensionvalue) {
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

  @block({
    type: BlockType.Reporter,
    arg: ArgumentType.Note,
    text: (note) => `Pick note ${note}`,
  })
  selectNote(note: number) {
    return note;
  }

  @block({
    type: BlockType.Reporter,
    arg: ArgumentType.Angle,
    text: (angle) => `Pick angle ${angle}`,
  })
  selectAngle(angle: number) {
    return angle;
  }

  @block({
    type: BlockType.Reporter,
    text: 'Increment',
  })
  increment() {
    return ++this.state;
  }

  @block((self) => ({
    type: BlockType.Reporter,
    text: (animal) => `This is a ${animal}`,
    arg:
    {
      type: ArgumentType.String,
      options: {
        items: self.animals,
        acceptsReporters: true,
        handler: (input) => {
          switch (input) {
            case "Leopard":
            case "Tiger":
            case "Gorilla":
            case "Monkey":
            case "Pig":
              return input as any as Animal;
            default:
              alert(`You silly goose! ${input} is not an animal.`);
              return "Leopard";
          }
        }
      }
    }
  } as const))
  animalName(animal: Animal) {
    return nameByAnimal[animal];
  }

  @block((self) => ({
    type: BlockType.Reporter,
    arg: { type: ArgumentType.String, options: self.animals },
    text: (animal) => `Where does the ${animal} live?`,
  }))
  animalHabit(animal: Animal) {
    switch (animal) {
      case "Leopard":
        return 'Africa and Asia';
      case "Tiger":
        return 'Asia';
      case "Gorilla":
        return 'Africa';
      case "Monkey":
        return 'Africa, Asia, and South America';
      case "Pig":
        return 'Almost everywhere (except Antartica)';
    }
  }

  @block((self) => ({
    type: BlockType.Command,
    arg: self.makeCustomArgument({
      component: "AnimalArgument",
      initial: { value: "Leopard" as Animal, text: nameByAnimal["Leopard"] }
    }),
    text: (animal) => `Add ${animal} to collection`,
  }))
  addAnimalToCollectionAndAlert(animal: Animal) {
    this.addAnimalToCollection(animal);
    this.openUI("Alert");
  }

  @block((self) => ({
    type: BlockType.Reporter,
    arg: { type: ArgumentType.String, options: self.getAnimalCollection },
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
  multiplyUsingThis(left: number, right: number, util: BlockUtility) {
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
  multiplyUsingSelf(left: number, right: number, util: BlockUtility) {
    return left * right;
  }
}