import { ExtensionWithFunctionality, MixinName, optionalMixins } from "./mixins/index";
import { ExtensionBase } from "./ExtensionBase";
import scratchInfo from "./mixins/required/scratchInfo";
import supported from "./mixins/required/supported";
import { ExtensionMenuDisplayDetails, Writeable } from "$common/types";
import { tryCaptureDependencies } from "./mixins/dependencies";

const registerDetailsIdentifier = "__registerMenuDetials";

const tryAnnounceDetails = (details: ExtensionMenuDisplayDetails) => {
  const isNode = typeof window === 'undefined';
  if (isNode) global?.[registerDetailsIdentifier]?.(details);
}

/**
 * Creates the base class that your Extension should 'extend' which is compatible with your request. 
 * 
 * Your request will have the following two parts:
 * @param details The details about how your extension should display and behave within the Extensions Menu.
 * Only the `name` field is required, but before your extension can be officially published, 
 * it will additionally need a `description`, `iconURL`, and `insetIconURL`
 * @param addOns An optional collection of specifiers about what functionality this extension should have.
 * In this way, the functionality your Extension has access to (through its base class) is configurable.
 * 
 * To see what `addOns` you can specify, place your cursor after the details parameter and type a double quote ("). 
 * Your IDE (code editor) should then suggest what values you can provide (e.g. `"ui"`, `"customArguments"`, `"customSaveData"`, etc.). 
 * 
 * **Note:** The order of the `addOns` does not matter.
 * @returns 
 * @example Defining an extension with a name and description (and no add ons)
 * ```ts
 * export default class Example extends extension({ name: "Some Name", description: "Some description..." }) {
 *  ...
 * }
 * ```
 * @example Defining an extension with a name and UI functionality
 * ```ts
 * export default class Example extends extension({ name: "Some Name" }, "ui") {
 *  ...
 * }
 * ```
 * @example Defining an extension with a name and UI & custom arguments functionality
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

  const { Result, allSupported } = recursivelyApplyMixinsAndDependencies(Base, addOns);
  return supported(Result, Array.from(allSupported)) as typeof Result;
}

const recursivelyApplyMixinsAndDependencies = <const TSupported extends readonly MixinName[]>(
  Base: ExtensionWithFunctionality<[...TSupported]>,
  addons: TSupported,
  alreadyAdded: Set<MixinName> = new Set()
): { Result: ExtensionWithFunctionality<[...TSupported]>, allSupported: Set<MixinName> } => {
  const Result = addons
    .filter(addon => !alreadyAdded.has(addon))
    .map(key => {
      alreadyAdded.add(key);
      return key;
    })
    .map(key => optionalMixins[key])
    .reduce((acc, mixin) => {
      const { dependencies, MixedIn } = tryCaptureDependencies(() => mixin(acc));
      return !dependencies
        ? MixedIn
        : recursivelyApplyMixinsAndDependencies(MixedIn, dependencies, alreadyAdded).Result as typeof MixedIn;
    }, Base);

  return { Result, allSupported: alreadyAdded }
}

export const registerExtensionDefinitionCallback = (callback: (details: ExtensionMenuDisplayDetails) => void) =>
  global[registerDetailsIdentifier] = (details) => {
    if (!details) return;
    callback(details);
    delete global[registerDetailsIdentifier];
  };

export type ExtensionConstructor<TSupported extends MixinName[] = []> = ReturnType<typeof extension<TSupported>>;
export type ExtensionInstance<TSupported extends MixinName[] = []> = InstanceType<ExtensionConstructor<TSupported>>;