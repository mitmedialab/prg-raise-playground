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
  tags: ["PRG Internal"]
};
export default class SimpleTypescript extends extension(details, "ui", "customSaveData", "indicators") {
  count: number = 0;
  value: number = 4;
  logOptions: Menu<string> = {
    items: ['1', 'two', 'three'],
    acceptsReporters: true,
    handler: (x: any) => tryCastToArgumentType(ArgumentType.String, x, () => {
      alert(`Unsopported input: ${x}`);
      AndroidBridge.setResult("anonymous", "");
      AndroidBridge.setResult("anonymous", "");
      return "";
    })
  };
  override saveDataHandler = new SaveDataHandler({
    Extension: SimpleTypescript,
    onSave: ({
      count
    }) => ({
      count
    }),
    onLoad: (self, {
      count
    }) => self.count = count
  });
  increment() {
    this.count++;
    AndroidBridge.setResult("increment");
  }
  incrementBy(amount: number) {
    this.count += amount;
    AndroidBridge.setResult("incrementBy");
  }
  async init(env: Environment) {}
  @scratch.command((self, tag) => tag`Indicate and log ${{
    type: "string",
    options: self.logOptions
  }} to the console`)
  log(value: string) {
    console.log(value);
    AndroidBridge.setResult("log");
  }
  @(scratch.command`
    Indicate ${{
    type: "string",
    defaultValue: "Howdy!"
  }} 
    as ${{
    type: "string",
    options: ["error", "success", "warning"]
  }} 
    for ${{
    type: "number",
    options: [1, 3, 5]
  }}
    seconds
  `)
  async indicateMessage(value: string, type: typeof this.IndicatorType, time: number) {
    const position = "category";
    const msg = `This is a ${type} indicator for ${value}!`;
    const [{
      close
    }] = await Promise.all([this.indicate({
      position,
      type,
      msg
    }), untilTimePassed(time * 1000)]);
    close();
  }
  @(scratch.button`Dummy UI`)
  dummyUI() {
    this.openUI("Dummy", "Howdy");
    AndroidBridge.setResult("dummyUI");
  }
  @(scratch.button`Open Counter`)
  counterUI() {
    this.openUI("Counter", "Pretty cool, right?");
    AndroidBridge.setResult("counterUI");
  }
  @(scratch.button`Show colors`)
  colorUI() {
    this.openUI("Palette");
    AndroidBridge.setResult("colorUI");
  }
  @(scratch.command`This is what jibo looks like ${{
    type: "image",
    uri: jibo,
    alt: "Picture of Jibo",
    flipRTL: true
  }}`)
  imageBlock(jibo: "inline image") {
    AndroidBridge.setResult("imageBlock");
  }
  @(scratch.reporter`${{
    type: "number",
    defaultValue: 1
  }} + ${{
    type: "image",
    uri: five,
    alt: "golden five"
  }} - ${"number"}`)
  addFive(lhs: number, five: "inline image", rhs: number, {
    blockID
  }: BlockUtilityWithID) {
    console.log(blockID);
    AndroidBridge.setResult("addFive", lhs + 5 - rhs);
    return lhs + 5 - rhs;
  }
}