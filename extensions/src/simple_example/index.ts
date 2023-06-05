import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, Language, Menu, SaveDataHandler, block, buttonBlock, extension, tryCastToArgumentType } from "$common";
import jibo from "./jibo.png";
import five from "./five.png";

const details: ExtensionMenuDisplayDetails = {
  name: "Simple Typescript Extension",
  description: "Skeleton for a typescript extension",
  implementationLanguage: Language.English,
  [Language.Español]: {
    name: "Extensión simple Typescript",
    description: "Ejemplo de una extensión simple usando Typescript"
  }
}

export default class SimpleTypescript extends extension(details, "ui", "customSaveData") {
  count: number = 0;

  logOptions: Menu<string> = {
    items: ['1', 'two', 'three'],
    acceptsReporters: true,
    handler: (x: any) => tryCastToArgumentType(ArgumentType.String, x, () => {
      alert(`Unsopported input: ${x}`);
      return "";
    })
  }

  override saveDataHandler = new SaveDataHandler({
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

  init(env: Environment) { }

  @block((self) => ({
    type: BlockType.Command,
    text: (msg) => `Log ${msg} to the console`,
    arg: { type: ArgumentType.String, options: self.logOptions }
  }))
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

  @block({
    type: BlockType.Command,
    text: (jibo) => `This is what jibo looks like: ${jibo}`,
    arg: {
      type: "image",
      uri: jibo,
      alt: "Picture of Jibo",
      flipRTL: true
    }
  })
  imageBlock(jibo: "inline image") {
  }

  @block({
    type: "reporter",
    text: (lhs, five, rhs) => `${lhs} + ${five} - ${rhs}`,
    args: [
      { type: "number", defaultValue: 1 },
      { type: "image", uri: five, alt: "golden five" },
      "number"
    ]
  })
  addFive(lhs: number, five: "inline image", rhs: number) {
    return lhs + 5 - rhs;
  }
}