import { Argument, ArgumentType, BlockMetadata, BlockOperation, ExtensionArgumentMetadata, Menu, MultipleArgsBlock, OneArgBlock, ValidKey, ValueOf, VerboseArgument } from "$common/types";
import { assertSameLength, isPrimitive, isString } from "$common/utils";
import { extractHandlers } from "./handlers";
import { setMenu } from "./menus";
import { format } from "./util";

export const getArgName = (index: number) => `${index}`;

const getArgumentType = <T>(arg: Argument<T>): ValueOf<typeof ArgumentType> =>
  isPrimitive(arg) ? arg as ValueOf<typeof ArgumentType> : (arg as VerboseArgument<T>).type;

/**
 * Extract an array of args tied to a block 
 * @param block 
 * @returns An array of 0, 1, or 2+ args
 */
export const extractArgs = (block: BlockMetadata<BlockOperation>) => {
  const argKey: ValidKey<OneArgBlock> = "arg";
  const argsKey: ValidKey<MultipleArgsBlock> = "args";
  if (argKey in block && block[argKey]) return [(block as OneArgBlock).arg];
  if (argsKey in block && (block[argsKey]?.length ?? 0) > 0) return (block as MultipleArgsBlock).args;
  return [];
}

/**
 * Combine arguments' type, name, and handler information into a single structure
 * @param args 
 * @param names 
 * @returns 
 */
export const zipArgs = (args: Argument<any>[], names?: string[]) => {
  const types = args.map(getArgumentType);
  const handlers = extractHandlers(args);
  names ??= types.map((_, index) => getArgName(index));
  assertSameLength(types, handlers, names);
  return types.map((type, index) => ({ type, name: names[index], handler: handlers[index] }));
}

export const convertToArgumentInfo = (opcode: string, args: Argument<any>[], menus: Menu<any>[]) => {
  if (!args || args.length === 0) return undefined;

  return Object.fromEntries(
    args
      .map((element, index) => {
        const entry = {} as ExtensionArgumentMetadata;
        entry.type = getArgumentType(element);

        if (isPrimitive(element)) return entry;

        const { defaultValue, options } = element as VerboseArgument<any>;

        setDefaultValue(entry, opcode, index, defaultValue);
        setMenu(entry, options, menus);

        return entry;
      })
      .reduce(
        (accumulation, entry, index) => accumulation.set(getArgName(index), entry),
        new Map<string, ExtensionArgumentMetadata>
      )
  );
}

const getArgTranslationID = (blockname: string, index: number) => `${blockname}-arg${index}-default`;

const getDefaultValue = (defaultValue: any, opcode: string, index: number) => isString(defaultValue)
  ? format(defaultValue, getArgTranslationID(opcode, index), `Default value for arg ${index + 1} of ${opcode} block`)
  : defaultValue;

const setDefaultValue = (entry: ExtensionArgumentMetadata, opcode: string, index: number, defaultValue: any,) => {
  if (defaultValue === undefined) return;
  entry.defaultValue = getDefaultValue(defaultValue, opcode, index)
}