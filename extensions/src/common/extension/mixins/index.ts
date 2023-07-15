import { AbstractConstructor } from "$common/types";
import addCostumes from "./configurable/addCostumes/index";
import customArguments from "./configurable/customArguments/index";
import customSaveData from "./configurable/customSaveData";
import drawable from "./configurable/drawable";
import legacySupport from "./configurable/legacySupport";
import ui from "./configurable/ui";
import indicators from "./configurable/indicators";
import video from "./configurable/video";
import setTransparencyBlock from "./configurable/blocks/setVideoTransparency";
import toggleVideoBlock from "./configurable/blocks/toggleVideoState";
import appInventor from "./configurable/appInventor/index";
import blockly from "./configurable/blockly";
import { MinimalExtensionConstructor } from "./base";

export type Mixin<T> = (Ctor: MinimalExtensionConstructor) => AbstractConstructor<T>;

export const optionalMixins = {
  customArguments,
  ui,
  customSaveData,
  video,
  drawable,
  addCostumes,
  legacySupport,
  setTransparencyBlock,
  toggleVideoBlock,
  appInventor,
  indicators,
  blockly,
} as const satisfies OptionalMixins satisfies Record<string, Mixin<unknown>>;

export type OptionalMixins<T extends MinimalExtensionConstructor = MinimalExtensionConstructor> = {
  ui: typeof ui<T>;
  customArguments: typeof customArguments<T>,
  customSaveData: typeof customSaveData<T>,
  video: typeof video<T>,
  drawable: typeof drawable<T>,
  addCostumes: typeof addCostumes<T>,
  legacySupport: typeof legacySupport<T>,
  setTransparencyBlock: typeof setTransparencyBlock<T>,
  toggleVideoBlock: typeof toggleVideoBlock<T>,
  appInventor: typeof appInventor<T>,
  indicators: typeof indicators<T>,
  blockly: typeof blockly<T>,
}

export type MixinName = keyof typeof optionalMixins;

export type ExtensionWithFunctionality<TSupported extends MixinName[], TBase extends MinimalExtensionConstructor = MinimalExtensionConstructor> =
  TSupported extends [infer Head, ...infer Tail]
  /** Use `extends` to enable typescript to infer desired characteristics */
  ? Head extends keyof OptionalMixins ? Tail extends (keyof OptionalMixins)[] ? TBase extends MinimalExtensionConstructor
  /** Accumalate the TBase parameter */
  ? ExtensionWithFunctionality<Tail, ReturnType<OptionalMixins<TBase>[Head]>>
  /** Return never as Head, Tail, and TBase should never not meet the above type requirements */
  : never : never : never
  /** Base case */
  : TBase;

export type ExtensionInstanceWithFunctionality<TSupported extends MixinName[]> = InstanceType<ExtensionWithFunctionality<TSupported>>;