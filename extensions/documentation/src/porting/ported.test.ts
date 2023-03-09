import { createTestSuite } from "$testing";
import { restore, stub } from "$testing/utils";
import ExtensionDecorated from "./ported";
import ExtensionGeneric from "./ported.generic";
import { info } from "./legacy";

const tests = {
  unitTests: {
    exampleSimpleBlock: {
      before: ({ testHelper: { expect } }) => stub(console, "log", (message?: any, ...optionalParams: any[]) => {
        expect(message).toBe(info.blocks[0].opcode)
      }),
      after: () => restore(console, "log")
    },
    moreComplexBlockWithArgumentAndDynamicMenu: {
      input: 55,
      before: ({ testHelper: { expect } }) => stub(console, "log", (message?: any, ...optionalParams: any[]) => {
        expect([message, ...optionalParams].join("")).toBe(info.blocks[0].opcode + 55)
      }),
      after: () => restore(console, "log")
    }
  }
}

createTestSuite({ Extension: ExtensionDecorated, __dirname }, tests);
createTestSuite({ Extension: ExtensionGeneric, __dirname }, tests);
