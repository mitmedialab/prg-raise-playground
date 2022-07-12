import MyExtension = require(".");
import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { BlockBuilder } from "../../typescript-support/types";

type AddBuilder = BlockBuilder<(left: number, right: number) => number>;

const addBuilder: AddBuilder = (extension: MyExtension) => ({
  type: BlockType.Reporter,
  operation(left, right) {
    const sum = left + right;
    return sum;
  },
  args: [
    { type: ArgumentType.Number, defaultValue: 3, options: extension.options },
    { type: ArgumentType.Number }
  ],
  text: (left, right) => `Add ${left} to ${right}`,
});

export default addBuilder;