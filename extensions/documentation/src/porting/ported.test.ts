import { createTestSuite } from "$testing";
import { restore, stub } from "$testing/utils";
import Extension from "./ported";
import { info } from "./legacy";

createTestSuite({ Extension, __dirname }, {
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
})