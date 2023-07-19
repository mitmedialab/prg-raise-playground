import { ExtensionInstance } from "$common/extension";
import { ExtensionInstanceWithFunctionality, MixinName } from "$common/extension/mixins";
import { MinimalExtensionInstance } from "$common/extension/mixins/base";
import { BlockUtilityWithID, ExtensionUI } from ".";
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
  /**
   * This is a special type of argument that represents an inline image.
   */
  type: typeof ArgumentType.Image;
  /**
   * The URI of the image. This can be a relative path to the image file, or a data URI.
   * 
   * The most straightforward way is to import a file as if it was a code file, and use the default export as the URI.
   * @example
   * // At top of file
   * import exampleImage from "./exampleImage.png";
   * 
   * // In block definition
   * {
   *   type: "image",
   *   uri: exampleImage,
   * }
   *
   */
  uri: string,
  /**
   * The description of the image for screen readers.
   */
  alt: string,
  /**
   * Whether the image should be flipped when the user's language is right-to-left.
   */
  flipRTL?: boolean
}

export type ArgumentEntry<T> = { text: string, value: T };
export type ArgumentEntrySetter<T, TReturn = void> = (entry: ArgumentEntry<T>) => TReturn;
export type CustomArgumentUI<T, Extension extends MinimalExtensionInstance> = ExtensionUI<Extension, { setter: ArgumentEntrySetter<T>, current: ArgumentEntry<T> }>;
export type CustomArgument<T, Extension extends ExtensionInstance = MinimalExtensionInstance> =
  Extension extends ExtensionInstanceWithFunctionality<["customArguments"]>
  ? {
    type: typeof ArgumentType.Custom;
    component: CustomArgumentUI<T, Extension>,
    defaultEntry: ArgumentEntry<T>;
    acceptReportersHandler?: (x: any) => ArgumentEntry<T>;
  }
  : `ERROR: This looks like a custom argument. Your extension must be configured with the ${MixinName & "customArguments"} addon to use custom arguments.`

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

export type ToArguments<T extends any[], Extension extends MinimalExtensionInstance = MinimalExtensionInstance> =
  T extends [infer _ extends InlineImageSpecifier, ...infer Tail]
  ? readonly [InlineImage, ...ToArguments<Tail, Extension>]
  : T extends [infer Head extends unknown, ...infer Tail]
  ? readonly [Argument<Head>, ...ToArguments<Tail, Extension>]
  : T extends [infer Head, ...infer Tail]
  ? ScratchArgument<Head> extends typeof ArgumentType.Custom
  ? readonly [CustomArgument<Head, Extension>, ...ToArguments<Tail, Extension>]
  : readonly [Argument<Head>, ...ToArguments<Tail, Extension>]
  : T extends [infer Head, ...infer Tail]
  ? readonly [Argument<Head>, ...ToArguments<Tail, Extension>]
  : [];

export type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtilityWithID];
