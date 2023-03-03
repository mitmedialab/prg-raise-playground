import { ExtensionWithFunctionality, Mixins, optionalMixins, MinimalExtension } from "./mixins/index";

export const extension = <TSupported extends (keyof Mixins)[]>(...functionality: TSupported): ExtensionWithFunctionality<TSupported> => functionality
  .sort() // Ensure same order always
  .map(key => optionalMixins[key])
  .reduce((acc, mixin) => {
    const mixedIn = mixin(acc);
    mixedIn.prototype.supported = functionality;
    return mixin(acc);
  }, MinimalExtension as ExtensionWithFunctionality<TSupported>
  );
