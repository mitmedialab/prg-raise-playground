import { MinimalExtensionConstructor } from "../../base";

/**
 * Mixin the ability for an extension to be treated as a cross-platform extension, 
 * spanning both the RAISE Playground and App Inventor.
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
    abstract class ExtensionWithAppInventorInterop extends Ctor {
        get withinAppInventor() {
            return false; // TODO: Determine what/if there is a way to do this.?
        }
    }

    return ExtensionWithAppInventorInterop;
}
