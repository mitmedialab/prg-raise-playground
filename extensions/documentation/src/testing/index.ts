import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "../../";

export const defineExtension = codeSnippet();

import { extension, Environment, scratch } from "$common";

const name = "Extension Under Test";

export default class ExtensionUnderTest extends extension({ name }, "ui") {

  init(env: Environment): void { }

  @(scratch.command`placeholder: ${"number"} and ${"number"}`)
  exampleCommand(a: number, b: number) { /* Do something */ }

  @(scratch.reporter`placeholder: ${"string"}`)
  exampleReporter(input: string) {
    return "Whatever you expect to be the output, given the input"
  }

  @(scratch.button`placeholder`)
  exampleButtonThatOpensUI() {
    this.openUI("Test");
  }
}

defineExtension.end;