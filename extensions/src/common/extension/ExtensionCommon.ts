import { extension } from "./index";
import { defaults } from "./mixins";

export const extensionsMap = new Map<string, ExtensionCommon>();

export abstract class ExtensionCommon extends extension(...defaults) {
  abstract readonly version: "decorated" | "generic";

  /**
   * Prevent developers from implementing the constructor.
   * This must be controlled by the framework since Scratch is the one who calls the extension's constructor.
   * @param FORBIDDEN
   */
  constructor(FORBIDDEN: never) {
    super(...arguments);
    extensionsMap.set(this.id, this);
  }
}
