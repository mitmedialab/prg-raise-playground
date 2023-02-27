import { TypedClassDecorator, TypedMethodDecorator } from ".";
import { AbstractConstructor, DecoratedExtension, Extension, ExtensionCommon, NonAbstractConstructor } from "$common/extension/Extension";
import legacySupport from "$common/extension/mixins/legacySupport";
import { ArgumentType, BlockType } from "$common/enums";
import { ExtensionMetadata, ExtensionBlockMetadata, ValueOf, TypeByArgumentType, ExtensionMenuItems, ExtensionMenuDisplayDetails, Block, ReturnTypeByBlockType, BlockOperation, Argument, ExtensionMenuMetadata, ExtensionDynamicMenu, Menu, MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters, BaseExtension } from "$common/types";
import { BlockMetadata } from "$common/extension/Extension";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { isString } from "$common/utils";
import { block } from "./blocks";

type LegacyExtension<TData extends ExtensionMetadata, TStrict extends boolean> = ExtensionCommon
  & (
    (DecoratedExtension & (TStrict extends true ? LegacyProbe.LegacyMethods<TData> : {})) |
    Extension<ExtensionMenuDisplayDetails, (TStrict extends true ? LegacyProbe.LegacyMethods<TData> : {})> & { [k in LegacyProbe.Opcodes<TData>]?: void }
  )
  & { [k in LegacyProbe.ReservedMenuNames<TData>]?: void };

type LegacyExtensionDecorator<TExtension extends LegacyExtension<ExtensionMetadata, boolean>> = TypedClassDecorator<TExtension, ConstructorParameters<typeof ExtensionCommon>>;

type ArgumentMethods<TData extends ExtensionMetadata, K extends keyof LegacyProbe.LegacyMethods<TData>> = {
  /**
   * An object containing the required methods for each argument of a legacy block. 
   * A method will be required for an argument of a legacy block if:
   * - It accepts reporters (which will require implementing a `handler` function)
   * - it uses a dynamic menu (which will require implementing a `getItems` function)
   * 
   * The keys of this object refer to the argument index of the arguments that require methods.
   * In other words, if the first argument (aka index 0) of a legacy block accepts reporters and thus requires a `handler` method, 
   * then this object will look like the following:
   * ```ts
   * argumentMethods: {
   *    0: { handler: (x: any) => {...} }
   * }
   * ```
   */
  argumentMethods: TsMagic.TupleToObject<LegacyProbe.OpArgMenus<TData, K>, "argumentIndex", "reservedDynamicMenuName">
}

type BlockDefinitions<TInfo extends ExtensionMetadata, TExtension extends ExtensionCommon> = {
  [k in keyof LegacyProbe.LegacyMethods<TInfo>]: <TReturn extends LegacyProbe.OpReturn<TInfo, k>>(inputs: {
    operation: (this: TExtension, ...args: [...Parameters<LegacyProbe.LegacyMethods<TInfo>[k]>, BlockUtility]) => TReturn,
  } & ArgumentMethods<TInfo, k>
  ) => Block<BaseExtension, (...args: Parameters<LegacyProbe.LegacyMethods<TInfo>[k]>) => TReturn> & { type: LegacyProbe.BlockType<TInfo, k> }
};

type BlockDecorators<TInfo extends ExtensionMetadata> = {
  [k in keyof LegacyProbe.LegacyMethods<TInfo>]:
  <This extends DecoratedExtension, Args extends Parameters<LegacyProbe.LegacyMethods<TInfo>[k]>, Return extends any>(
    ...args: LegacyProbe.OpArgMenus<TInfo, k> extends [] ? [] : [ArgumentMethods<TInfo, k>]
  ) => TypedMethodDecorator<This, Args, Return, (...args: Args) => Return>
}

type LegacySupport<TInfo extends ExtensionMetadata, TStrict extends boolean> = {
  /**
   * The for
   * @returns 
   */
  for: <TExtension extends LegacyExtension<TInfo, TStrict>>() => {
    /**
     * The decorator
     */
    legacyExtension(): TypedClassDecorator<TExtension, ConstructorParameters<typeof ExtensionCommon>>,
    /**
     * 
     */
    legacyDefinition: BlockDefinitions<TInfo, TExtension>,
    /**
     * 
     */
    legacyBlock: BlockDecorators<TInfo>,
    /**
     * 
     */
    ReservedNames: {
      Menus: TsMagic.TuplifyUnion<LegacyProbe.ReservedMenuNames<TInfo>>,
      Blocks: TsMagic.TuplifyUnion<LegacyProbe.Opcodes<TInfo>>
    },
  }
}

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
      abstract class LegacySupport extends legacySupport(value as AbstractConstructor<ExtensionCommon>, info) {
        readonly originalClassName = context.name;
      };

      return LegacySupport as AbstractConstructor<ExtensionCommon> as NonAbstractConstructor<TExtension>
    };

    const blockMetaData = getBlockMetaData(info);

    const legacyDefinition = blockMetaData.reduce((acc, [opcode, block]) => {
      const key = opcode as keyof BlockDefinitions<TInfo, TExtension>;

      acc[key] = ({ operation, argumentMethods }) => {
        if (argumentMethods) attachArgumentMethods(block, argumentMethods);
        return { ...block, operation } as any;
      };

      return acc;
    }, {} as BlockDefinitions<TInfo, TExtension>);

    const legacyBlock = blockMetaData.reduce((acc, [opcode, metadata]) => {
      const key = opcode as keyof BlockDefinitions<TInfo, TExtension>;

      acc[key] = (({ argumentMethods }) => {
        if (argumentMethods) attachArgumentMethods(metadata, argumentMethods);
        return block(metadata as any);
      }) as any;

      return acc;
    }, {} as BlockDecorators<TInfo>);

    return {
      legacyExtension, legacyDefinition, legacyBlock,
      ReservedNames: {
        get Menus(): any { throw new Error("This property is not meant to be accessed, and is instead solely for documentation purposes.") },
        get Blocks(): any { throw new Error("This property is not meant to be accessed, and is instead solely for documentation purposes.") }
      }
    };
  }
})

const attachArgumentMethods = (
  block: ReturnType<BlockMap["get"]>,
  argumentMethods: Record<number, Partial<DynamicMenuThatAcceptsReporters<unknown>>>
) => {
  const args = block.args ? block.args : block.arg ? [block.arg] : [];

  Object.entries(argumentMethods).forEach(([indexKey, { handler, getItems }]) => {
    const arg = args[parseInt(indexKey)];
    tryUpdateKey(arg, "handler", handler);
    tryUpdateKey(arg, "getItems", getItems);
  });
}

const tryUpdateKey = <T>(obj, key: string, value: T) => {
  // more checks?
  obj[key] = value;
}

const asBlockMetaData = (block: ExtensionBlockMetadata | string) => {
  if (isString(block)) throw new Error(`Block defined as string, unexpected! ${block}`)
  return block as ExtensionBlockMetadata;
}

type BlockMap = Map<string, BlockMetadata<BlockOperation>>;

const convertAndInsertBlock = (map: BlockMap, block: ExtensionBlockMetadata, metadata: ExtensionMetadata) => {
  const { opcode, arguments: _arguments, blockType: type } = block;
  const { text, orderedNames } = parseText(block);

  const args = Object.entries(_arguments)
    .map(([name, { menu, ...rest }]) => ({ options: extractMenuOptions(metadata, menu), name, menu, ...rest }))
    .sort(({ name: a }, { name: b }) => orderedNames.indexOf(a) < orderedNames.indexOf(b) ? -1 : 1)
    .map(({ name, ...details }) => details satisfies Argument<any> as Argument<unknown>);

  const { length } = args;
  const argsEntry = length >= 2 ? { args: args as [Argument<unknown>] } : length === 1 ? { arg: args[0] } : {};

  return map.set(opcode, { type, text, ...argsEntry });
}

const getBlockMetaData = (metadata: ExtensionMetadata) => Array.from(
  metadata.blocks
    .map(asBlockMetaData)
    .reduce((map, block) => convertAndInsertBlock(map, block, metadata), new Map() as BlockMap)
    .entries()
);

export const parseText = ({ arguments: _arguments, text }: ExtensionBlockMetadata) => {
  const args = Object.keys(_arguments)
    .map(name => ({ name, template: `[${name}]` }))
    .sort(({ template: a }, { template: b }) => text.indexOf(a) < text.indexOf(b) ? -1 : 1);

  const placeholder = "Error: This should have been overridden by legacy support";

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

/**
 * Types to assist in extracting information from the return type of the old 'getInfo' method
 */
export namespace LegacyProbe {
  export type Blocks = ExtensionMetadata["blocks"];
  export type Block = ExtensionMetadata["blocks"];

  export type Arguments<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
    [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['arguments'] : never;
  };

  export type Types<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
    [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['blockType'] : never;
  }

  export type Opcodes<T extends ExtensionMetadata> = { [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never }[number];

  export type OpArgs<T extends ExtensionMetadata, K extends Opcodes<T>> = ArgsArray<TsMagic.ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>>;
  export type OpArgMenus<T extends ExtensionMetadata, K extends Opcodes<T>> = ArgsToMenusArray<TsMagic.ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>, T>;

  export type BlockType<T extends ExtensionMetadata, K extends Opcodes<T>> = Types<T["blocks"], K>[keyof Types<T["blocks"], K>] extends ValueOf<typeof BlockType> ? Types<T["blocks"], K>[keyof Types<T["blocks"], K>] : never;
  export type OpReturn<T extends ExtensionMetadata, K extends Opcodes<T>, TBlockType extends BlockType<T, K> = BlockType<T, K>> = ReturnTypeByBlockType<TBlockType>;

  export type ReservedMenuNames<T extends ExtensionMetadata> = ValueOf<{
    [Op in Opcodes<T>]: ValueOf<{
      [Arg in OpArgMenus<T, Op>[number]as Arg["argumentIndex"]]: Arg extends { reservedDynamicMenuName: infer Name extends string } ? Name : never;
    }>
  }> & string;

  type ArgsArray<T extends unknown[]> = T extends [] ? [] :
    T extends [infer H, ...infer R]
    ? H extends { type: infer X extends ValueOf<typeof ArgumentType> }
    ? [TypeByArgumentType<X>, ...ArgsArray<R>]
    : ArgsArray<R>
    : T

  type ConditionalHandler<AcceptsReporters extends boolean, ArgumentType extends ValueOf<typeof ArgumentType>> = AcceptsReporters extends true
    ? { handler: MenuThatAcceptsReporters<TypeByArgumentType<ArgumentType>>["handler"] }
    : {};

  /**
   * Fields of elements in returned tuple:
   * - argumentIndex: an index value (number) that corresponds to the index of Item within T (see below)
   * - reservedDynamicMenuName: the name of a dynamic menu method
   * - getItems: a function that returns menu items (i.e. a dynamic menu)
   * - handler: an function used to validate the inputs of fields that accept reporters
   */
  type ArgsToMenusArray<T extends unknown[], TData extends ExtensionMetadata> = T extends []
    ? []
    // If T is a Variadic Tuple Type, extract the types of the elements before the final element (Rest) and type of final element (Item)
    : T extends [...infer Rest, infer Item]
    // If the final item matches the shape of an argument, extract the types of the menu field (MenuName) and it's argument type (Type)
    ? Item extends { menu: infer MenuName extends keyof TData["menus"], type: infer Type extends ValueOf<typeof ArgumentType> }
    // If the menu (accessed by indexing the 'menus' object with MenuName) is a string value, the menu must be dynamic
    ? TData["menus"][MenuName] extends string
    // Return a tuple where the last element is Item mapped to an object with 'argumentIndex' and 'getOptions' + 'reservedDynamicMenuName' fields (described above)
    ? [
      ...ArgsToMenusArray<Rest, TData>,
      { reservedDynamicMenuName: MenuName, getItems: DynamicMenuThatAcceptsReporters<TypeByArgumentType<Type>>["getItems"], } &
      { argumentIndex: Rest["length"] }
    ]
    // If the menu matches the shape of a verbose menu (i.e. defines 'acceptReporters') extract the value of 'acceptReporters'
    : TData["menus"][MenuName] extends { acceptReporters: infer Accepts extends boolean }
    // If the verbose menu's 'items' field is a string value, it must be a dynamic menu
    ? TData["menus"][MenuName] extends { items: infer DynamicMenuName extends string }
    // Return a tuple where the last element Item is mapped to an object with 'argumentIndex' 'getOptions' + 'reservedDynamicMenuName', and potentially 'handler' fields (described above)
    ? [
      ...ArgsToMenusArray<Rest, TData>,
      { reservedDynamicMenuName: DynamicMenuName, getItems: DynamicMenuThatAcceptsReporters<TypeByArgumentType<Type>>["getItems"], } &
      ConditionalHandler<Accepts, Type> &
      { argumentIndex: Rest["length"] }
    ]
    // If the menu does accept reporters (and by this point, we know the menu is NOT dynamic)
    : Accepts extends true
    // Return a tuple where the last element is Item mapped to an object with 'argumentIndex' and 'handler' fields (described above)
    ? [...ArgsToMenusArray<Rest, TData>, ConditionalHandler<Accepts, Type> & { argumentIndex: Rest["length"] }]
    // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
    : ArgsToMenusArray<Rest, TData>
    // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
    : ArgsToMenusArray<Rest, TData>
    // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
    : ArgsToMenusArray<Rest, TData>
    // <Base case> (reached when T doesn't match a Variadic Tuple Type)
    : T;

  export type LegacyMethods<T extends ExtensionMetadata> = { [k in Opcodes<T>]: (...args: OpArgs<T, k>) => OpReturn<T, k> };

  export type Menus = ExtensionMetadata["menus"];
  export type Items = ExtensionMenuItems["items"];
}

/**
 * As is made very clear in the stack overflow from which this code is taken, 
 * THIS IS AN ABUSE OF TYPESCRIPT:
 * https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type/55128956#55128956
 * https://stackoverflow.com/questions/52855145/typescript-object-type-to-array-type-tuple
 */
namespace TsMagic {
  export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
  type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

  export type Push<T extends any[], V> = [...T, V];

  export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

  export type ObjValueTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> =
    KS extends [infer K, ...infer KT]
    ? ObjValueTuple<T, KT, [...R, T[K & keyof T]]>
    : R;

  export type TupleToObject<T extends any[], TKey extends string | number | symbol, TExclude extends string = undefined> = {
    [K in T[number]as K[TKey]]: TExclude extends undefined ? Omit<K, TKey> : Omit<K, TKey | TExclude>;
  }
}
