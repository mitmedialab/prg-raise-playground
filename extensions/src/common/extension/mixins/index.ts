import { ExtensionBase, ExtensionBaseConstructor } from "./required/ExtensionBase";
import customArguments from "./customArguments";
import customSaveData from "./customSaveData";
import scratchInfo from "./scratchInfo";
import supportedMixins from "./required/supported";
import ui from "./ui";

export const optionalMixins = {
  customArguments,
  ui,
  customSaveData,
} as const satisfies Mixins;

export type Mixins<T extends ExtensionBaseConstructor = ExtensionBaseConstructor> = {
  ui: typeof ui<T>;
  customArguments: typeof customArguments<T>,
  customSaveData: typeof customSaveData<T>,
}

export const defaults = ["ui", "customArguments", "customSaveData"] as const satisfies readonly MixinNames[];

type MinimumFunctionality = ReturnType<typeof supportedMixins<ReturnType<typeof scratchInfo<ExtensionBaseConstructor>>>>;

export type MixinNames = keyof typeof optionalMixins;

export type ExtensionWithFunctionality<TSupported extends MixinNames[], TBase extends ExtensionBaseConstructor = MinimumFunctionality> = TSupported extends [infer Head, ...infer Tail]
  /** Use `extends` to enable typescript to infer desired characteristics */
  ? Head extends keyof Mixins ? Tail extends (keyof Mixins)[] ? TBase extends ExtensionBaseConstructor
  /** Accumalate the TBase parameter */
  ? ExtensionWithFunctionality<Tail, ReturnType<Mixins<TBase>[Head]>>
  /** Return never as Head, Tail, and TBase should never not meet the above type requirements */
  : never : never : never
  /** Base case */
  : TBase;

export type ExtensionIntanceWithFunctionality<TSupported extends MixinNames[]> = InstanceType<ExtensionWithFunctionality<TSupported>>;