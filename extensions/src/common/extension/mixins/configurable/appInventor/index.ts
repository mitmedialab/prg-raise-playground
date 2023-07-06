import { MinimalExtensionConstructor } from "../../base";

/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
    abstract class ExtensionWithAppInventorInterop extends Ctor {
        get withinAppInventor() {
            return false; // Is there a way to do this?
        }
    }

    return ExtensionWithAppInventorInterop;
}
