import { AbstractConstructor, ValueOf } from "$common/types";
import { Mixin, MixinName, optionalMixins } from "./index";
import { MinimalExtensionConstructor, MinimalExtensionInstance } from "./required";

type DependentFunctionality<TBase, TMixinDependencies extends Mixin<unknown>[]> =
  TMixinDependencies extends [infer Head extends Mixin<unknown>, ...infer Tail extends Mixin<unknown>[]]
  ? DependentFunctionality<ReturnType<Head> & TBase, Tail>
  : TBase;

const dependencyListeners: ((mixins: Mixin<any>[]) => void)[] = []

export const withDependencies = <
  Base extends MinimalExtensionConstructor,
  TMixinDependencies extends Mixin<T>[],
  T
>(Ctor: Base, ...dependencies: TMixinDependencies) => {
  dependencyListeners.pop()?.(dependencies);
  return Ctor as Base & DependentFunctionality<Base, TMixinDependencies>;
}

let mixinsMap: Map<ValueOf<typeof optionalMixins>, keyof typeof optionalMixins>;

export const tryCaptureDependencies = <TReturn>(createMixin: () => TReturn): { MixedIn: TReturn, dependencies: MixinName[] | null } => {

  mixinsMap ??= Object.entries(optionalMixins).reduce((map, [name, mixin]) => {
    return map.set(mixin, name as MixinName);
  }, new Map());

  let dependencies: MixinName[];

  dependencyListeners.push((mixins) => {
    mixins
      .map(dependency => dependency as ValueOf<typeof optionalMixins>)
      .forEach(dependency => {
        if (!mixinsMap.has(dependency)) throw new Error("Unkown mixin dependency! " + dependency);
        dependencies ??= [];
        dependencies.push(mixinsMap.get(dependency));
      })
  });

  const MixedIn = createMixin();

  return { dependencies, MixedIn };
}