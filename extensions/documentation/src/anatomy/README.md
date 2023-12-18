[](order=0)
## Anatomy of an Extension Directory

Extensions are defined by all the files that appear in their associated directory, located within `/extensions/src/`.

This directory is created when you run the command `npm run new:extension <extension name>` from the root of the project, where the value you provide for `<extension name>` is used to name this new directory. 

> **NOTE:** It is important to keep in mind that the name of an extension's associated directory is internally used to identify it, so it is best to avoid changing the directory's name (as this could affect previously saved `.sb3` projects that reference the extension).

### Included Files

Below are the files you should always find within an extension's directory:

- `index.ts`
    - This is the main place where your extension is implemented. It is **expected** that your extension class will be the `default export` of this file. For example:
[](./index.ts?export=x)
- `index.test.ts`
    - This is where you can implement both `unit` and `integration` tests for your extension.
    - Hop down to [Testing Extension](#testing-extensions) for more info.
- `package.json`
    - Each extension is treated as it's own package and thus has it's own [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) file. 
        - This makes it easy to handle cases when two extensions want to use different versions of the same [npm package](https://www.npmjs.com/). 
        - An extension's `package.json` file also includes [npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts) that execute scripts from the [root package.json]() with the exension's folder as an argument. This makes executing certain commands a little easier.
            - For example, if your extension folder is `myExtension`, you can do the following:
                ```
                cd extensions/myExtension # only do this once
                npm run dev 
                ```
             - Instead of running the following from the root of the project every time:
                ```
                npm run dev --include myExtension
                ```
            - Inspect the `package.json` file to see all augmented scripts.

### Auxiliary Files

In adition to the above files, you might find any of the below: 

- `.png` or `.jpg` files
    - Image files included in an extension directory are likely either used for icons and/or tutorials.
- `.svelte` files
    - Extensions can have their own associated UI windows, which are implemented using the [Svelte Frontend Framework](https://svelte.dev/).
    - Hop down to [Creating UI for Extensions](#creating-ui-for-extensions) for more info.
- `translations.ts`
    - In the future, this file will be used to support defining an extension's display text in mulitple languages.
    - Currently **NOT** used.
- Additional `.ts` files
    - Developers are free to create as many typescript files as they need within their extensions's directory -- and frankly it's encouraged! Long files can be difficult to read. 
- `README.md`
    - Motivated developers might include a README file to help document their extension. 

### Official Examples

A great to start digging into the files that make up an Extension is to check out some working examples:

- [Simple](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions/src/simple_example)
- [Complex](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions/src/complex_example)