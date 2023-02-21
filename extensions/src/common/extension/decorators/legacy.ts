import { TypedClassDecorator, TypedMethodDecorator } from ".";
import { AbstractConstructor, DecoratedExtension, Extension, ExtensionCommon, NonAbstractConstructor } from "$common/extension/Extension";
import legacySupport from "$common/extension/mixins/legacySupport";
import { ArgumentType, BlockType } from "$common/enums";
import { ExtensionMetadata, ExtensionBlockMetadata, ValueOf, TypeByArgumentType, ExtensionMenuItems, ExtensionMenuDisplayDetails, ExtensionBlocks, Block, DefineBlock, ReturnTypeByBlockType } from "$common/types";
import { BlockMetadata } from "$common/extension/Extension";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

export function legacy<
  TData extends ExtensionMetadata,
  TBlocks extends ExtensionBlocks & LegacyProbe.LegacyMethods<TData>,
  T extends /*(Extension<ExtensionMenuDisplayDetails, TBlocks> & { [k in keyof LegacyProbe.LegacyMethods<TData>]?: never }) |*/ DecoratedExtension & LegacyProbe.LegacyMethods<TData>,
  Args extends any[]
>(details: TData): TypedClassDecorator<T, ConstructorParameters<typeof ExtensionCommon>> {

  return function (value, context) {
    abstract class LegacySupport extends legacySupport(value as AbstractConstructor<ExtensionCommon>, details) {
      readonly originalClassName = context.name;
    };

    return LegacySupport as AbstractConstructor<DecoratedExtension> as new (...args: ConstructorParameters<typeof ExtensionCommon>) => T;
  }
}

export function legacyFactory<TData extends ExtensionMetadata>(details: TData): {
  extension<T extends ExtensionCommon & ((DecoratedExtension & LegacyProbe.LegacyMethods<TData>) | Extension<ExtensionMenuDisplayDetails, LegacyProbe.LegacyMethods<TData>>)>(): TypedClassDecorator<T, ConstructorParameters<typeof ExtensionCommon>>
} &
{
  blockDefinitions: { [k in keyof LegacyProbe.LegacyMethods<TData>]: <T extends Extension<any, LegacyProbe.LegacyMethods<TData>>, TReturn extends LegacyProbe.OpReturn<TData, k>>(
    extension: NonAbstractConstructor<T>,
    operation: (this: T, ...args: [...Parameters<LegacyProbe.LegacyMethods<TData>[k]>, BlockUtility]) => TReturn
  ) => Block<T, (...args: Parameters<LegacyProbe.LegacyMethods<TData>[k]>) => TReturn> & { type: LegacyProbe.BlockType<TData, k> } }
}
  &
{
  blockDecorators: {
    [k in keyof LegacyProbe.LegacyMethods<TData>]: <This extends DecoratedExtension, Args extends Parameters<LegacyProbe.LegacyMethods<TData>[k]>, Return extends any>() => TypedMethodDecorator<This, Args, Return, (...args: Args) => Return>
  }
} {

  return {} as any;
}


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

  export type Types<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
    [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['blockType'] : never;
  }

  export type Opcodes<T extends SerializedBlockData> = { [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never }[number];

  export type OpArgs<T extends SerializedBlockData, K extends Opcodes<T>> = ArgsArray<TsMagic.ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>>;

  export type BlockType<T extends SerializedBlockData, K extends Opcodes<T>> = Types<T["blocks"], K>[keyof Types<T["blocks"], K>] extends ValueOf<typeof BlockType> ? Types<T["blocks"], K>[keyof Types<T["blocks"], K>] : never;
  export type OpReturn<T extends SerializedBlockData, K extends Opcodes<T>, TBlockType extends BlockType<T, K> = BlockType<T, K>> = ReturnTypeByBlockType<TBlockType>;

  type ArgsArray<T extends unknown[]> = T extends [] ? [] :
    T extends [infer H, ...infer R]
    ? H extends { type: infer X extends ValueOf<typeof ArgumentType> }
    ? [TypeByArgumentType<X>, ...ArgsArray<R>]
    : ArgsArray<R>
    : T

  export type LegacyMethods<T extends SerializedBlockData> = { [k in Opcodes<T>]: (...args: OpArgs<T, k>) => OpReturn<T, k> };

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
    : R
}
