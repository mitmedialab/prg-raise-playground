import { ExtensionInstanceWithFunctionality, MixinName, optionalMixins } from "..";
import { ExtensionBaseConstructor } from "../../ExtensionBase";

/**
 * Mixin the ability for extensions to check which optional mixins they support
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function (Ctor: ExtensionBaseConstructor, supported: string[]) {
  abstract class ExtensionWithConfigurableSupport extends Ctor {

    supports<const TKey extends MixinName>(mixinName: TKey): this is typeof this & ExtensionInstanceWithFunctionality<[TKey]> {
      return supported.includes(mixinName);
    }
  }

  return ExtensionWithConfigurableSupport;
}