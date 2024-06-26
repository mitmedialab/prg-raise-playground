import { BaseScratchExtensionConstuctor } from "..";

/**
 * Mixin the ability for extensions to check which optional mixins they support
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function (Ctor: BaseScratchExtensionConstuctor) {
    abstract class ExtensionWithConfigurableSupport extends Ctor {

        pushVersions(opcode: string, versions: any) {

        }
    }

    return ExtensionWithConfigurableSupport;
}