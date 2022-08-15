import MyExtension = require(".");
import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { DefineBlock } from "../../typescript-support/types";

type AddDefinition = DefineBlock<(left: number, right: number) => number>;

const addDefinition: AddDefinition = (extension: MyExtension) => ({
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

export default addDefinition;