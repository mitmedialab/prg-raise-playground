import { ArgumentType, BlockType } from "$common/enums";
import { DecoratedExtension, Extension } from "$common/extension/Extension";
import { block } from "$common/extension/decorators/blocks";
import { extension } from "$common/extension/decorators/extension";
import { LegacyProbe, legacyFactory, } from "$common/extension/decorators/legacy";
import { BaseExtension, Block, BlockDefinitions, Environment, ExtensionBlockMetadata, RGBObject } from "$common/types";
import { createTestSuite, describe, expect, test, testID } from "$testing";
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
  }],
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

const { legacyExtension, legacyDefinition, legacyBlock } = legacyFactory(info);

type y = LegacyProbe.ReservedMenuNames<typeof info>;

type NestedKeyOf<ObjectType extends object> =
  { [Key in keyof ObjectType]: ObjectType[Key] };


@legacyExtension()
class GenericExtension extends Extension<DefaultDisplayDetails, {
  multiArgumentsWithMenus: (args_0: number, args_1: string, args_2: number) => number,
}> {
  defineBlocks(): BlockDefinitions<GenericExtension> {
    return {

      multiArgumentsWithMenus: (x) => legacyDefinition.multiArgumentsWithMenus({
        ExtensionClass: GenericExtension,
        operation: (x, y, z, util) => 5,
        argumentModifiers: {
          1: {
            dynamicOptions: { reservedName: "ee", getter: () => ["#"] },
            handler: (x: any) => `${x}`
          },
          2: { handler: (x: any) => parseInt(`${x}`) ?? 0 }
        }
      })

    }
  }

  init(env: Environment): void { }
}



@extension({
  name: "",
  description: "",
  iconURL: "",
  insetIconURL: ""
})
@legacyExtension()
class ExtensionDecorated extends DecoratedExtension {
  init(env: Environment): void { }

  @legacyBlock.multiArgumentsWithMenus({
    argumentModifiers: {
      1: { dynamicOptions: { reservedName: "ee", getter: () => ["#"] }, handler: (x: any) => `${x}` },
      2: { handler: (x: any) => parseInt(`${x}`) ?? 0 }
    }
  })
  multiArgumentsWithMenus(args_0: number, args_1: string, args_2: number) {
    return "";
  }

}

createTestSuite({ Extension: ExtensionDecorated, __dirname }, {
  unitTests: undefined,
  integrationTests: {
    xx: ({ extension }) => {
      console.log(JSON.stringify(extension.getInfo(), undefined, 3));
    }
  }
})