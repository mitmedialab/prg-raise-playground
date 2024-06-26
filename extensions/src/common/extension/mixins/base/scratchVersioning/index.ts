import { BaseScratchExtensionConstuctor } from "..";

/**
 * Mixin the ability for extensions to have their blocks 'versioned', 
 * so that projects serialized with past versions of blocks can be loaded.
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