import { BlockMetadata, BlockOperation } from "$common/types";
import { isFunction } from "$common/utils";

export const format = (text: string, identifier: string, description: string): string => {
  return text; // make use of formatMessage in the future
}

export type BlockGetter<This, Fn extends BlockOperation> = (this: This, self: This) => BlockMetadata<Fn>;
export type BlockDefinition<T, Fn extends BlockOperation> = BlockMetadata<Fn> | BlockGetter<T, Fn>;

export const isBlockGetter = <T, Fn extends BlockOperation>(details: BlockDefinition<any, Fn>): details is BlockGetter<T, Fn> => isFunction(details);

export const getButtonID = (id: string, opcode: string) => `${id}_${opcode}`;

export const extractArgNamesFromText = (text: string): string[] => {
  const textAndNumbersInBrackets = /\[([A-Za-z0-9]+)\]/gm;
  const argNames: string[] = [];
  for (const [_, result] of text.matchAll(textAndNumbersInBrackets)) {
    argNames.push(result);
  }
  return argNames;
}