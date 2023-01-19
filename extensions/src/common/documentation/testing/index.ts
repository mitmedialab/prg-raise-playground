// Snippet START
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
// Snippet END

import { DefaultDisplayDetails } from "$testing/defaults";

const defineBlocksElsewhere = (): BlockDefinitions<ExtensionUnderTest> => ({
  exampleCommand: {
    type: BlockType.Command,
    args: [ArgumentType.Number, ArgumentType.Number],
    text: () => "",
    operation: () => 5,
  },
  exampleReporter: {
    type: BlockType.Reporter,
    text: () => "",
    arg: ArgumentType.String,
    operation: () => "",
  },
  exampleButtonThatOpensUI: (ext) => ({
    type: BlockType.Button,
    text: "",
    operation: () => { ext.openUI("Anything") }
  })
})