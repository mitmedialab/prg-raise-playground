[](order=1)
## Creating UI for Extensions

To develop UI for your extension, we ask that you implement an interface that will be rendered in a [modal](https://blog.hubspot.com/website/modal-web-design#:~:text=What%20is%20a%20modal?) / pop-up.

Extension UI is implemented using the [Svelte Frontend Framework](https://svelte.dev/).

Please first make sure you've satisfied [Svelte Dependency](https://github.com/mitmedialab/prg-extension-boilerplate#svelte-only-if-you-are-developing-ui).

To generate a new svelte file, run the following command from the root of the project:

```bash
npm run add:ui <extension folder>
# For example: npm run add:ui myExtension
```

If succesful, the above command will point you to a generated file with the `.svelte` file-extension that lives inside of your extension's directory.

Feel free to change the name of this file to match it's intended usage, e.g. `Editor.svelte` or `AddItem.svelte` 

> **NOTE:** The convention is to use [Pascal Case](https://www.theserverside.com/definition/Pascal-case) to name svelte files, so they often start with a capital letter (unlike `.js` or `.ts` files).

### Open UI Using a Button

The most common (and recommended) way to open UI via your extension is to:

#### 1. Add UI support to your extension by specifying the "ui" add on

[](./extension.ts?export=x)

#### 2. Utilitze the (now available) `openUI` method in a Button Block

The first argument of the `openUI` method is the name of the `.svelte` file in which your UI is implemented -- this name must match your filename exactly (but you can omit the `.svelte` extension).

The second argument is the title that will display at the top of the modal window. If omitted, this will default to the name of your extension.

Below are two examples of declaring buttons (one using the standard `@block` decorator, and the other using the `@buttonBlock` decorator short-hand):

[](./index.ts?export=x)

### Custom Argument UI

You can also create UI in order to accomplish custom arguments. Hop over to [Adding Custom Arguments](#adding-custom-arguments) for a breakdown on how to do that!