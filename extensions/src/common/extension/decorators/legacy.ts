import { TypedClassDecorator, TypedMethodDecorator } from ".";
import { AbstractConstructor, DecoratedExtension, Extension, ExtensionCommon, NonAbstractConstructor } from "$common/extension/Extension";
import legacySupport from "$common/extension/mixins/legacySupport";
import { ArgumentType, BlockType } from "$common/enums";
import { ExtensionMetadata, ExtensionBlockMetadata, ValueOf, TypeByArgumentType, ExtensionMenuItems, ExtensionMenuDisplayDetails, ExtensionBlocks, Block, DefineBlock, ReturnTypeByBlockType, BlockOperation, Argument, ExtensionMenuMetadata, ExtensionDynamicMenu, VerboseArgument, Menu, MenuItem } from "$common/types";
import { BlockMetadata } from "$common/extension/Extension";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { identity, isFunction, isString } from "$common/utils";
import { getArgName } from "../mixins/scratchInfo";
import { block } from "./blocks";

type LegacyExtension<TData extends ExtensionMetadata> = ExtensionCommon
  & (
    (DecoratedExtension & LegacyProbe.LegacyMethods<TData>) |
    Extension<ExtensionMenuDisplayDetails, LegacyProbe.LegacyMethods<TData>> & { [k in LegacyProbe.Opcodes<TData>]?: void }
  )
  & { [k in LegacyProbe.ReservedMenuNames<TData>]?: void };

type LegacyExtensionDecorator<TData extends ExtensionMetadata> = ReturnType<typeof legacyFactory<TData>>["legacyExtension"];

type ArgumentModifiers<TData extends ExtensionMetadata, K extends keyof LegacyProbe.LegacyMethods<TData>> = {
  /**
   * The keys of this object refer to the 'argument index'
   */
  argumentModifiers: TsMagic.TupleToObject<LegacyProbe.OpArgMenus<TData, K>, "argumentIndex">
}

type BlockDefinitions<TData extends ExtensionMetadata> = {
  [k in keyof LegacyProbe.LegacyMethods<TData>]:
  <T extends Extension<any, LegacyProbe.LegacyMethods<TData>>, TReturn extends LegacyProbe.OpReturn<TData, k>>(inputs: {
    ExtensionClass: NonAbstractConstructor<T>,
    operation: (this: T, ...args: [...Parameters<LegacyProbe.LegacyMethods<TData>[k]>, BlockUtility]) => TReturn,
  } & ArgumentModifiers<TData, k>
  ) => Block<T, (...args: Parameters<LegacyProbe.LegacyMethods<TData>[k]>) => TReturn> & { type: LegacyProbe.BlockType<TData, k> }
};

type BlockDecorators<TData extends ExtensionMetadata> = {
  [k in keyof LegacyProbe.LegacyMethods<TData>]:
  <This extends DecoratedExtension, Args extends Parameters<LegacyProbe.LegacyMethods<TData>[k]>, Return extends any>(
    ...args: LegacyProbe.OpArgMenus<TData, k> extends [] ? [] : [ArgumentModifiers<TData, k>]
  ) => TypedMethodDecorator<This, Args, Return, (...args: Args) => Return>
}

export const legacyFactory = <TData extends ExtensionMetadata>(details: TData): {
  legacyExtension<T extends LegacyExtension<TData>>(): TypedClassDecorator<T, ConstructorParameters<typeof ExtensionCommon>>
  legacyDefinition: BlockDefinitions<TData>,
  legacyBlock: BlockDecorators<TData>
} => {

  const legacyExtension: LegacyExtensionDecorator<TData> = <T extends LegacyExtension<TData>>() => function (value, context) {
    abstract class LegacySupport extends legacySupport(value as AbstractConstructor<ExtensionCommon>, details) {
      readonly originalClassName = context.name;
    };

    return LegacySupport as AbstractConstructor<DecoratedExtension> as new (...args: ConstructorParameters<typeof ExtensionCommon>) => T;
  };

  const blockMetaData = getBlockMetaData(details);

  const legacyDefinition = blockMetaData.reduce((acc, [opcode, metadata]) => {
    acc[opcode] = (_, operation) => ({ ...metadata, operation });
    return acc;
  }, {} as BlockDefinitions<TData>);

  const legacyBlock = blockMetaData.reduce((acc, [opcode, metadata]) => {
    acc[opcode] = () => block(metadata as Parameters<typeof block>[0]);
    return acc;
  }, {} as BlockDecorators<TData>)

  return { legacyExtension, legacyDefinition, legacyBlock };
}

const getBlockMetaData = (metadata: ExtensionMetadata) => Array.from(
  metadata.blocks
    .map(block => {
      if (isString(block)) throw new Error(`Block defined as string, unexpected! ${block}`)
      return block as ExtensionBlockMetadata;
    })
    .reduce((map, block) => {
      const { opcode, arguments: _arguments, blockType: type } = block;
      const { text, orderedNames } = parseText(block);

      const args = Object.entries(_arguments)
        .map(([name, { type, defaultValue, menu }]) => {
          const options = extractMenuOptions(metadata, menu);
          return { name, defaultValue, type, options } satisfies Argument<any> & { name: string }
        })
        .sort(({ name: a }, { name: b }) => orderedNames.indexOf(a) < orderedNames.indexOf(b) ? -1 : 1)
        .map(({ name, ...details }) => (details satisfies Argument<any>) as Argument<unknown>);

      const { length } = args;
      const argsEntry = length >= 2 ? { args: args as [Argument<unknown>] } : length === 1 ? { arg: args[0] } : {};

      return map.set(opcode, { type, text, ...argsEntry });
    }, new Map<string, BlockMetadata<BlockOperation>>())
    .entries()
);

export const parseText = ({ arguments: _arguments, text }: ExtensionBlockMetadata): {
  orderedNames: string[],
  text: string | ((...args: any[]) => string),
} => {
  const args = Object.keys(_arguments)
    .map(name => ({ name, template: `[${name}]` }))
    .sort(({ template: a }, { template: b }) => text.indexOf(a) < text.indexOf(b) ? -1 : 1);

  const placeholder = "Error: This should have been overridden by legacy support";

  if (args.length === 0) return { orderedNames: undefined, text: placeholder };

  return {
    orderedNames: args.map(({ name }) => name),
    text: () => placeholder
  }
}

const isDynamicMenu = (menu: ExtensionMenuMetadata | ExtensionMenuItems["items"]): menu is ExtensionDynamicMenu => isString(menu);
const extractMenuOptions = (data: ExtensionMetadata, menuName: string): Menu<any> => {
  if (!menuName || !data.menus[menuName]) return undefined;
  const menu = data.menus[menuName];
  if (isDynamicMenu(menu)) throw new Error(`Menu '${menuName}' is dynamic, not supported.`);
  const { items, acceptReporters } = menu;
  if (isDynamicMenu(items)) throw new Error(`Items is dynamic for menu '${menuName}', not supported: `);
  if (!items) throw new Error(`Empty items for menu '${menuName}'!`)
  if (!acceptReporters) return [...items];
  return {
    acceptsReporters: acceptReporters,
    items: [...items],
    handler: identity
  }
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
      [Arg in OpArgMenus<T, Op>[number]as Arg["argumentIndex"]]: Arg extends { dynamicOptions: { reservedName: infer Name extends string } } ? Name : never;
    }>
  }> & string;

  type ArgsArray<T extends unknown[]> = T extends [] ? [] :
    T extends [infer H, ...infer R]
    ? H extends { type: infer X extends ValueOf<typeof ArgumentType> }
    ? [TypeByArgumentType<X>, ...ArgsArray<R>]
    : ArgsArray<R>
    : T

  type DynamicOptions<Name extends string, ArgumentType extends ValueOf<typeof ArgumentType>> = {
    dynamicOptions: {
      reservedName: Name,
      getter: () => MenuItem<TypeByArgumentType<ArgumentType>>[]
    }
  }

  type ConditionalHandler<AcceptsReporters extends boolean, ArgumentType extends ValueOf<typeof ArgumentType>> = AcceptsReporters extends true
    ? { handler: (x: any) => TypeByArgumentType<ArgumentType> }
    : {};

  /**
   * Fields of elements in returned tuple:
   * - argumentIndex: an index value (number) that corresponds to the index of Item within T (see below)
   * - dynamicOptions: an object that describes how a dynamic menu should behave
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
    // Return a tuple where the last element is Item mapped to an object with 'argumentIndex' and 'dynamicOptions' fields (described above)
    ? [...ArgsToMenusArray<Rest, TData>, DynamicOptions<TData["menus"][MenuName], Type> & { argumentIndex: Rest["length"] }]
    // If the menu matches the shape of a verbose menu (i.e. defines 'acceptReporters') extract the value of 'acceptReporters'
    : TData["menus"][MenuName] extends { acceptReporters: infer Accepts extends boolean }
    // If the verbose menu's 'items' field is a string value, it must be a dynamic menu
    ? TData["menus"][MenuName] extends { items: infer DynamicMenuName extends string }
    // Return a tuple where the last element Item is mapped to an object with 'argumentIndex' 'dynamicOptions', and potentially 'handler' fields (described above)
    ? [...ArgsToMenusArray<Rest, TData>, DynamicOptions<DynamicMenuName, Type> & ConditionalHandler<Accepts, Type> & { argumentIndex: Rest["length"] }]
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

  export type TupleToObject<T extends any[], TKey extends string | number | symbol> = {
    [K in T[number]as K[TKey]]: Omit<K, TKey>;
  }
}
