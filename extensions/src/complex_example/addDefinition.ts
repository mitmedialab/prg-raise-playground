import TypeScriptFrameworkExample from ".";
import { ArgumentType, BlockType, DefineBlock } from "$common";

type AddDefinition = DefineBlock<(left: number, right: number) => number>;

const addDefinition: AddDefinition = (extension: TypeScriptFrameworkExample) => ({
  type: BlockType.Reporter,
  operation(left, right) {
    const sum = left + right;
    return sum;
  },
  args: [
    { type: ArgumentType.Number, defaultValue: 3, options: extension.lhsOptions },
    { type: ArgumentType.Number }
  ],
  text: (left, right) => `Add ${left} to ${right}`,
});

export default addDefinition;