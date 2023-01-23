import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "documentation";

export const x = codeSnippet();

import { Extension, ButtonBlock, BlockDefinitions } from "$common";

type Blocks = {
  someButton: ButtonBlock;
}

class ExampleExtension extends Extension<DefaultDisplayDetails, Blocks> {
  init = notImportant
  defineBlocks = seeBelow;
}

x.end;

var notImportant = (): void => { };

var seeBelow = (): BlockDefinitions<ExampleExtension> => {
  return {} as BlockDefinitions<ExampleExtension>;
};

export type BlockTypes = Blocks;