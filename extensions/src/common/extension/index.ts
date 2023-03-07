import { ExtensionWithFunctionality, MixinName, optionalMixins } from "./mixins/index";
import { MinimalExtensionConstructor } from "./mixins/required";
import { ExtensionBase } from "./ExtensionBase";
import scratchInfo from "./mixins/required/scratchInfo";
import supported from "./mixins/required/supported";
import { ExtensionMenuDisplayDetails, Writeable } from "$common/types";
import { getDependencies } from "./mixins/dependencies";

const registerDetailsIdentifier = "__registerMenuDetials";

const tryAnnounceDetails = (details: ExtensionMenuDisplayDetails) => {
  const isNode = typeof window === 'undefined';
  if (isNode) global?.[registerDetailsIdentifier]?.(details);
}

/**
 * Creates the extension base class compatible with your request, which has two parts:
 * @param details The details about how your extension should display and behave with the Extensions menu.
 * Only the `name` field is required, but before your extension can be officially published, 
 * it will additionally need a `description`, `iconURL`, and `insetIconURL`
 * @param addOns An optional (zero or more) set of specifiers about what functionality this extension should have.
 * In this way, an 
 * 
 * To see what `addOns` you can specify, place your cursor after the details parameter and type a double quote ("). 
 * Your IDE should then suggest what values you can use (e.g. `"ui"`, `"customArguments"`, `"customSaveData"`, etc.). 
 * Note, the order of the `addOns` does not matter.
 * @returns 
 * @example Extending an extension with a name and description (and no add ons)
 * ```ts
 * export default class Example extends extension({ name: "Some Name", description: "Some description..." }) {
 *  ...
 * }
 * ```
 * @example Extending an extension with a name and UI support
 * ```ts
 * export default class Example extends extension({ name: "Some Name" }, "ui") {
 *  ...
 * }
 * ```
 * @example Extending an extension with a name and UI & custom arguments support
 * ```ts
 * export default class Example extends extension({ name: "Some Name" }, "ui", "customArguments") {
 *  ...
 * }
 * ```
 */
export const extension = <const TSupported extends readonly MixinName[]>(
  details: ExtensionMenuDisplayDetails,
  ...addOns: Writeable<TSupported>
): ExtensionWithFunctionality<[...TSupported]> & typeof ExtensionBase => {

  tryAnnounceDetails(details);

  const Base = scratchInfo(supported(ExtensionBase, addOns)) as ExtensionWithFunctionality<[...TSupported]>;

  if (!addOns) return Base;

  addOns.push(...getDependencies(...addOns));

  return Array.from(new Set([...addOns]))
    .sort() // Ensure same order always
    .map(key => optionalMixins[key])
    .reduce((acc, mixin) => mixin(acc), Base)
}

export const registerExtensionDefinitionCallback = (callback: (details: ExtensionMenuDisplayDetails) => void) =>
  global[registerDetailsIdentifier] = (details) => {
    if (!details) return;
    callback(details);
    delete global[registerDetailsIdentifier];
  };

export type ExtensionConstructor<TSupported extends MixinName[] = []> = ReturnType<typeof extension<TSupported>>;
export type ExtensionInstance<TSupported extends MixinName[] = []> = InstanceType<ExtensionConstructor<TSupported>>;