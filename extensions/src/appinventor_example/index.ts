import { Environment, extension, ExtensionMenuDisplayDetails, block, ArgumentType, BlockType, getterBlock } from "$common";

const details: ExtensionMenuDisplayDetails = { name: "App Inventor Example" };

export default class _ extends extension(details) {
  init(env: Environment): void { }

  field = 0;

  @getterBlock({ property: "Height" })
  get some_property(): number {
    return this.field++;
  }
}