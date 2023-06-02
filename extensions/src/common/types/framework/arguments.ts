import type BlockUtility from "$scratch-vm/engine/block-utility";
import { ArgumentType } from "../enums";
import { ValueOf } from "../utils";
import { BlockOperation } from "./blocks";
import { Menu } from "./menus";

export type VerboseArgument<T> = {
  type: ScratchArgument<T>;
  defaultValue?: T | undefined;
  options?: Menu<T>;
};

export type InlineImageSpecifier = "inline image";

export type InlineImage = {
  type: typeof ArgumentType.Image;
  uri: string,
  alt: string,
  flipRTL?: boolean
}

export type Argument<T> = VerboseArgument<T> | ScratchArgument<T>;

export type RGBObject = { r: number, g: number, b: number };
export type Matrix = boolean[][];

export type TypeByArgumentType<T extends ValueOf<typeof ArgumentType>> =
  T extends typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note ? number
  : T extends typeof ArgumentType.Boolean ? boolean
  : T extends typeof ArgumentType.Image ? InlineImage
  : T extends typeof ArgumentType.String ? string
  : T extends typeof ArgumentType.Color ? RGBObject
  : T extends typeof ArgumentType.Matrix ? Matrix
  : T extends typeof ArgumentType.Custom ? any
  : never;

/**
 * These are the argument types you're block method can accept 'out of the box'. 
 * 
 * If none of these suit your needs (and you're adventureous), you can ask someone about **_Custom Arguments_**...
 */
export type AcceptableArgumentTypes = TypeByArgumentType<ValueOf<Omit<typeof ArgumentType, "Custom">>>;

export type ScratchArgument<T> =
  T extends RGBObject ? typeof ArgumentType.Color :
  T extends boolean[][] ? typeof ArgumentType.Matrix :
  T extends InlineImage ? typeof ArgumentType.Image :
  T extends number ? (typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note | typeof ArgumentType.Custom) :
  T extends string ? (typeof ArgumentType.String | typeof ArgumentType.Custom) :
  T extends boolean ? (typeof ArgumentType.Boolean | typeof ArgumentType.Custom) :
  (typeof ArgumentType.Custom);

export type ToArguments<T extends any[]> =
  T extends [infer _ extends InlineImageSpecifier, ...infer Tail]
  ? readonly [InlineImage, ...ToArguments<Tail>]
  : T extends [infer Head, ...infer Tail]
  ? readonly [Argument<Head>, ...ToArguments<Tail>]
  : [];

export type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtility];
