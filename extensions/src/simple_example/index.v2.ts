import { ArgumentType, BlockType, Environment, Menu, Extension, SaveDataHandler, block, buttonBlock, extension, legacy, ExtensionV2, tryCastToArgumentType } from "$common";
import { oldGetInfo } from "./legacyTest";

@extension({
  name: "Super Simple Typescript Extension!",
  description: "Skeleton for a typescript extension",
  iconURL: "",
  insetIconURL: "",
})
//@legacy(oldGetInfo)
export default class SimpleTypescript extends ExtensionV2 {
  count: number = 0;

  logOptions = {
    items: ['1', 'two', 'three'],
    acceptsReporters: true,
    handler: (x: any) => tryCastToArgumentType(ArgumentType.String, x, () => {
      alert(`Unsopported input: ${x}`);
      return "";
    })
  } satisfies Menu<string>

  saveDataHandler = new SaveDataHandler({
    Extension: SimpleTypescript,
    onSave: ({ count }) => ({ count }),
    onLoad: (self, { count }) => self.count = count
  });

  increment() {
    this.count++;
  }

  incrementBy(amount: number) {
    this.count += amount;
  }

  @block((self) => ({
    type: BlockType.Command,
    text: (msg) => `Log ${msg} to the console`,
    arg: { type: ArgumentType.String, options: self.logOptions }
  }))
  log(msg: string) {
    console.log(msg);
  }

  init(env: Environment) {
  }

  @block({ type: BlockType.Button, text: `Dummy UI` })
  dummyUI() {
    this.openUI("Dummy", "Howdy");
  }

  @block({ type: BlockType.Button, text: "Open Counter" })
  counterUI() {
    this.openUI("Counter", "Pretty cool, right?");
  }

  @buttonBlock("Show colors")
  colorUI() {
    this.openUI("Palette");
  }
}