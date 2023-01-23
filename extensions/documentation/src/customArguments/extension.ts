import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet, notRelevantToExample } from "documentation";

const seeBlow = notRelevantToExample;

export const x = codeSnippet();

import { Extension } from "$common";

type Blocks = {
  blockWithCustomArgument: (arg: { a: number, b: string, c: boolean }) => void;
}

export default class ExtensionWithCustomArgument extends Extension<DefaultDisplayDetails, Blocks> {
  init = notRelevantToExample;

  defineBlocks = seeBlow;
}

x.end;