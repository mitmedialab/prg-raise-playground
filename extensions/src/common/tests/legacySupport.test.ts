import { extension } from "$common/extension";
import { Extension } from "$common/extension/GenericExtension";
import { legacy } from "$common/extension/decorators/legacySupport";
import { BlockDefinitions, Environment, NonAbstractConstructor, ArgumentType, BlockType } from "$common/types";
import { createTestSuite, testID } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

const info = {
  id: testID,
  blocks: [
    {
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

const createArgumentMethods = <T extends GenericExtension | ExtensionCommon>(self: T) => ({
  argumentMethods: {
    1: { getItems: () => ["#"], handler: self.handle },
    2: {
      handler: (x: any) => {
        self.toHandle.push(x);
        return parseInt(`${x}`) ?? 0;
      }
    }
  },
})

@legacyExtension()
class GenericExtension extends Extension<DefaultDisplayDetails, {
  multiArgumentsWithMenus: (args_0: number, args_1: string, args_2: number) => string,
}> {

  toHandle: any = [];

  handle(x: unknown) {
    this.toHandle.push(x);
    return `${x}`;
  }

  defineBlocks(): BlockDefinitions<GenericExtension> {
    return {
      multiArgumentsWithMenus: legacyDefinition.multiArgumentsWithMenus((self) => ({
        ...createArgumentMethods(self),
        operation: (x, y, z, util) => "Hi" + x + y + z,
      }))

    }
  }

  init(env: Environment): void { }
}


const { legacyExtension: legacyDecorated, legacyBlock } = legacy(info).for<ExtensionCommon>();

@legacyDecorated()
class ExtensionCommon extends extension({ name: "" }) {
  init(env: Environment): void { }

  toHandle: any = [];

  handle(x: unknown) {
    this.toHandle.push(x);
    return `${x}`;
  }

  @legacyBlock.multiArgumentsWithMenus(createArgumentMethods<ExtensionCommon>)
  multiArgumentsWithMenus(args_0: number, args_1: string, args_2: number) {
    return "Hi" + args_0 + args_1 + args_2;
  }
}

const makeTestSuite = (Extension: NonAbstractConstructor<GenericExtension | ExtensionCommon>) => {
  createTestSuite({ Extension, __dirname }, {
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
    integrationTests: {
      checkDynamicMenu: ({ extension, testHelper: { expect } }) => {
        const dynamicMenuName = info.menus.valueOnly.items;
        expect(extension[dynamicMenuName]).toBeDefined();
        expect(extension[dynamicMenuName]()).toEqual(["#"]);
      }
    }
  })
}

makeTestSuite(GenericExtension);
makeTestSuite(ExtensionCommon);