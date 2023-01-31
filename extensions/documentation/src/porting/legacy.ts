import { ArgumentType, BlockDefinitions, BlockType, Environment, Extension, extractLegacySupportFromOldGetInfo } from "$common";
import { createTestSuite } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

const legacy = extractLegacySupportFromOldGetInfo({
  blocks: [
    {
      opcode: "exampleBlock",
      blockType: "command",
      text: "Dummy text [ARG_1] [ARG_2] [ARG_3] [ARG_4] [ARG_5]",
      arguments: {
        ARG_1: {
          type: "string",
          menu: "Menu 1"
        },
        ARG_2: {
          type: "number",
          menu: "Menu 2"
        },
        ARG_3: {
          type: "string",
          menu: "Menu 3"
        },
        ARG_4: {
          type: "number",
          menu: "Menu 4"
        },
        ARG_5: {
          type: "angle",
        },
        ARG_6: {
          type: "angle",
        }
      }
    }
  ],
  menus: {
    "Menu 1": {
      items: ["A", "B", "C"],
      acceptReporters: false,
    },
    "Menu 2": {
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }, { text: "2", value: 2 }],
      acceptReporters: true
    },
    // Will not be checked -- this can be useful if the original menu was dynamic and you can't extract the values  
    "Menu 3": undefined,
    // "Menu 4" is left out, so it will also not be checked
  }
} as const);


// Define
type Block = (arg1: string, arg2: number, arg3: string, arg4: number, arg5: number, arg6: number) => void;

export default class ExampleExtension extends Extension<DefaultDisplayDetails, {
  // The new block based on the old 'exampleBlock'. NOTE: You should never name arguments like this
  newBlock: Block
}> {
  init(env: Environment): void { }

  defineBlocks(): BlockDefinitions<ExampleExtension> {
    return {
      newBlock: legacy.exampleBlock({
        type: "command",
        args: [

          { type: ArgumentType.String, options: ["A", "B", "D"] },


          { type: ArgumentType.Number, options: [0, 1, 2] },


          { type: ArgumentType.String, options: ["A", "B", "D"] },


          { type: ArgumentType.Number, options: [0, 1, 2] },
          { type: ArgumentType.Angle },
          { type: ArgumentType.Angle, options: [3, 5] }
        ],
        text: (a, b, c, d, e, f) => `New dummy text ${a} ${b} ${c} ${d} ${e} ${f}`,
        operation: (a, b, c, d, e, f) => {
          // do something
        }
      })
    }
  }
}