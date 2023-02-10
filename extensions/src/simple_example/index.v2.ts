import { ArgumentType, BlockType, Environment, Menu, Extension } from "$common";
import { SaveDataHandler, block, buttonBlock, extension, legacy, ExtensionV2 } from "$v2";
import { oldGetInfo } from "./legacyTest";

@extension({
  name: "Super Simple Typescript Extension!",
  description: "Skeleton for a typescript extension",
  iconURL: "",
  insetIconURL: "",
})
@legacy(oldGetInfo)
export default class SimpleTypescript extends ExtensionV2 {
  count: number = 0;

  saveDataHandler = new SaveDataHandler({
    Extension: SimpleTypescript,
    onSave: ({ count }) => ({ count }),
    onLoad: (self, { count }) => self.count = count
  });

  hello() {

  }

  init(env: Environment) {
  }

  increment() {
    this.count++;
  }

  incrementBy(amount: number) {
    this.count += amount;
  }

  @block({
    type: BlockType.Command,
    text: (msg) => `Log ${msg} to the console`,
    arg: { type: ArgumentType.String, options: logOptions }
  })
  log(msg: string) {
    console.log(msg);
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

const logOptions = {
  items: ['1', 'two', 'three'],
  acceptsReporters: true,
  handler: (x: any) => Extension.TryCastToArgumentType(ArgumentType.String, x, () => {
    alert(`Unsopported input: ${x}`);
    return "";
  })
} satisfies Menu<string>;