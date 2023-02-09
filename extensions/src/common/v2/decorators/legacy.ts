import { BlockV2, ExtensionBase, ExtensionV2, ExtensionV2Constructor } from "$common/v2/Extension";
import { ArgumentType, BlockType } from "$common/enums";
import { ExtensionBaseConstructor } from "$common/v2/mixins";
import legacySupport, { BlockVariant, LegacyMap, MultipleArgs, NoArgs, OneArg } from "$common/v2/mixins/legacySupport";
import { ExtensionMetadata, ExtensionBlockMetadata, TypeByArgumentType, ValueOf, ExtensionMenuMetadata, ExtensionDynamicMenu, ExtensionMenuItems, Menu, Writeable, Argument, BlockOperation } from "$common/types";
import { isString } from "$common/utils";
import { TypedClassDecorator } from ".";

export function legacy<
  Args extends any[],
  TData extends ExtensionMetadata,
  T extends ExtensionV2 & LegacyProbe.LegacyMethods<TData>,
>(details: TData): TypedClassDecorator<T, Args> {

  return function (value, context) {
    abstract class LegacySupport extends legacySupport(value as ExtensionV2Constructor, details) {
      readonly originalClassName = context.name;
    };

    return LegacySupport as ExtensionBaseConstructor as new (...args: Args) => T;
  }
}

const buildLegacyMap = (details: LegacyProbe.SerializedBlockData) => {
  const { blocks, menus } = details;

  if (!areBlocksSupported(blocks))
    throw new Error(`Legacy blocks with only string values are not supported. Please declare the following entries as objects instead: ${(blocks as any[]).filter(b => isString(b)).join(", ")}`);

  return blocks.reduce(
    (legacyMap, { opcode, blockType: type, text, arguments: _arguments }) => {

      const args = Object.values(_arguments).map(({ type, defaultValue, menu }) => ({
        type,
        defaultValue,
        options: extractOptionsFromMenu(menu, menus)
      })) satisfies Argument<any>[];

      const argNames = Object.keys(_arguments);
      const argMenuNames = Object.values(_arguments).map(({ menu }) => menu);

      const block = toBlock({ text, type, args });

      return legacyMap.set(opcode, { block, argNames, argMenuNames });
    },
    new Map() as LegacyMap
  );
}

const extractOptionsFromMenu = (name: string, menus: LegacyProbe.Menus) => {
  if (!name) return undefined;
  if (!(name in menus)) throw new Error(`Menu name '${name}' not found in menus`);

  const metadata = menus[name];

  if (isDynamicMenu(metadata)) throw new Error(`Referenced menu '${name}' corresponded to a string value '${metadata}', which is assumed to be a dynamic menu, which is not supported.`);

  const { items, acceptReporters } = metadata;

  if (isDynamicMenu(items)) throw new Error(`The items of eferenced menu '${name}' corresponded to a string value '${metadata}', which is assumed to be a dynamic menu, which is not supported.`);

  if (!forceItemsToBeWritable(items)) throw new Error("This should never be hit");

  return (
    acceptReporters ? { items, acceptsReporters: true, handler: undefined } : items
  ) satisfies Menu<any>;
}

const toBlock = ({ text, type, args }: { text: string, type: ValueOf<typeof BlockType>, args: Argument<any>[] }): BlockVariant =>
  hasMultipleElements(args)
    ? ({ type, text: () => text, args } satisfies BlockV2<MultipleArgs>)
    : args.length == 1 ? ({ type, text: () => text, arg: args[0] } satisfies BlockV2<OneArg>)
      : { type, text } satisfies BlockV2<NoArgs>;

const areBlocksSupported = (blocks: LegacyProbe.Blocks): blocks is ExtensionBlockMetadata[] => !blocks.some(block => isString(block));

const isDynamicMenu = (metadata: ExtensionMenuMetadata | LegacyProbe.Items): metadata is ExtensionDynamicMenu => isString(metadata);

const forceItemsToBeWritable = (items: LegacyProbe.Items): items is LegacyProbe.WritableItems => true;

const hasMultipleElements = <T>(args: T[]): args is [T, T] => args.length >= 2;

/**
 * Types to assist in extracting information from the return type of the old 'getInfo' method
 */
namespace LegacyProbe {
  export type SerializedBlockData = Pick<ExtensionMetadata, "blocks" | "menus">;
  export type Blocks = SerializedBlockData["blocks"];
  export type Block = SerializedBlockData["blocks"];


  export type Arguments<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
    [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['arguments'] : never;
  };

  export type Opcodes<T extends SerializedBlockData> = { [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never }[number];

  export type OpArgs<T extends SerializedBlockData, K extends Opcodes<T>> = ArgsArray<TsMagic.ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>>;

  type ArgsArray<T extends unknown[]> = T extends [] ? [] :
    T extends [infer H, ...infer R]
    ? H extends { type: infer X extends ValueOf<typeof ArgumentType> }
    ? [TypeByArgumentType<X>, ...ArgsArray<R>]
    : ArgsArray<R>
    : T

  export type LegacyMethods<T extends SerializedBlockData> = { [k in Opcodes<T>]: (...args: OpArgs<T, k>) => any };

  export type Menus = ExtensionMetadata["menus"];
  export type Items = ExtensionMenuItems["items"];
  export type WritableItems = Writeable<Items>;
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
    : R
}
