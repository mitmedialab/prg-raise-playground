import { AbstractConstructor } from "$common/types";
import addCostumes from "./optional/addCostumes/index";
import customArguments from "./optional/customArguments/index";
import customSaveData from "./optional/customSaveData";
import drawable from "./optional/drawable";
import legacySupport from "./optional/legacySupport";
import ui from "./optional/ui";
import video from "./optional/video";
import setTransparencyBlock from "./optional/blocks/setVideoTransparency";
import toggleVideoBlock from "./optional/blocks/toggleVideoState";
import { MinimalExtensionConstructor } from "./required";
import blockly from "./optional/blockly";

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
  blockly
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

export type ExtensionIntanceWithFunctionality<TSupported extends MixinName[]> = InstanceType<ExtensionWithFunctionality<TSupported>>;