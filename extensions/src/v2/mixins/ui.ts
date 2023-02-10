import { openUI } from "$common";
import { ExtensionBaseConstructor } from "../Extension";

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
