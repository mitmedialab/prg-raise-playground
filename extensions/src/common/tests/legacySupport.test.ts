import { ArgumentType, BlockType } from "$common/enums";
import { DecoratedExtension, Extension } from "$common/extension/Extension";
import { block } from "$common/extension/decorators/blocks";
import { extension } from "$common/extension/decorators/extension";
import { legacy, } from "$common/extension/decorators/legacy";
import { BlockDefinitions, Environment, } from "$common/types";
import { createTestSuite, testID } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

const info = {
  id: testID,
  blocks: [{
    blockType: BlockType.Reporter,
    opcode: "multiArgumentsWithMenus",
    text: "Dummy [ARG_0] and [ARG_1] also [ARG_2]",
    arguments: {
      ARG_0: {
        type: ArgumentType.Number,
        menu: "textAndValue"
      },
      ARG_1: {
        type: ArgumentType.String,
        menu: "valueOnly"
      },
      ARG_2: {
        type: ArgumentType.Number,
        menu: "expressedAsEntries"
      }
    },
  },
  ],
  menus: {
    dynamicExample: "someFunction",
    textAndValue: {
      acceptReporters: false,
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }, { text: "2", value: 2 }]
    },
    valueOnly: {
      acceptReporters: true,
      // Must be strings to provide value only
      items: "ee"
    },
    expressedAsEntries: {
      acceptReporters: true,
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }]
    }
  }
} as const;

const { legacyExtension, legacyDefinition, ReservedNames } = legacy(info).for<GenericExtension>();

@legacyExtension()
class GenericExtension extends Extension<DefaultDisplayDetails, {
  multiArgumentsWithMenus: (args_0: number, args_1: string, args_2: number) => string,
}> {

  toHandle: any = [];

  defineBlocks(): BlockDefinitions<GenericExtension> {
    return {

      multiArgumentsWithMenus: legacyDefinition.multiArgumentsWithMenus((self) => ({
        argumentMethods: {
          1: { getItems: () => ["#"], handler: self.handle },
          2: {
            handler: (x: any) => {
              self.toHandle.push(x);
              return parseInt(`${x}`) ?? 0;
            }
          }
        },
        operation: (x, y, z, util) => "Hi" + x + y + z,
      }))

    }
  }

  handle(x: unknown) {
    this.toHandle.push(x);
    return `${x}`;
  }

  init(env: Environment): void { }
}


const { legacyExtension: legacyDecorated, legacyBlock } = legacy(info).for<ExtensionDecorated>();

@extension({
  name: "",
  description: "",
  iconURL: "",
  insetIconURL: ""
})
@legacyDecorated()
class ExtensionDecorated extends DecoratedExtension {
  init(env: Environment): void { }

  toHandle: any = [];

  handle(x: unknown) {
    this.toHandle.push(x);
    return `${x}`;
  }

  @legacyBlock.multiArgumentsWithMenus((self) => ({
    argumentMethods: {
      1: { getItems: () => ["#"], handler: self.handle },
      2: {
        handler: (x) => {
          self.toHandle.push(x);
          return parseInt(`${x}`) ?? 0;
        }
      }
    }
  }))
  multiArgumentsWithMenus(args_0: number, args_1: string, args_2: number) {
    return "Hi" + args_0 + args_1 + args_2;
  }
}

createTestSuite({ Extension: GenericExtension, __dirname }, {
  unitTests: {
    multiArgumentsWithMenus: () => {
      const input = [100, "Hooo", 100] as const;
      return {
        input,
        expected: `Hi${input.join("")}`,
        after: (({ extension, testHelper: { expect } }) => {
          expect(extension.toHandle).toContain(input[1]);
          expect(extension.toHandle).toContain(input[2]);
        })
      }
    }
  },
})

createTestSuite({ Extension: ExtensionDecorated, __dirname }, {
  unitTests: {
    multiArgumentsWithMenus: () => {
      const input = [100, "Hooo", 100] as const;
      return {
        input,
        expected: `Hi${input.join("")}`,
        after: (({ extension, testHelper: { expect } }) => {
          expect(extension.toHandle).toContain(input[1]);
          expect(extension.toHandle).toContain(input[2]);
        })
      }
    }
  },
})