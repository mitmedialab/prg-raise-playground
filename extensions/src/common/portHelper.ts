import { BaseExtension, Block, ExtensionBlockMetadata, ExtensionMetadata, ExtensionMenuItems, DynamicMenu, DynamicMenuThatAcceptsReporters, MenuItem, MenuThatAcceptsReporters, TypeByArgumentType, ValueOf, VerboseArgument, Argument } from "./types";
import { ArgumentType } from "./enums";
import { isFunction, isPrimitive, isString } from "./utils";

export type SerializedBlockData = Pick<ExtensionMetadata, "blocks" | "menus">;

export const mockFormatMessage = (args: { id: string, default: string, description: string }): string => "";

type Opcodes<T extends SerializedBlockData> = { [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never }[number];

type Arguments<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['arguments'] : never;
};

type Type<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['blockType'] : never;
}

type MappedToBlockDefinition<T extends SerializedBlockData> = { [k in Opcodes<T>]:
  {
    type: Type<T["blocks"], k>[keyof Type<T["blocks"], k>],
  } & (TsMagic.ObjValueTuple<Arguments<T["blocks"], k>[keyof Arguments<T["blocks"], k>]> extends { length: 0 }
    ? {}
    : TsMagic.ObjValueTuple<Arguments<T["blocks"], k>[keyof Arguments<T["blocks"], k>]> extends { length: 1 }
    ? { arg: MapToArgument<TsMagic.ObjValueTuple<Arguments<T["blocks"], k>[keyof Arguments<T["blocks"], k>]>>[0], }
    : { args: MapToArgument<TsMagic.ObjValueTuple<Arguments<T["blocks"], k>[keyof Arguments<T["blocks"], k>]>>, })
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }


type MapToArgument<T extends unknown[]> = T extends [] ? [] :
  T extends [infer H, ...infer R] ?
  H extends { type: infer X extends ValueOf<typeof ArgumentType> }
  ? H extends { menu: string }
  ? [WithRequired<VerboseArgument<TypeByArgumentType<X>>, "options">, ...MapToArgument<R>]
  : [VerboseArgument<TypeByArgumentType<X>>, ...MapToArgument<R>]
  : MapToArgument<R> : T

type WithName = { name: string };

const processArg = (arg: VerboseArgument<any> & WithName, argName: string, menuName: string, menus: ExtensionMetadata["menus"], blockName: string) => {
  arg.name = argName;
  if (!menuName) return;

  (arg.options as WithName).name = menuName;
  const menuEntry = menus[menuName];
  if (!menuEntry) return;

  const oldItems = (menuEntry as ExtensionMenuItems).items as MenuItem<any>[];
  if (!oldItems || oldItems.length === 0) return;

  const newItems: MenuItem<any>[] = Array.isArray(arg.options)
    ? (arg.options as MenuItem<any>[])
    : isFunction(arg.options)
      ? (arg.options as DynamicMenu<any>)()
      : (arg.options as MenuThatAcceptsReporters<any>).items
        ? (arg.options as MenuThatAcceptsReporters<any>).items
        : (arg.options as DynamicMenuThatAcceptsReporters<any>).getItems();

  const expand = (item: MenuItem<any>) => isPrimitive(item) ? ({ text: `${item}`, value: item }) : item as { value: any; text: string; };
  const serialize = (item: any) => JSON.stringify(item);

  const oldItemsExpanded = oldItems.map(expand).map(serialize);
  const newItemsExpand = newItems.map(expand).map(serialize);

  for (const oldItem of oldItemsExpanded) {
    if (!newItemsExpand.includes(oldItem)) {
      throw new Error(`Mismatch in old and new menus for block ${blockName}: arg ${argName}. Old entry: ${oldItem}, new entries: [${newItemsExpand.join(", ")}]`)
    }
  }
}

const attachNames = <T extends SerializedBlockData, TKey extends Opcodes<T>, TBlock>(
  name: TKey,
  block: TBlock & MappedToBlockDefinition<T>[TKey],
  legacyBlock: ExtensionBlockMetadata,
  menus: ExtensionMetadata["menus"]
): TBlock => {
  type AnyBlock = Block<BaseExtension, ((...args: any[]) => any) | ((arg: any) => any) | (() => any)>;
  const asBlock = block as any as AnyBlock;
  (block as any as WithName).name = name;

  if ("arg" in asBlock) {
    const [key, { menu }] = Object.entries(legacyBlock.arguments)[0];
    processArg(asBlock.arg, key, menu, menus, name);
  }
  else if ("args" in asBlock) {
    const entries = Object.entries(legacyBlock.arguments);
    for (let index = 0; index < entries.length; index++) {
      const [key, { menu }] = entries[index];
      processArg(asBlock.args[index], key, menu, menus, name);
    }
  }

  return block;
}

type LegacySupport<T extends SerializedBlockData> =
  { [k in Opcodes<T>]: <TBlock extends MappedToBlockDefinition<T>[k]>(block: TBlock) => TBlock }
  & { tsIgnore: { [k in Opcodes<T>]: <TBlock>(block: TBlock) => TBlock } }
  & { legacyBlocksForTests: { [k in Opcodes<T>]: ExtensionBlockMetadata } }

export const extractLegacySupportFromOldGetInfo = <T extends SerializedBlockData>(data: T): LegacySupport<T> => {
  const { blocks, menus } = data;

  const mapper: LegacySupport<T> = ((blocks as ExtensionBlockMetadata[]).filter(block => !isString(block)) as ExtensionBlockMetadata[])
    .map(block => {
      const opcode = block.opcode as Opcodes<T>;
      return [opcode, (b) => attachNames<T, typeof opcode, typeof b>(block.opcode as Opcodes<T>, b, block, menus)];
    })
    .reduce((acc, [key, func]) => {
      acc[key] = func;
      return acc;
    }, {} as any);

  mapper["tsIgnore"] = mapper as any as LegacySupport<T>["tsIgnore"];

  mapper.legacyBlocksForTests = (blocks as ExtensionBlockMetadata[]).reduce((acc, block) => {
    acc[block.opcode] = block;
    return acc;
  }, {} as LegacySupport<T>["legacyBlocksForTests"]);

  return mapper;
};

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
    : R
}

