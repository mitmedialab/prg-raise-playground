import MyExtension from ".";
import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { BlockBuilder } from "../../typescript-support/types";

type AddBuilder = BlockBuilder<(left: number, right: number) => number>;

const addBuilder: AddBuilder = (extension: MyExtension) => ({
  type: BlockType.Command,
  operation(left, right) {
    return left + right;
  },
  arguments: [
    { type: ArgumentType.Number, defaultValue: 3, options: extension.options },
    { type: ArgumentType.Angle }
  ],
  text: (left, right) => `Add ${left} to ${right}`,
});

export default addBuilder;