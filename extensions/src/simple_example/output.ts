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
      if (typeof "" === "number") {
        AndroidBridge.setResult_double("anonymous", "", "number");
      } else if (typeof "" === "string") {
        AndroidBridge.setResult_string("anonymous", "", "string");
      } else {
        AndroidBridge.setResult("anonymous", "", typeof "");
      }
      if (typeof "" === "number") {
        AndroidBridge.setResult_double("anonymous", "", "number");
      } else if (typeof "" === "string") {
        AndroidBridge.setResult_string("anonymous", "", "string");
      } else {
        AndroidBridge.setResult("anonymous", "", typeof "");
      }
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
    AndroidBridge.setResult("increment", undefined, "undefined");
  }
  incrementBy(amount: number) {
    this.count += amount;
    AndroidBridge.setResult("incrementBy", undefined, "undefined");
  }
  async init(env: Environment) {}
  log(value: string) {
    console.log(value);
    AndroidBridge.setResult("log", undefined, "undefined");
  }
  async indicateMessage(value: string, time: number) {
    let type = "success" as typeof this.IndicatorType;
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
  dummyUI() {
    this.openUI("Dummy", "Howdy");
    AndroidBridge.setResult("dummyUI", undefined, "undefined");
  }
  counterUI() {
    this.openUI("Counter", "Pretty cool, right?");
    AndroidBridge.setResult("counterUI", undefined, "undefined");
  }
  colorUI() {
    this.openUI("Palette");
    AndroidBridge.setResult("colorUI", undefined, "undefined");
  }
  imageBlock(jibo: "inline image") {
    AndroidBridge.setResult("imageBlock", undefined, "undefined");
  }
  giveString(jibo: string) {
    if (typeof jibo === "number") {
      AndroidBridge.setResult_double("giveString", jibo, "number");
    } else if (typeof jibo === "string") {
      AndroidBridge.setResult_string("giveString", jibo, "string");
    } else {
      AndroidBridge.setResult("giveString", jibo, typeof jibo);
    }
    return jibo;
  }
  addFive(lhs: number, rhs: number) {
    if (typeof (lhs + 5 - rhs) === "number") {
      AndroidBridge.setResult_double("addFive", lhs + 5 - rhs, "number");
    } else if (typeof (lhs + 5 - rhs) === "string") {
      AndroidBridge.setResult_string("addFive", lhs + 5 - rhs, "string");
    } else {
      AndroidBridge.setResult("addFive", lhs + 5 - rhs, typeof (lhs + 5 - rhs));
    }
    return lhs + 5 - rhs;
  }
}