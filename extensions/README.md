# Extensions

This document aims to complement the information provided in the [root README.md](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/README.md) (especially the [extensions section](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/README.md#-how-to-program-an-extension)).

Here we drill down more into the development details associated with extensions. 

This document will be most helpful for people doing more complex development, like:
- Adding UI to extensions
- Writing tests for extensions 
- Porting vanilla Javascript extensions to the use the newer Typescript Extension Framework
- Working on the Typescript Extension Framework itself

## Anatomy of an Extension Directory

Extensions are defined by all the files that appear in their associated directory, located within `/extensions/src/`.

This directory is created when you run the command `npm run new:extension <extension name>` from the root of the project, where the value you provide for `<extension name>` is used to name this new directory. 

> **NOTE:** It is important to keep in mind that the name of an extension's associated directory is internally used to identify it, so it is best to avoid changing the directory's name (as this could affect previously saved `.sb3` projects that reference the extension).

### Included Files

Below are the files you should always find within an extension's directory:

- `index.ts`
    - This is the main place where your extension is implemented. It is **expected** that your extension class will be the `default export` of this file. For example:
```ts 
export default class ExampleExtension extends Extension<...> {
    ...
}
```
- `index.test.ts`
    - This is where you can implement both `unit` and `integration` tests for your extension.
    - Hop down to [Testing Extension](#testing-extensions) for more info.
- `package.json`
    - Each extension is treated as it's own package and thus has it's own [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) file. 
        - This makes it easy to handle cases when two extensions want to use different versions of the same [npm package](https://www.npmjs.com/). 

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

- [Simple]()
- [Complex]()

## Creating UI for Extensions

To develop UI for your extension, we ask that you implement an interface that will be rendered in a [modal](https://blog.hubspot.com/website/modal-web-design#:~:text=What%20is%20a%20modal?) / pop-up.

Extension UI is implemented using the [Svelte Frontend Framework](https://svelte.dev/).

Please first make sure you've satisfied [Svelte Dependency](https://github.com/mitmedialab/prg-extension-boilerplate#svelte-only-if-you-are-developing-ui).

To generate a new svelte file, run the following command:

```bash
npm run add:ui <extension folder>
# For example: npm run add:ui myExtension
```

If succesful, the above command will point you to a generated file with the `.svelte` file-extension that lives inside of your extension's directory.

Feel free to change the name of this file to match it's intended usage, e.g. `Editor.svelte` or `AddItem.svelte` 

> **NOTE:** The convention is to use [Pascal Case](https://www.theserverside.com/definition/Pascal-case) to name svelte files, so they often start with a capital letter (unlike `.js` or `.ts` files).

### Open UI Using a Button

The most common (and recommended) way to open UI via your extension is to (1) implement a `ButtonBlock` and (2) invoke the Extension function `openUI` within the block's `operation` (which will be called when the button is clicked).

To do so, first declare a `ButtonBlock`, e.g.:

```ts
import { ButtonBlock } from "$common";

type Blocks = {
    otherBlock: () => void;
    someButton: ButtonBlock;
}

class ExampleExtension extends Extension<Details, Blocks> {
    ...
}

```

Next, implement the `ButtonBlock` definition inside of the object returned by the `defineBlocks` function. As usual, the defintion of the `ButtonBlock` is a function that returns an object containing all of the details needed to define the block. 

Most importantly, within the `operation` function of the block's definition, the function `openUI` should be invoked (which is implemented on the base `Extension` class, and can therefore be invoked using the reference to the Extension passed as the only argument to the block definition function, i.e. `self` below).

For example:
```ts
class ExampleExtension extends Extension<Details, Blocks> {
    ...
    defineBlocks(): ExampleExtension["BlockDefinitions"] {
        return {
            ...,
            someButton: (self: ExampleExtension) => ({
                type: BlockType.Button,
                text: `Button Text Goes Here`,
                operation: () => self.openUI("SvelteFileName", "Title of Window")
            })
        }
    }
}

```

The first argument is the name of the `.svelte` file in which your UI is implemented -- this name must match your filename exactly (but you can omit the `.svelte` extension).

The second argument is the title that will display at the top of the modal window. If omitted, this will default to the name of your extension.

## Testing Extensions

Writing tests is an important part of creating maintainable software. 

In addition to identifying bugs during an initial implementation or after a refactor, tests can serve to document your code and demonstrate its usage.

Extension test suites will make use of the `createTestSuite` utility function implemented in `extensions/testing/index.ts` (available under the alias `$testing`).

[https://github.com/mitmedialab/prg-extension-boilerplate/blob/dev/extensions/src/common/documentation/testing/index.ts#L2-L16
](https://github.com/mitmedialab/prg-extension-boilerplate/blob/872343812e6ebdfb9c1e2a5b682a6bfbf3a3d5eb/extensions/src/common/documentation/testing/index.ts#L2-L16)

For example:

```ts
import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname },
  {
    unitTests: {
        // tests go here
    },
    integrationTests: {
        // tests go here
    }
  }
);
```

As is clear from the second argument of the `createTestSuite` function, there are two different types of tests:

### Unit Tests



Specifically for extensions, `unit tests` test the operation of a single block. 

A unit test for a block is defined as an entry in the `unitTests` object whose key is the name of the block (as defined in the second generic parameter of the Extension class).

```ts
// Inside index.ts

export default class ExtensionUnderTest extends Extension<..., {
    myBlock: (input: string) => void,
}> {
    ....
}
```

```ts
// Inside index.test.ts
import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname },
  {
    unitTests: {
        myBlock: {
            ...
            // Test details go here
        }
    },
    ....
  }
);
```

You can either provide a single test case, or an array of test cases.

```ts
unitTests: {
    myBlock: {
        ...
        // Test details go here
    }
}
```

```ts
unitTests: {
    myBlock: [{
        ...
        // Test details go here
    },
    {
        ...
        // Test details go here
    },
    ]
}
```


### Integration Tests

Specifically for extensions, `integration tests` test either the operations of multiple blocks or how one extension interacts with another.

TODO

### Testing UI

The testing framework allows you to interact with UI opened by blocks under test.

TODO

## 🔀 Porting an Extension to use our Framework & Typescript

*Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation?* **Great!**

Here's how:

1. Identify the following details of the "old" extension / the extension you want to port (if you're having trouble finding any, skip around to see if finding one detail helps you identify where to specifically to look for another):
    - ***Implementation***: Where the extension is actually implemented in [vanilla js](https://www.javatpoint.com/what-is-vanilla-javascript)
        - This should be in some folder inside of [packages/scratch-vm/src/extensions/](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-vm/src/extensions)
        - Each extension implemenation folder will have at least an `index.js` file as this is responsible for exporting a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) definition (and this class can actually be thought of as the extension)
    - ***Extension ID***: The unique identifier of the extension used by the [Scratch Virtual Machine](https://github.com/LLK/scratch-vm/) to "look up" the extension:
        - You can find this inside of the [packages/scratch-vm/src/extension-support/extension-manager.js](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-vm/src/extension-support/extension-manager.js) file within the declaration of the `builtinExtensions` object (somewhere near the top of the file)
        - The `builtinExtensions` object has keys corresponding to ***Extension ID***s and their value is a function that `requires` (or loads in) the corresponding ***Implementation***
    - ***Extension Menu Entry***: The details that define how an extension displays inside of the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions) (see "Adding Extensions") and effectively connects the the [GUI](https://github.com/LLK/scratch-gui) that the user sees with the [Virtual Machine](https://github.com/LLK/scratch-vm/) that controls executing extension blocks
        - You will find this in one of the objects within the array exported by [packages/scratch-gui/src/lib/libraries/extensions/index.jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-gui/src/lib/libraries/extensions/index.jsx)
        - To locate the object that corresponds to the extension you want to port, you can use the ***Extension ID*** (if you have it) which corresponds to the `extensionId` field, or you can use the name or description of the extension you see in the Extensions Menu of the [live site](https://playground.raise.mit.edu/main/) which (you guessed it) correspond to the `name` and `description` fields, respectively
2. Create your "new" framework-based extension using the command outlined in [Making an Extension](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main#-making-an-extension) and use the ***Extension ID*** you found in step 1 as the value of `<folder to contain extension>`
    - For example, if your "old" extension's ***Extension ID*** is `prgRocks` you'll run the following command:
    ```bash
    npm run new:extesnion prgRocks
    ``` 
    - The reason this is necessary is two-fold: First, in the new extension framework, the name of the folder that contains an extension is automatically used as its ***Extension ID***. Second, because already saved `.sb3` / Scratch projects that use your extension refernce the specific ***Extension ID***, we need to make sure our updated, typescript-based extension has the same ID.
3. Once you have created an extension with a folder name matching the ***Extension ID*** found in step 1, you can actually delete the corresponding entry inside of the `builtinExtensions` object of [packages/scratch-vm/src/extension-support/extension-manager.js](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-vm/src/extension-support/extension-manager.js)
    - This means that now when someone clicks on your extension from the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions), it will load your new extension and not the old one.
4. Use the details of the ***Extension Menu Entry*** to fill out the the details of the first generic parameter of the `Extension<..., ...>` class inside of the `index.ts` file that was created by the command in Step 2.
    - If that seems confusing, just go look inside of the `index.ts` and hopefully the documentation should make this more clear
    - Copy over text and boolean values (excluding the `extensionId` field)
    - For things like icons (which are likely imported), copy/move those files into your new extension folder and delete them from their old location
5. Once you migrate all ***Extension Menu Entry*** details to your new extension, you can remove the ***Extension Menu Entry*** object from the array exported by [packages/scratch-gui/src/lib/libraries/extensions/index.jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-gui/src/lib/libraries/extensions/index.jsx)
    - You can do this as the extension framework will automatically handle adding your extension (and its Extension Menu Display Details) to the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions)
6. Now you can start coding! See the below comparison of a vanilla JS extension class and a typescript / framework based one.
7. Once you have migrated all of the "old" ***Impementation*** to your new extension folder & typescript code, you can go ahead and delete the ***Implementation*** folder inside of [pacakges/scratch-vm/src/extensions/](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-vm/src/extensions).
8. Now, there should be no remnants of the "old" extension inside of either [packages/scratch-vm](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-vm) or [packages/scratch-gui](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-gui) folders, and instead everything lives neatly inside its own directory within [extensions/src](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions/src)


### Vanilla JS

Below is a sample, vanilla JS extension based on the final example provided in the [Scratch Extensions document](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md). 

What's not captured in the below example is all the additional work necessary to get the extension to show up (hinted at above), which includes:
- Updating [extension library jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71)
- Updating [extension manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-vm/src/extension-support/extension-manager.js#L11) to support this extension 

Every step of this process is not typesafe, and thus very error prone.

```js
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const formatMessage = require('format-message');

class SomeBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: 'someBlocks',

            // Core extensions only: override the default extension block colors.
            color1: '#FF8C1A',
            color2: '#DB6E00',
            
            name: formatMessage({
                id: 'extensionName',
                defaultMessage: 'Some Blocks',
                description: 'The name of the "Some Blocks" extension'
            }),

            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            blocks: [
                {
                    opcode: 'myReporter', 
                    blockType: BlockType.REPORTER,
                    branchCount: 0,
                    terminal: true,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myReporter',
                        defaultMessage: 'letter [LETTER_NUM] of [TEXT]',
                        description: 'Label on the "myReporter" block'
                    }),
                    arguments: {
                        LETTER_NUM: {
                            type: ArgumentType.NUMBER,
                            default: 1
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            default: formatMessage({
                                id: 'myReporter.TEXT_default',
                                defaultMessage: 'text',
                                description: 'Default for "TEXT" argument of "someBlocks.myReporter"'
                            }),
                            menu: 'menuA'
                        }
                    },

                    func: 'myReporter',
                    filter: [TargetType.SPRITE]
                }
            ],
            menus: {
                menuA: [
                    {
                        value: 'itemId1',
                        text: formatMessage({
                            id: 'menuA_item1',
                            defaultMessage: 'Item One',
                            description: 'Label for item 1 of menu A in "Some Blocks" extension'
                        })
                    },
                    'itemId2'
                ]
            },
        };
    };
    
    myReporter (args) {
        const message = formatMessage({
            id: 'myReporter.result',
            defaultMessage: 'Letter {LETTER_NUM} of {TEXT} is {LETTER}.',
            description: 'The text template for the "myReporter" block result'
        });

        const result = args.TEXT.charAt(args.LETTER_NUM);

        return message.format({
            LETTER_NUM: args.LETTER_NUM,
            TEXT: args.TEXT,
            LETTER: result
        });
    };
}
```

### Typescript Extension Framework

Things to note:
- The `Details` type object encodes how the extension will be displayed in the extensions menu
    - No more editing [any jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71) to specify how your extension should display in the Extensions Menu
    - Now your image assets related to your extension should reside in the same place as your implementation (i.e. in the same directory as the `index.ts` file)
- Any index.ts file within a subfolder of the [extensions directory](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-vm/src/extensions) will be assumed to implement an extension
    - This means there's no need to specify your extension in the [extension-manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/packages/scratch-vm/src/extension-support/extension-manager.js#L11)
- All Block text is automatically formatted for translation
    - How to actually specify these translations is coming soon! 
    - Translations for extensions are not actually supported via Scratch out of the box, so enabling this for all extensions is a win for the Typescript Framework!
- Fields not yet supported (but will be for official release):
    - [filter](https://github.com/mitmedialab/prg-extension-boilerplate/issues/163)
    - [branchCount](https://github.com/mitmedialab/prg-extension-boilerplate/issues/168)

```ts
import Runtime from "$scratch-vm/engine/runtime";
import { Extension, ArgumentType, BlockType, Environment } from "$common";
import formatMessage from 'format-message';

type Details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
  iconURL: "example.png", 
  insetIconURL: "inset.png"
};

class SomeBlocks extends Extension<Details, {
  myReporter: (text: string, letterNum: number) => string;
}> {

  runtime: Runtime;

  init(env: Environment) {
    this.runtime = env.runtime;
  }

  defineBlocks(): SomeBlocks["BlockDefinitions"] {
    return {
      myReporter: (self: SomeBlocks) => ({
        type: BlockType.Reporter,
        args: [
          { 
            type: ArgumentType.String, 
            defaultValue: 'text', 
            options: [
                { text: 'Item One', value: 'itemId1' }, 
                'itemId2'
            ] 
          },
          { type: ArgumentType.Number, defaultValue: 1 }
        ],
        text: (text, letterNum) => `letter ${letterNum} of ${text}'`,
        operation: (text, letterNum, util) => {

          const message = formatMessage({
            id: 'myReporter.result',
            default: 'Letter {letterNum} of {text} is {result}.',
            description: 'The text template for the "myReporter" block result'
          });

          const result = text.charAt(letterNum);
          
          // This doesn't actually work/compile -- perhaps the formatMessage API changed since the Scratch example was made
          return message.format({ text, letterNum, result });
        }
      })
    }
  }
}
```

## Reference

### How Everything Fits Together
```mermaid
sequenceDiagram
    participant root as /
    participant A as /extensions/
    participant B as /packages/scratch-gui/
    participant C as /packages/scratch-vm/
    Note over root,C: INITIALIZATION
    C-->>B: Lerna utility forces scratch-gui <br>to use /packages/scratch-vm for its dependency <br>instead of using the external npm package
    Note over root,C: BUILD
    Note over root: /scripts/build.ts
    activate root
    root->>A: Execute /extensions/scripts/bundle.ts
    activate A
    A->>A: Locate extension directories in <br> /extensions/src/
    A->>A: Bundle each extension using rollup
    A->>B: Write code bundles to <br> ...scratch-gui/static/extension-bundles
    A->>B: Generate entries for Extensions Menu in <br>...scratch-gui/src/generated
    A->>root: Signal that bundles are ready
    alt if watch
        A->>A: Re-bundle on code change
        A->>B: Changes to static and/or generated files <br>triggers dev server refresh
    end
    deactivate A
    root->>B: Execute Webpack using ...scratch-gui/webpack.config.js
    activate B
    Note over B,C: Webpack bundles together everything <br>other than extensions
    alt if watch
        Note over B: Start webpack development server
    else 
        B->>B: Code bundle written to <br>...scratch-gui/build
        B->>root: Move code bundle to /build/
    end
    deactivate B
    deactivate root
    Note over root,C: RUNTIME
    Note over B: User clicks on item in Extensions Menu
    B->>C: Request to open extension with specific ID
    activate C
    Note over C: See <br>....scratch-vm/src/extension-support/bundle-loader.js
    C->>B: Retrieve appropriate extension bundle from <br> (url) static/extension-bundles/
    deactivate C
```
