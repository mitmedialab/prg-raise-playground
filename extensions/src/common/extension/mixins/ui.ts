import { openUI } from "$common/ui";
import { ExtensionBaseConstructor } from "$common/extension/mixins/required/ExtensionBase";

/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends ExtensionBaseConstructor>(Ctor: T) {
  abstract class _ extends Ctor {

    /**
     * Howdy Hi
     * @param component 
     * @param label 
     */
    openUI(component: string, label?: string) {
      const { id, name, runtime } = this;
      openUI(runtime, { id, name, component: component.replace(".svelte", ""), label });
    }

  }

  return _;
}
