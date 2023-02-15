import { TypedClassDecorator } from ".";
import { DecoratedExtension, ExtensionV2Constructor } from "$common/extension/Extension";
import legacySupport from "$common/extension/mixins/legacySupport";
import { ArgumentType } from "$common/enums";
import { ExtensionMetadata, ExtensionBlockMetadata, ValueOf, TypeByArgumentType, ExtensionMenuItems } from "$common/types";

export function legacy<
  Args extends any[],
  TData extends ExtensionMetadata,
  T extends DecoratedExtension & LegacyProbe.LegacyMethods<TData>,
>(details: TData): TypedClassDecorator<T, Args> {

  return function (value, context) {
    abstract class LegacySupport extends legacySupport(value as ExtensionV2Constructor, details) {
      readonly originalClassName = context.name;
    };

    return LegacySupport as ExtensionV2Constructor as new (...args: Args) => T;
  }
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
