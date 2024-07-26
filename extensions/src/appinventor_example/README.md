## Important files

- extensions/src/appinventor_example/index.ts
    - Where the extension is implented (so you can experiment with adding new methods & attaching the `@block` decorator)
    - Note the _new_ things:
        - `@getterBlock` & `@setterBlock`
        - `generateAppInventorBinding: true` as an Extension Detail
            - We could also do away with this in favor of just 'looking for' the appInvetor mixin (see below) -- depends on if we think every app-inventor-interop extension will use this mixin (if they will, then we should probably use it instead of this property) 
            - NOTE for @parker: the `ExtensionMenuDisplayDetails` type should probably be renamed since it holds for than just diplay details -- `ExtensionSettings`?
        - `"appInventor"` 'configuration' passed into `extension(...)` to apply the appInventor mixin to our extension (see more below)
- extensions/src/common/extension/decorators/blocks.ts
    - Where `@block` and associated decorators are defined
    - Note the use of the `blockBundleEvent`
        - 'fired' from inside of this file, and subscribed to with the bundling process (see below)
- extensions/scripts/bundles/plugins.ts
    - Where all our custom rollup (bundling) plugins are defined
    - The one we care about here is at the bottom: `finalizeConfigurableExtensionBundle`
        - Note the use of `blockBundleEvent.registerCallback` where we can parse information about blocks and use this info for code gen (which can happen at the end of `executeBundleAndExtractMenuDetails`)
            - `executeBundleAndExtractMenuDetails` should be renamed...
- extensions/scripts/bundles/auxiliaryInfo.ts
    - Where "bundleTime" information is stored (so it can later be passed to the extension instance when it is created)
    - This is where icons are encoded to URIs
- extensions/src/common/extension/mixins/optional/appInventor/index.ts
    - We can use this to setup common functionality for all app-inventor-interoping extensions 
- scratch-packages/scratch-vm/src/extension-support/bundle-loader.js
    - methods (on Scratch side) to handle importing extension bundles

## Topics of discussion

- (As given) we don't know what type is returned by 'reporter' blocks
    - Also, scratch really only plays nice with 'reporting' strings & numbers
        - BUT you are allowed to return anything you want...
    - What we might do:
        - Walk the AST for the Extension and look up the method by name
        - Ability to opt-in / opt-out of blocks for either platform
- Plan: implement quadratic solver first