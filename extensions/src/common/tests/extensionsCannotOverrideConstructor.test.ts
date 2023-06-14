import { Extension } from "$common/extension/GenericExtension";
import { Environment } from "$common/types";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { test, describe } from "$testing";
import { DefaultDisplayDetails } from "$testing/defaults";

describe('Implemented extension should not override constructor', () => {
  test("Extension constructor cannot be overrided without call to super", () => {
    class ExtensionWithNoCallToSuper extends Extension<DefaultDisplayDetails, {}> {
      // @ts-expect-error -- no call to super
      constructor() {

      }

      init(env: Environment): void { }
      defineBlocks() { return {} }

    }
  });

  test("Super call can't be easily invoked", () => {
    class ExtensionWithCallsToSuper extends Extension<DefaultDisplayDetails, {}> {
      constructor(runtime: Runtime) {
        // @ts-expect-error
        super({});
        // @ts-expect-error
        super(4);
        // @ts-expect-error
        super(undefined);

        // Valid but very frowned upon!
        super(runtime as never);
      }

      init(env: Environment): void { }
      defineBlocks() { return {} }
    }
  });

});