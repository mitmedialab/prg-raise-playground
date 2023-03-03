import { AbstractConstructor, Environment } from "$common/types";
import { ExtensionIntanceWithFunctionality, optionalMixins } from "..";
import { ExtensionBase, ExtensionBaseConstructor } from "./ExtensionBase";

/**
 * Mixin the ability for extensions to check which optional mixins they support
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends AbstractConstructor<any>>(Ctor: T, supported: (keyof typeof optionalMixins)[]) {
  abstract class _ extends Ctor {

    supports<const TKey extends keyof typeof optionalMixins>(mixinName: TKey): this is T & ExtensionIntanceWithFunctionality<[TKey]> {
      return supported.includes(mixinName);
    }

  }

  return _;
}