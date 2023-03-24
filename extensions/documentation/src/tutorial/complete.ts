import { extension, block, type ExtensionMenuDisplayDetails, type Environment } from "$common";

const details: ExtensionMenuDisplayDetails = {
  name: "An Exciting Extension",
  description: "This is an exciting extension",
  iconURL: "nonStopThrills.png"
};

const BaseClass = extension(details, "ui");

export default class Example extends BaseClass {
  init(env: Environment): void { }

  @block({
    type: "command",
    text: (name, age) => `What's your ${name} and ${age}?`,
    args: [{ type: "string", defaultValue: "name" }, "number"]
  })
  someMethodToBlockify(name: string, age: number) {
    this.openUI("someComponent");
  }
}