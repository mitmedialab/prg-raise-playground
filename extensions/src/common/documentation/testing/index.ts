import { Extension } from "$common/Extension";
import { Environment, ButtonBlock, ArgumentType, BlockType, BlockDefinitions } from "$common";
import { DefaultDisplayDetails } from "$testing/defaults"; // You can ignore this!

export default class ExtensionUnderTest extends Extension<DefaultDisplayDetails, {
  exampleCommand: (input: number) => void;
  exampleReporter: (input: string) => string;
  exampleButtonThatOpensUI: ButtonBlock
}> {

  init(env: Environment): void { }

  defineBlocks(): BlockDefinitions<ExtensionUnderTest> {
    return defineBlocksElsewhere(); // You can ignore this!
  }

}

const defineBlocksElsewhere = (): BlockDefinitions<ExtensionUnderTest> => ({
  exampleCommand: {
    type: BlockType.Command,
    arg: ArgumentType.Number,
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