import { ArgumentType, BlockType } from "$common/enums";
import { extractLegacySupportFromOldGetInfo } from "$common/portHelper";
import { ExtensionBlockMetadata } from "$common/types";
import { describe, expect, test } from "$testing";

type WithName<T> = T & { name: string };

const case1 = {
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
} as const satisfies ExtensionBlockMetadata;

describe(case1.opcode, () => {
  const legacy = extractLegacySupportFromOldGetInfo({ blocks: [case1] });

  const result = legacy.multiArgumentsNoMenus({
    type: BlockType.Command,
    args: [
      { type: ArgumentType.String },
      { type: ArgumentType.Number, options: [1, 2] },
      { type: ArgumentType.Color, defaultValue: { r: 1, g: 1, b: 1 } }
    ]
  });

  test("Name should be be added to block", () => {
    const { name } = result as WithName<typeof result>;
    expect(name).toBe(case1.opcode);
  });

  test("Name should be be added to args", () => {
    const keys = Object.keys(case1.arguments);
    result.args
      .map(arg => (arg as WithName<typeof arg>).name)
      .forEach((name, index) => expect(name).toBe(keys[index]))
  });
})