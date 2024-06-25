import { codeSnippet, notRelevantToExample } from "documentation";

const name = "";

export const x = codeSnippet();

import { extension, scratch } from "$common";

export default class ExampleExtension extends extension({ name }, "ui") {
  init = notRelevantToExample;

  @(scratch.button`Button Text Goes Here`)
  buttonBlock() {
    this.openUI("SvelteFileName", "Title of Window");
  }

}

x.end;