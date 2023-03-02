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

export type Argument<T> = VerboseArgument<T> | ScratchArgument<T>;

export type RGBObject = { r: number, g: number, b: number };
export type Matrix = boolean[][];

export type TypeByArgumentType<T extends ValueOf<typeof ArgumentType>> =
  T extends typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note ? number
  : T extends typeof ArgumentType.Boolean ? boolean
  : T extends typeof ArgumentType.String ? string
  : T extends typeof ArgumentType.Color ? RGBObject
  : T extends typeof ArgumentType.Matrix ? boolean[][]
  : T extends typeof ArgumentType.Image ? string // TODO
  : T extends typeof ArgumentType.Custom ? any
  : never;

export type ScratchArgument<T> =
  T extends RGBObject ? typeof ArgumentType.Color :
  T extends boolean[][] ? typeof ArgumentType.Matrix :
  T extends number ? (typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note | typeof ArgumentType.Custom) :
  T extends string ? (typeof ArgumentType.String | typeof ArgumentType.Custom) :
  T extends boolean ? (typeof ArgumentType.Boolean | typeof ArgumentType.Custom) :
  T extends { dataURI: string, alt: string, flipRTL: boolean } ? typeof ArgumentType.Image :
  (typeof ArgumentType.Custom);

// Used to be <T extends [...any[]]> ... not sure if it needs to be?
export type ToArguments<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

export type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtility];
