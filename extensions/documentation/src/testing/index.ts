import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "../../";

export const defineExtension = codeSnippet();

import { Extension } from "$common/Extension";
import { Environment, ButtonBlock, ArgumentType, BlockType, BlockDefinitions } from "$common";

export default class ExtensionUnderTest extends Extension<DefaultDisplayDetails, {
  exampleReporter: (input: string) => string;
  exampleCommand: (a: number, b: number) => void;
  exampleButtonThatOpensUI: ButtonBlock
}> {

  init(env: Environment): void { }

  defineBlocks(): ExtensionUnderTest["BlockDefinitions"] {
    return defineBlocksElsewhere(); // You can ignore this!
  }
}

defineExtension.end;

export const defineBlocks = codeSnippet();

const defineBlocksElsewhere = (): BlockDefinitions<ExtensionUnderTest> => ({
  exampleCommand: {
    type: BlockType.Command,
    args: [ArgumentType.Number, ArgumentType.Number],
    text: () => "",
    operation: () => { },
  },
  exampleReporter: {
    type: BlockType.Reporter,
    text: () => "",
    arg: ArgumentType.String,
    // This is the same dummy value used by the tests
    operation: () => "Whatever you expect to be the output, given the input",
  },
  exampleButtonThatOpensUI: (ext) => ({
    type: BlockType.Button,
    text: "",
    operation: () => { ext.openUI("Test") }
  })
});

defineBlocks.end;