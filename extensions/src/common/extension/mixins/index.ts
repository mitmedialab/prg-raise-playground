import customArguments from "./optional/customArguments/index";
import customSaveData from "./optional/customSaveData";
import ui from "./optional/ui";
import { MinimalExtensionConstructor } from "./required";

export const optionalMixins = {
  customArguments,
  ui,
  customSaveData,
} as const satisfies OptionalMixins;

export type OptionalMixins<T extends MinimalExtensionConstructor = MinimalExtensionConstructor> = {
  ui: typeof ui<T>;
  customArguments: typeof customArguments<T>,
  customSaveData: typeof customSaveData<T>,
}

export type MixinName = keyof typeof optionalMixins;

export type ExtensionWithFunctionality<TSupported extends MixinName[], TBase extends MinimalExtensionConstructor = MinimalExtensionConstructor> = TSupported extends [infer Head, ...infer Tail]
  /** Use `extends` to enable typescript to infer desired characteristics */
  ? Head extends keyof OptionalMixins ? Tail extends (keyof OptionalMixins)[] ? TBase extends MinimalExtensionConstructor
  /** Accumalate the TBase parameter */
  ? ExtensionWithFunctionality<Tail, ReturnType<OptionalMixins<TBase>[Head]>>
  /** Return never as Head, Tail, and TBase should never not meet the above type requirements */
  : never : never : never
  /** Base case */
  : TBase;

export type ExtensionIntanceWithFunctionality<TSupported extends MixinName[]> = InstanceType<ExtensionWithFunctionality<TSupported>>;