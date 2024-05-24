import { ArgumentType, BlockType, BlockUtilityWithID, Environment, ExtensionMenuDisplayDetails, Language, Menu, SaveDataHandler, block, buttonBlock, extension, tryCastToArgumentType, untilTimePassed, scratch } from "$common";
import jibo from "./jibo.png";
import five from "./five.png";

const details: ExtensionMenuDisplayDetails = {
  name: "Simple Typescript Extension",
  description: "Skeleton for a typescript extension",
  implementationLanguage: Language.English,
  [Language.Español]: {
    name: "Extensión simple Typescript",
    description: "Ejemplo de una extensión simple usando Typescript"
  },
  blockColor: "#822fbd",
  menuColor: "#4ed422",
  menuSelectColor: "#9e0d2c",
  tags: ["PRG Internal"],
}

export default class SimpleTypescript extends extension(details, "ui", "customSaveData", "indicators") {
  count: number = 0;
  value: number = 4;

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

  async init(env: Environment) {
  }

  @block((self) => ({
    type: BlockType.Command,
    text: (msg) => `Indicate and log a ${msg} to the console`,
    arg: { type: ArgumentType.String, options: self.logOptions }
  }))
  log(value: string) {
    console.log(value);
  }

  @(scratch.reporter`Add ${{ type: "string", defaultValue: "yee" }} to ${{ type: "string", defaultValue: "haw" }}: strings simple`)
  simpleReporterString(x: string, y: string) {
    return x + y;
  }

  @(scratch.reporter`Add ${{ type: "number", defaultValue: 3 }} to ${"number"}: number simple`)
  simpleReporterNumber(x: number, y: number) {
    return x + y;
  }

  @(scratch.reporter((instance, $) => $`Add ${{ type: "string", defaultValue: "oo" }} to ${{ type: "string", defaultValue: "wee" }}: strings complex`))
  reporterWithCallbackString(x: string, y: string) {
    return x + y;
  }

  @(scratch.reporter((self, $) => $`Add ${{ type: "number", defaultValue: 3 }} to ${"number"}: number complex`))
  reporterWithCallbackNumber(x: number, y: number) {
    return x + y;
  }

  @(scratch.command`Hello ${{ type: "string", defaultValue: "there" }}`)
  simpleCommand(text: string) {
    console.log(text);
  }

  @block({
    type: "command",
    args: [
      { type: "string", defaultValue: "Howdy!" },
      { type: "string", options: ["error", "success", "warning"] },
      { type: "number", options: [1, 3, 5] }
    ],
    text: (msg, type, time) => `Indicate '${msg}' as ${type} for ${time} seconds`,
  })
  async indicateMessage(value: string, type: typeof this.IndicatorType, time: number) {
    const position = "category";
    const msg = `This is a ${type} indicator for ${value}!`;
    const [{ close }] = await Promise.all([
      this.indicate({ position, type, msg }), untilTimePassed(time * 1000)
    ]);
    close();
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
  addFive(lhs: number, five: "inline image", rhs: number, { blockID }: BlockUtilityWithID) {
    console.log(blockID);
    return lhs + 5 - rhs;
  }
}