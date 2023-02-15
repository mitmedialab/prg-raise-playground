import { Extension } from "$common/extension/Extension";
import { BlockType } from "$common/enums";
import { BlockDefinitions, Block } from "$common/types";
import { createTestSuite } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

type BlockFunctionUnderTest = () => string;

type Blocks = { a: BlockFunctionUnderTest, b: BlockFunctionUnderTest }

const returnValue = "test";

const definition: Block<TestExtension, BlockFunctionUnderTest> = {
  text: "dummy text",
  operation: () => returnValue,
  type: BlockType.Reporter
}

class TestExtension extends Extension<DefaultDisplayDetails, Blocks> {
  init() { }

  defineBlocks(): BlockDefinitions<TestExtension> {
    return {
      a: () => definition,
      b: definition
    }
  }
}

createTestSuite({ Extension: TestExtension, __dirname }, {
  unitTests: {
    a: {
      expected: returnValue,
    },
    b: {
      expected: returnValue
    }
  },
  integrationTests: {
    confirmInfoMatches: ({ blockRunner, testHelper }) => {
      const { opcode: opcodeA, ...a } = blockRunner.getBlockMetaDataByKey("a");
      const { opcode: opcodeB, ...b } = blockRunner.getBlockMetaDataByKey("b");
      testHelper.expect(a).toEqual(b);
      testHelper.expect(opcodeA).not.toEqual(opcodeB);
    }
  }
})