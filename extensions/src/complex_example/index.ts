import { RGBObject, MenuItem, copyTo, SaveDataHandler, extension, scratch, type BlockUtilityWithID } from "$common";
import AnimalArgument from "./AnimalArgument.svelte";

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

export default class TypeScriptFrameworkExample extends extension(
  {
    name: "Realistic Typescript-Based Extension",
    description: "Demonstrating how typescript can be used to write a realistic extension",
    iconURL: "Typescript_logo.png",
    insetIconURL: "typescript-logo.svg",
    tags: ["PRG Internal"]
  },
  "ui",
  "customSaveData",
  "customArguments"
) {
  lhsOptions: number[];
  animals: MenuItem<Animal>[];
  collection: Animal[] = [Animal.Gorilla];
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
      value: parseInt(animal), text: emoji
    }));


    this.getAnimalCollection = () => this.collection.map(
      animal => ({
        text: emojiByAnimal[animal],
        value: animal
      })
    );
  }

  @(scratch.reporter`My Extension ID is`)
  getID() {
    return this.id as string;
  }

  @(scratch.reporter`Report ${{
    type: "string", options: [
      { value: 'r', text: 'red' },
      { value: 'g', text: 'green' },
      { value: 'b', text: 'blue' }
    ]
  }} 
  of ${"color"}`)
  getColorChannel(channel: string, color: RGBObject,) {
    return color[channel];
  }

  @(scratch.reporter(
    (self, tag) => tag`Add ${{ type: "number", defaultValue: 3, options: self.lhsOptions }} to ${"number"}`)
  )
  add(left: number, right: number) {
    return left + right;
  }

  @(scratch.reporter`Sum ${"matrix"} of ${{
    type: "number", options: [
      { value: MatrixDimension.Row, text: 'rows' },
      { value: MatrixDimension.Column, text: 'columns' },
      { value: MatrixDimension.Both, text: 'rows and columns' }
    ]
  }}`)
  sumMatrix(matrix: boolean[][], dimension: MatrixDimension) {
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

  @(scratch.reporter`Pick note ${"note"}`)
  selectNote(note: number) {
    return note;
  }

  @(scratch.reporter`Pick angle ${"angle"}`)
  selectAngle(angle: number) {
    return angle;
  }

  @(scratch.reporter`Increment`)
  increment() {
    return ++this.state;
  }

  @(scratch.reporter(function (_, tag) {
    const handler = (input) => {
      switch (input) {
        case `${Animal.Leopard}`:
        case `${Animal.Tiger}`:
        case `${Animal.Gorilla}`:
        case `${Animal.Monkey}`:
        case `${Animal.Pig}`:
          return input as any as Animal;
        default:
          alert(`You silly goose! ${input} is not an animal.`);
          return Animal.Leopard;
      }
    }
    return tag`This is a ${{ type: "number", options: { items: this.animals, acceptsReporters: true, handler } }}`;
  }))
  animalName(animal: Animal) {
    return nameByAnimal[animal];
  }

  @(scratch.reporter((self, tag) => tag`Where does the ${{ type: "number", options: self.animals }} live?`))
  animalHabit(animal: Animal) {
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
  }

  @(scratch.command(function (_, tag) {
    const value = Animal.Leopard;
    const text = nameByAnimal[value];
    const arg = this.makeCustomArgument({ component: AnimalArgument, initial: { value, text } });
    return tag`Add ${arg} to collection`;
  }))
  addAnimalToCollectionAndAlert(animal: Animal) {
    this.addAnimalToCollection(animal);
    this.openUI("Alert");
  }

  @(scratch.reporter(
    (self, tag) => tag`Animals in collection: ${{ type: "number", options: self.getAnimalCollection }}`
  ))
  chooseBetweenAnimals(animal: Animal) {
    return nameByAnimal[animal];
  }

  @(scratch.button`Show Animal Collection`)
  showAnimalCollectionUI() {
    this.openUI("Animals", "Here's your animal collection");
  }

  // This block is functionally equivalent to the one for 'multiplyUsingSelf' below.
  @(scratch.reporter(
    function (_, tag) {
      return tag`${{ type: "number", defaultValue: 3, options: this.lhsOptions }} X ${"number"}`;
    })
  )
  multiplyUsingThis(left: number, right: number, util: BlockUtilityWithID) {
    return left * right;
  }

  // This block is functionally equivalent to the one for 'multiplyUsingThis' above.
  @(scratch.reporter(
    (self, tag) => tag`${{ type: "number", defaultValue: 3, options: self.lhsOptions }} X ${"number"}`
  ))
  multiplyUsingSelf(left: number, right: number, util: BlockUtilityWithID) {
    return left * right;
  }
}