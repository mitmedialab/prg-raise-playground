import { legacySupportWithInfoArgument } from "$common/extension/mixins/optional/legacySupport";
import { ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuItems, BlockOperation, Argument, ExtensionMenuMetadata, ExtensionDynamicMenu, Menu, DynamicMenuThatAcceptsReporters, BaseGenericExtension, VerboseArgument, DefineBlock, AbstractConstructor, NonAbstractConstructor, BlockMetadata } from "$common/types";
import { isFunction, isString } from "$common/utils";
import { block } from "../blocks";
import { ArgumentMethods, BlockDecorators, BlockDefinitions, BlockEntry, BlockMap, LegacyExtension, LegacyExtensionDecorator, LegacySupport, ObjectOrGetter } from "./types";
import { ExtensionInstance } from "$common/extension";

/**
 * 
 * @param info 
 * @param flags 
 * @returns 
 */
export const legacy = <
  const TInfo extends ExtensionMetadata,
  TFlags extends { incrementalDevelopment: boolean } = undefined,
  const TStrict extends boolean = TFlags extends { incrementalDevelopment: false } | undefined ? true : false
>(info: TInfo, flags?: TFlags): LegacySupport<TInfo, TStrict> => ({

  for<TExtension extends LegacyExtension<TInfo, TStrict>>() {

    const legacyExtension = (): LegacyExtensionDecorator<TExtension> => (value, context) => {
      abstract class LegacySupport extends legacySupportWithInfoArgument(value as AbstractConstructor<ExtensionInstance>, info) {
        readonly originalClassName = context.name;
      };

      return LegacySupport as AbstractConstructor<ExtensionInstance> as NonAbstractConstructor<TExtension>;
    };

    const blockMethodBroker = getBlockMetaData(info).map(([opcode, entry]) => {
      const key = opcode as keyof BlockDefinitions<TInfo, TExtension>;
      return {
        key,
        definer: createBlockDefiner<TExtension & BaseGenericExtension>(entry),
        decorator: createBlockDecorator<TExtension & ExtensionInstance>(entry)
      }
    });

    const legacyDefinition = blockMethodBroker.reduce((definitions, { key, definer }) => {
      definitions[key] = definer as any; // TODO: See if we can get this type to work
      return definitions;
    }, {} as BlockDefinitions<TInfo, TExtension>);


    const legacyBlock = blockMethodBroker.reduce((decorators, { key, decorator }) => {
      decorators[key] = decorator as any; // TODO: See if we can get this type to work
      return decorators;
    }, {} as BlockDecorators<TInfo>);

    const throwTypeOnlyError = () => {
      throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.")
    };

    return {
      legacyExtension, legacyDefinition, legacyBlock,
      ReservedNames: {
        get Menus(): any { return throwTypeOnlyError() },
        get Blocks(): any { return throwTypeOnlyError() },
        get ArgumentNamesByBlock(): any { return throwTypeOnlyError() },
      },
    };
  }
})

/**
 * Creates a function that returns a function that acts as a block definition for the 'entry' block metadata.
 * @param entry 
 * @returns 
 */
const createBlockDefiner = <TExtension extends ExtensionInstance & BaseGenericExtension>(entry: BlockEntry) =>
  (objOrGetter: ObjectOrGetter<{ opertation: BlockOperation } & Partial<ArgumentMethods<any, any>>, TExtension>) =>
    ((extension: TExtension) => {
      const { operation, argumentMethods } = isFunction(objOrGetter) ? objOrGetter.call(extension, extension) : objOrGetter;
      if (argumentMethods) attachArgumentMethods(entry, argumentMethods, extension);
      return { ...entry, operation }
    }) as DefineBlock<TExtension, BlockOperation>;

/**
 * Creates a function that returns a decorator function that wraps the data contained within 'entry'.
 * @param entry 
 * @returns 
 */
const createBlockDecorator = <TExtension extends ExtensionInstance>(entry: BlockEntry) =>
  (...params: ([ObjectOrGetter<ArgumentMethods<any, any>, TExtension>] | [])) => {
    if (params.length === 0 || !params[0]) return block<TExtension, any[], any, any>(entry as BlockMetadata<any>);
    const objOrGetter = params[0];
    return block<TExtension, any[], any, any>((extension: TExtension) => {
      const { argumentMethods } = isFunction(objOrGetter)
        ? objOrGetter.call(extension, extension) : objOrGetter;

      attachArgumentMethods(entry, argumentMethods, extension);
      return entry as BlockMetadata<any>;
    });
  }

const attachArgumentMethods = (
  block: ReturnType<BlockMap["get"]>,
  argumentMethods: Record<number, Partial<DynamicMenuThatAcceptsReporters<unknown>>>,
  extension: ExtensionInstance
) => {
  const args = block.args ? block.args : block.arg ? [block.arg] : [];

  Object.entries(argumentMethods)
    .map(([indexKey, { handler, getItems }]) => {
      const arg = args[parseInt(indexKey)] as VerboseArgument<any>;
      return { arg, methods: { handler, getItems } }
    })
    .forEach(({ arg, methods }) =>
      Object.entries(methods)
        .filter(([_, method]) => method)
        .map(([key, method]) => [key, method.bind(extension)])
        .forEach(([key, method]) => tryUpdateKey(arg.options, key, method)));
}

const tryUpdateKey = <T>(obj, key: string, value: T) => {
  obj[key] = value;
}

const asBlockMetaData = (block: ExtensionBlockMetadata | string) => {
  if (isString(block)) throw new Error(`Block defined as string, unexpected! ${block}`)
  return block as ExtensionBlockMetadata;
}

const convertAndInsertBlock = (map: BlockMap, block: ExtensionBlockMetadata, metadata: ExtensionMetadata) => {
  const { opcode, arguments: _arguments, blockType: type } = block;
  const { text, orderedNames } = parseText(block);

  if (!_arguments) return map.set(opcode, { type, text });

  const args = Object.entries(_arguments ?? {})
    .map(([name, { menu, ...rest }]) => ({ options: extractMenuOptions(metadata, menu), name, menu, ...rest }))
    .sort(({ name: a }, { name: b }) => orderedNames.indexOf(a) < orderedNames.indexOf(b) ? -1 : 1)
    .map(({ name, ...details }) => details satisfies Argument<any> as Argument<unknown>);

  const { length } = args;
  return length >= 2
    ? map.set(opcode, { type, text, args: args as [] })
    : map.set(opcode, { type, text, arg: args[0] })
}

const getBlockMetaData = (metadata: ExtensionMetadata) => Array.from(
  metadata.blocks
    .map(asBlockMetaData)
    .reduce((map, block) => convertAndInsertBlock(map, block, metadata), new Map() as BlockMap)
    .entries()
);

export const parseText = ({ arguments: _arguments, text }: ExtensionBlockMetadata) => {
  const placeholder = "Error: This should have been overridden by legacy support";

  if (!_arguments) return { orderedNames: null as null, text: placeholder };

  const args = Object.keys(_arguments)
    .map(name => ({ name, template: `[${name}]` }))
    .sort(({ template: a }, { template: b }) => text.indexOf(a) < text.indexOf(b) ? -1 : 1);

  return args.length === 0
    ? { orderedNames: null as null, text: placeholder }
    : { orderedNames: args.map(({ name }) => name), text: () => placeholder }
}

const getItemsPlaceholder = { getItems: () => ("Error: This should have been filled in." as any) };
const handlerPlaceholder = { handler: () => ("Error: This should have been filled in." as any) };

export const isDynamicMenu = (menu: ExtensionMenuMetadata | ExtensionMenuItems["items"]): menu is ExtensionDynamicMenu => isString(menu);

const extractMenuOptions = (data: ExtensionMetadata, menuName: string): Menu<any> => {
  const menu = menuName ? data.menus[menuName] : undefined;

  if (!menu) return undefined;
  if (isDynamicMenu(menu)) return getItemsPlaceholder.getItems;

  const { items, acceptReporters: acceptsReporters } = menu;

  if (!isDynamicMenu(items)) return acceptsReporters ? { acceptsReporters, items: [...items], ...handlerPlaceholder } : [...items];

  return acceptsReporters ? { acceptsReporters, ...handlerPlaceholder, ...getItemsPlaceholder } : getItemsPlaceholder.getItems;
}