import { codeSnippet, notRelevantToExample } from "documentation";

const name = "";

export const x = codeSnippet();

import { block, buttonBlock, extension } from "$common";

export default class ExampleExtension extends extension({ name }, "ui") {
  init = notRelevantToExample;

  @block({
    type: "button",
    text: `Button Text Goes Here`
  })
  verboseButton() {
    this.openUI("SvelteFileName", "Title of Window");
  }

  @buttonBlock(`Button Text Goes Here`)
  shortHandButton() {
    this.openUI("SvelteFileName", "Title of Window");
  }
}

x.end;