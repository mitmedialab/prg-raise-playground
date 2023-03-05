import { ExtensionWithFunctionality, MixinName, optionalMixins } from "./mixins/index";
import { MinimalExtensionConstructor } from "./mixins/required";
import { ExtensionBase } from "./ExtensionBase";
import scratchInfo from "./mixins/required/scratchInfo";
import supported from "./mixins/required/supported";
import { ExtensionMenuDisplayDetails, Writeable } from "$common/types";

const registerDetailsIdentifier = "__registerMenuDetials";

const tryAnnounceDetails = (details: ExtensionMenuDisplayDetails) => {
  const isNode = typeof window === 'undefined';
  if (isNode) global?.[registerDetailsIdentifier]?.(details);
}

export const extension = <const TSupported extends readonly MixinName[]>(
  details: ExtensionMenuDisplayDetails,
  ...addOns: Writeable<TSupported>
): ExtensionWithFunctionality<[...TSupported]> & typeof ExtensionBase => {
  tryAnnounceDetails(details);

  const Base: MinimalExtensionConstructor = scratchInfo(supported(ExtensionBase, addOns));

  if (!addOns) return Base as ExtensionWithFunctionality<[...TSupported]>;

  if (addOns.includes("customArguments")) addOns.push("customSaveData");

  return Array.from(new Set(addOns))
    .sort() // Ensure same order always
    .map(key => optionalMixins[key])
    .reduce(
      (acc, mixin) => mixin(acc),
      Base as ExtensionWithFunctionality<[...TSupported]>
    )
}

export const registerExtensionDefinitionCallback = (callback: (details: ExtensionMenuDisplayDetails) => void) =>
  global[registerDetailsIdentifier] = (details) => {
    if (!details) return;
    callback(details);
    delete global[registerDetailsIdentifier];
  };


export type ExtensionInstance<TSupported extends MixinName[] = []> = InstanceType<ReturnType<typeof extension<TSupported>>>;