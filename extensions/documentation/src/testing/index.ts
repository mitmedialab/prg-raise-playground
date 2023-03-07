import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "../../";

export const defineExtension = codeSnippet();

import { block, buttonBlock, extension, Environment } from "$common";

const name = "Test";

export default class ExtensionUnderTest extends extension({ name }, "ui") {

  init(env: Environment): void { }

  @block({
    type: "command",
    args: ["number", "number"],
    text: (x, y) => "placeholder",
  })
  exampleCommand(a: number, b: number) { /* Do something */ }

  @block({
    type: "reporter",
    text: (x) => "placeholder",
    arg: "string",
  })
  exampleReporter(input: string) {
    return "Whatever you expect to be the output, given the input"
  }

  @buttonBlock("placeholder")
  exampleButtonThatOpensUI() {
    this.openUI("Test");
  }
}

defineExtension.end;