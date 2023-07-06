import { Environment, extension, block, getterBlock, PropertyBlockDetails, setterBlock, Matrix } from "$common";

const heightProperty: PropertyBlockDetails<number> = { name: "Height", type: "number" };

export default class extends extension({ name: "App Inventor Example" }, "appInventor") {
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

  @block({
    text: (x, y, z) => `${x} ${y} ${z}`,
    args: ["number", "string", "matrix"],
    type: "reporter"
  })
  dummy(x: number, y: string, z: Matrix): number {
    return 0;
  }
}