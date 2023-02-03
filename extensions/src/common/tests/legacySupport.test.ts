import { ArgumentType, BlockType } from "$common/enums";
import { extractLegacySupportFromOldGetInfo } from "$common/portHelper";
import { BaseExtension, Block, ExtensionBlockMetadata } from "$common/types";
import { describe, expect, test } from "$testing";

type WithName<T> = T & { name: string };

const toMenuEntry = <T>(arr: T[]) => arr.map(item => ({ text: `${item}`, value: item }));

const nameShouldBeAddedToBlockTest = <T>(newBlock: T, oldBlock: ExtensionBlockMetadata) =>
  test("Name should be be added to block: " + oldBlock.opcode, () => {
    expect((newBlock as WithName<T>).name).toBe(oldBlock.opcode);
  });

type MultiArgBlockFunction = (...args: [any, any, ...any[]]) => void

const nameShouldBeAddedToArgsTest = <T>(newBlock: T, oldBlock: ExtensionBlockMetadata) =>
  test("Name should be be added to block: " + oldBlock.opcode, () => {
    const keys = Object.keys(oldBlock.arguments);
    (newBlock as Block<BaseExtension, MultiArgBlockFunction>).args
      .map(arg => (arg as WithName<typeof arg>).name)
      .forEach((name, index) => expect(name).toBe(keys[index]))
  });

describe("No menus", () => {
  const legacy = extractLegacySupportFromOldGetInfo({
    blocks: [{
      blockType: BlockType.Command,
      opcode: "multiArgumentsNoMenus",
      text: "Dummy",
      arguments: {
        ARG_0: {
          type: ArgumentType.String
        },
        ARG_1: {
          type: ArgumentType.Number
        },
        ARG_2: {
          type: ArgumentType.Color
        },
      }
    }]
  } as const);

  const modernBlockDefinition = legacy.multiArgumentsNoMenus({
    type: BlockType.Command,
    args: [
      { type: ArgumentType.String },
      { type: ArgumentType.Number, options: [1, 2] },
      { type: ArgumentType.Color, defaultValue: { r: 1, g: 1, b: 1 } }
    ]
  });

  nameShouldBeAddedToBlockTest(modernBlockDefinition, legacy.legacyBlocksForTests.multiArgumentsNoMenus);
  nameShouldBeAddedToArgsTest(modernBlockDefinition, legacy.legacyBlocksForTests.multiArgumentsNoMenus);
});

describe("With menus", () => {

  const legacy = extractLegacySupportFromOldGetInfo({
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
  } as const);

  const modernBlockDefinition = legacy.multiArgumentsWithMenus({
    type: BlockType.Reporter,
    args: [
      { type: ArgumentType.Number, options: toMenuEntry([0, 1, 2]) },
      { type: ArgumentType.String, options: ["0", "1", "2"] },
      { type: ArgumentType.Color, options: toMenuEntry([{ r: 1, g: 2, b: 3 }]) },
      { type: ArgumentType.Angle, options: toMenuEntry([0, 1, 2]) },
      { type: ArgumentType.Number, options: [0, 2] },
      { type: ArgumentType.Number, options: [0, 1] }
    ]
  });

  const oldBlock = legacy.legacyBlocksForTests.multiArgumentsWithMenus;
  nameShouldBeAddedToBlockTest(modernBlockDefinition, oldBlock);
  nameShouldBeAddedToArgsTest(modernBlockDefinition, oldBlock);
})

describe("Arguments mismatch", () => {
  const legacy = extractLegacySupportFromOldGetInfo({
    blocks: [
      {
        opcode: "testCase",
        blockType: "command",
        text: "Dummy",
        arguments: {
          ARG_0: {
            type: "string",
            menu: "mismatch"
          }
        }
      }
    ],
    menus: {
      mismatch: {
        items: ["a", "b", "c"],
        acceptReporters: false,
      }
    }
  } as const);

  test("Block definition causes error", () => {
    expect(() => legacy.testCase({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: ["x", "y", "z"]
      }
    })).toThrow();
  });
});

describe("Accepts reporters mismatch", () => {
  const legacyDoesAccept = extractLegacySupportFromOldGetInfo({
    blocks: [
      {
        opcode: "testCase",
        blockType: "command",
        text: "Dummy",
        arguments: {
          ARG_0: {
            type: "string",
            menu: "mismatch"
          }
        }
      }
    ],
    menus: {
      mismatch: {
        items: ["a", "b", "c"],
        acceptReporters: true,
      }
    }
  } as const);

  test("No error does accept", () => {
    expect(() => legacyDoesAccept.testCase({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: ["a", "b", "c"],
          handler: (x) => "x",
        }
      }
    })).not.toThrow();
  });

  test("Error does accept", () => {
    expect(() => legacyDoesAccept.testCase({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: ["a", "b", "c"]
      }
    })).toThrow();
  });

  const legacyDoesNotAccept = extractLegacySupportFromOldGetInfo({
    blocks: [
      {
        opcode: "testCase",
        blockType: "command",
        text: "Dummy",
        arguments: {
          ARG_0: {
            type: "string",
            menu: "mismatch"
          }
        }
      }
    ],
    menus: {
      mismatch: {
        items: ["a", "b", "c"],
        acceptReporters: false,
      }
    }
  } as const);

  test("No error does not accept", () => {
    expect(() => legacyDoesNotAccept.testCase({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: ["a", "b", "c"]
      }
    })).not.toThrow();
  });

  test("Error does accept", () => {
    expect(() => legacyDoesNotAccept.testCase({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: ["a", "b", "c"],
          handler: (x) => "",
        }
      }
    })).toThrow();
  });

});