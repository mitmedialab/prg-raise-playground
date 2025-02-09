import { extension, type ExtensionMenuDisplayDetails, type Environment, scratch } from "$common";

const details: ExtensionMenuDisplayDetails = {
  name: "An Exciting Extension",
  description: "This is an exciting extension",
  iconURL: "nonStopThrills.png"
};

const BaseClass = extension(details, "ui");

export default class Example extends BaseClass {
  init(env: Environment): void { }

  @(scratch.command`What's your ${{ type: "string", defaultValue: "name" }} and ${"number"}?`)
  someMethodToBlockify(name: string, age: number) {
    this.openUI("someComponent");
  }
}