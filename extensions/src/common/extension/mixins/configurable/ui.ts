import { openUI } from "$common/ui";
import { MinimalExtensionConstructor } from "../base";

/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithUISupport extends Ctor {

    /**
     * Open a UI in a modal window 
     * @param component The name of the svelte component / file to open (which should be stored within the same folder as your extension's `index.ts` file). 
     * You can optionally leave off the `.svelte` extension.
     * @param label What to title the modal window that pops up (defaults to your extension's name if left blank)
     */
    openUI(component: string, label?: string) {
      const { id, name, runtime } = this;
      openUI(runtime, { id, name, component: component.replace(".svelte", ""), label });
    }

  }

  return ExtensionWithUISupport;
}
