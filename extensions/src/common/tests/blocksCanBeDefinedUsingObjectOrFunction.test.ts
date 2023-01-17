import { Extension } from "$common/Extension";
import { BlockType } from "$common/enums";
import { BlockDefinitions, Block } from "$common/types";
import { createTestSuite } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

type BlockUnderTest = () => string;

type Blocks = { a: BlockUnderTest, b: BlockUnderTest }

const returnValue = "test";

const implementation: Block<TestExtension, BlockUnderTest> = {
  text: "Hi",
  operation: () => returnValue,
  type: BlockType.Reporter
}

class TestExtension extends Extension<DefaultDisplayDetails, Blocks> {
  init() { }

  defineBlocks(): BlockDefinitions<TestExtension> {
    return {
      a: () => implementation,
      b: implementation
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
    confirmInfoMatches: ({ blockrunner, testHelper }) => {
      const { opcode: opcodeA, ...a } = blockrunner.getBlockMetaDataByKey("a");
      const { opcode: opcodeB, ...b } = blockrunner.getBlockMetaDataByKey("b");
      testHelper.expect(a).toEqual(b);
      testHelper.expect(opcodeA).not.toEqual(opcodeB);
    }
  }
})