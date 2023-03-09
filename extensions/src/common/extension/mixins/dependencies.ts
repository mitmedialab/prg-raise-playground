import { AbstractConstructor } from "$common/types";
import { MixinName, optionalMixins } from ".";

export interface WithDependencies<TDepends extends MixinName[]> {
  /**
   * Get the dependencies of this mixin's classes functionality. 
   * You may need to cast your returned array as const (e.g. `[] as const`) in order to satisfy type requirements.
   * 
   * **NOTE:** The term _Static_ is used here to indicate that this function will be executed on the mixin
   * class's `prototype` and therefore the implementation should make no reference to `this`.
   */
  getStaticDependencies(): readonly [...TDepends];
}

type MixinsWithDependencies = {
  [
  k in keyof typeof optionalMixins as
  ReturnType<typeof optionalMixins[k]> extends AbstractConstructor<WithDependencies<MixinName[]>>
  ? k
  : never
  ]:
  ReturnType<typeof optionalMixins[k]> extends AbstractConstructor<WithDependencies<infer X>>
  ? X : never
}

const optionalMixinDependencies: MixinsWithDependencies = {
  customArguments: ["customSaveData"],
}

export const getDependencies = (...mixinNames: MixinName[]) => mixinNames
  .filter(key => key in optionalMixinDependencies)
  .map(key => optionalMixinDependencies[key as keyof typeof optionalMixinDependencies])
  .flat();
