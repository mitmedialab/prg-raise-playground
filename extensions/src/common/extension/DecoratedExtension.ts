import { ExtensionCommon } from "./ExtensionCommon";

export abstract class DecoratedExtension extends ExtensionCommon {
  readonly version = "decorated" as const;
}
