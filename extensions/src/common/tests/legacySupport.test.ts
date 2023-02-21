import { ArgumentType, BlockType } from "$common/enums";
import { DecoratedExtension, Extension } from "$common/extension/Extension";
import { extension } from "$common/extension/decorators/extension";
import { legacyFactory } from "$common/extension/decorators/legacy";
import { extractLegacySupportFromOldGetInfo } from "$common/portHelper";
import { BaseExtension, Block, BlockDefinitions, Environment, ExtensionBlockMetadata, RGBObject } from "$common/types";
import { describe, expect, test } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

const info = {
  id: "legacyTest",
  blocks: [{
    blockType: BlockType.Reporter,
    opcode: "multiArgumentsWithMenus",
    text: "Dummy",
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
        type: ArgumentType.Color,
        menu: "notDefined"
      },
      ARG_3: {
        type: ArgumentType.Angle,
        menu: "empty"
      },
      ARG_5: {
        type: ArgumentType.Number,
        menu: "missing"
      },
      ARG_6: {
        type: ArgumentType.Number,
        menu: "expressedAsEntries"
      }
    },
  } as const],
  menus: {
    textAndValue: {
      acceptReporters: false,
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }, { text: "2", value: 2 }]
    },
    valueOnly: {
      acceptReporters: false,
      // Must be strings to provide value only
      items: ["0", "1", "2"]
    },
    notDefined: {
      acceptReporters: false,
      items: undefined
    },
    empty: {
      acceptReporters: false,
      items: []
    },
    expressedAsEntries: {
      acceptReporters: false,
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }]
    }
  }
} as const;

const legacy = legacyFactory(info);

@legacy.extension()
class GenericExtension extends Extension<DefaultDisplayDetails, {
  multiArgumentsWithMenus: (args_0: number, args_1: string, args_2: RGBObject, args_3: number, args_4: number, args_5: number) => number
}> {
  defineBlocks(): BlockDefinitions<GenericExtension> {
    return {
      multiArgumentsWithMenus: legacy.blockDefinitions.multiArgumentsWithMenus(GenericExtension, () => {
        return 5
      }),
    }
  }
  init(env: Environment): void {
    throw new Error("Method not implemented.");
  }
}

@legacy.extension()
class ExtensionDecorated extends DecoratedExtension {
  init(env: Environment): void {
    throw new Error("Method not implemented.");
  }

  @legacy.blockDecorators.multiArgumentsWithMenus()
  multiArgumentsWithMenus(args_0: number, args_1: string, args_2: RGBObject, args_3: number, args_4: number, args_5: number) {
    return 5;
  }
}