import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet, notRelevantToExample } from "documentation";

const seeBlow = notRelevantToExample;

export const x = codeSnippet();

import { Extension } from "$common";

type MyCustomArgument = { a: number, b: string, c: boolean };

type Blocks = {
  blockWithCustomArgument: (arg: MyCustomArgument) => void;
}

export default class ExtensionWithCustomArgument extends Extension<DefaultDisplayDetails, Blocks> {
  init = notRelevantToExample;

  defineBlocks = seeBlow;
}

x.end;

export type { Blocks, MyCustomArgument };