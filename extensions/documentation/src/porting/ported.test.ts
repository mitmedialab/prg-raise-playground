import { createTestSuite } from "$testing";
import { restore, stub } from "$testing/utils";
import ExtensionConfigurable from "./ported";
import ExtensionGeneric from "./ported.generic";
import { info } from "./legacy";

const getTests = (name: string) => ({
  unitTests: {
    exampleSimpleBlock: {
      name,
      before: ({ testHelper: { expect } }) => stub(console, "log", (message?: any, ...optionalParams: any[]) => {
        expect(message).toBe(info.blocks[0].opcode)
      }),
      after: () => restore(console, "log")
    },
    moreComplexBlockWithArgumentAndDynamicMenu: {
      name,
      input: 55,
      before: ({ testHelper: { expect } }) => stub(console, "log", (message?: any, ...optionalParams: any[]) => {
        expect([message, ...optionalParams].join("")).toBe(info.blocks[0].opcode + 55)
      }),
      after: () => restore(console, "log")
    }
  }
})

createTestSuite({ Extension: ExtensionConfigurable, __dirname }, getTests("configurable"));
createTestSuite({ Extension: ExtensionGeneric, __dirname }, getTests("generic"));
