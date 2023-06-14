import { Environment, extension, ExtensionMenuDisplayDetails, block } from "$common";

const details: ExtensionMenuDisplayDetails = { name: "" };

export default class _ extends extension(details) {
  init(env: Environment): void { }
}