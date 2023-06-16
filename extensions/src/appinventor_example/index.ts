import { Environment, extension, ExtensionMenuDisplayDetails, block, ArgumentType, BlockType, getterBlock, PropertyBlockDetails, setterBlock } from "$common";

const details: ExtensionMenuDisplayDetails = { name: "App Inventor Example", generateAppInventorBinding: true };

const heightProperty: PropertyBlockDetails<number> = { property: "Height", type: ArgumentType.Number };

export default class _ extends extension(details, "appInventor") {
  init(env: Environment): void { }

  field = 0;

  @getterBlock(heightProperty)
  get some_property(): number {
    if (this.withinAppInventor) console.log("RAISE Blocks + App Inventor = <3");
    return this.field;
  }

  @setterBlock(heightProperty)
  set some_property(value: number) {
    this.field = value;
  }
}