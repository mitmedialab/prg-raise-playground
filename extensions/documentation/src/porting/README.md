[](order=2)
## Porting an Extension to use our Framework & Typescript

*Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation?* **Great!**

Here's how:

0. Before beginning the port, save off a project using your old extension which utilizes every one of its blocks. Once you're done porting, if this project can be reloaded and executed the same as before, you'll know you've done your job!
1. Identify the following details of the "old" extension / the extension you want to port (if you're having trouble finding any, skip around to see if finding one detail helps you identify where to specifically to look for another):
    - ***Implementation***: Where the extension is actually implemented in [vanilla js](https://www.javatpoint.com/what-is-vanilla-javascript)
        - This should be in some folder inside of [scratch-packages/scratch-vm/src/extensions/](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/scratch-packages/scratch-vm/src/extensions)
        - Each extension implemenation folder will have at least an `index.js` file as this is responsible for exporting a [class declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) (and this class can actually be thought of as the extension)
    - ***Extension ID***: The unique identifier of the extension used by the [Scratch Virtual Machine](https://github.com/LLK/scratch-vm/) to "look up" the extension:
        - You can find this inside of the [scratch-packages/scratch-vm/src/extension-support/extension-manager.js](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-vm/src/extension-support/extension-manager.js) file within the declaration of the `builtinExtensions` object (somewhere near the top of the file)
        - The `builtinExtensions` object has keys corresponding to ***Extension ID***s and their value is a function that `requires` (or "loads in", see [CommonJS Modules](https://nodejs.org/api/modules.html#modules-commonjs-modules)) the corresponding ***Implementation***
    - ***Extension Menu Entry***: The details that define how an extension displays inside of the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions) (see "Adding Extensions") and effectively connects the the [GUI](https://github.com/LLK/scratch-gui) that the user sees with the [Virtual Machine](https://github.com/LLK/scratch-vm/) that controls executing extension blocks
        - You will find this in one of the objects within the array exported by [scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx)
        - To locate the object that corresponds to the extension you want to port, you can use the ***Extension ID*** (if you have it) which corresponds to the `extensionId` field, or you can use the name or description of the extension you see in the Extensions Menu of the [live site](https://playground.raise.mit.edu/main/) which (you guessed it) correspond to the `name` and `description` fields, respectively
2. Create your "new" framework-based extension using the command outlined in [Making an Extension](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main#-making-an-extension) and use the ***Extension ID*** you found in step 1 as the value of `<folder to contain extension>`
    - For example, if your "old" extension's ***Extension ID*** is `prgRocks` you'll run the following command:
    ```bash
    pnpm new:extension prgRocks
    ``` 
    - The reason this is necessary is two-fold: First, in the new extension framework, the name of the folder that contains an extension is automatically used as its ***Extension ID***. Second, because already saved `.sb3` / Scratch projects that use your extension refernce the specific ***Extension ID***, we need to make sure our updated, typescript-based extension has the same ID.
3. Once you have created an extension with a folder name matching the ***Extension ID*** found in step 1, you can actually delete the corresponding entry inside of the `builtinExtensions` object of [scratch-packages/scratch-vm/src/extension-support/extension-manager.js](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-vm/src/extension-support/extension-manager.js)
    - This means that now when someone clicks on your extension from the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions), it will load your new extension and not the old one.
4. Use the details of the ***Extension Menu Entry*** to fill out the the details of the first generic parameter of the `Extension<..., ...>` class inside of the `index.ts` file that was created by the command in Step 2.
    - If that seems confusing, just go look inside of the `index.ts` and hopefully the documentation should make this more clear
    - Copy over text and boolean values (excluding the `extensionId` field)
    - For things like icons (which are likely imported), copy/move those files into your new extension folder and delete them from their old location
5. Once you migrate all ***Extension Menu Entry*** details to your new extension, you can remove the ***Extension Menu Entry*** object from the array exported by [scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx)
    - You can do this as the extension framework will automatically handle adding your extension (and its Extension Menu Display Details) to the [Extension Menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions)
6. Now you can start coding! See the below comparison of a vanilla JS extension class and a typescript / framework based one.
    - NOTE: If there's a chance anyone has saved projects with the extension you're porting over, you need to make sure to follow the [Legacy Support](#legacy-support) instructions so those saved projects will continue to load correctly.
7. Once you have migrated all of the "old" ***Impementation*** to your new extension folder & typescript code, you can go ahead and delete the ***Implementation*** folder inside of [scratch-packages/scratch-vm/src/extensions/](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/scratch-packages/scratch-vm/src/extensions).
8. Now, there should be no remnants of the "old" extension inside of either [scratch-packages/scratch-vm](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/scratch-packages/scratch-vm) or [scratch-packages/scratch-gui](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/scratch-packages/scratch-gui) folders, and instead everything lives neatly inside its own directory within [extensions/src](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions/src)
9. Test out the project you saved in step 0 to verify that your port worked as expected.

### Implementing an Extension in Vanilla JS vs the Extension Framework

Below you can compare what an extension that was originally implemented in vanilla javascript would look like rewritten in Typescript leveraging the Extension Framework. 

#### Vanilla JS

Below is a sample, vanilla JS extension based on the final example provided in the [Scratch Extensions document](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md). 

What's not captured in the below example is all the additional work necessary to get the extension to show up (hinted at above), which includes:
- Updating [extension library jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71)
- Updating [extension manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-vm/src/extension-support/extension-manager.js#L11) to support this extension 

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

#### Typescript / Extension Framework

Things to note about the below typescript snippet:
- The object passed to the `extensions` type object encodes how the extension will be displayed in the extensions menu
    - No more editing [any jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71) to specify how your extension should display in the Extensions Menu
    - Now your image assets related to your extension should reside in the same place as your implementation (i.e. in the same directory as the `index.ts` file)
- Any index.ts file within a subfolder of the [extensions directory](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/scratch-packages/scratch-vm/src/extensions) will be assumed to implement an extension
    - This means there's no need to specify your extension in the [extension-manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/scratch-packages/scratch-vm/src/extension-support/extension-manager.js#L11)
- All Block text is automatically formatted for translation
    - How to actually specify these translations is coming soon! 
    - Translations for extensions are not actually supported via Scratch out of the box, so enabling this for all extensions is a win for the Typescript Framework!
- Fields not yet supported (but will be for official release):
    - [filter](https://github.com/mitmedialab/prg-extension-boilerplate/issues/163)
    - [branchCount](https://github.com/mitmedialab/prg-extension-boilerplate/issues/168)

[](./example.ts)

### Legacy Support

One thing that makes adopting the new Extension Framework slightlier tricker is the need to support 'old' projects. In other words, any projects saved using the old, vanilla-javascript extension should / ***must*** continue to work once you port the extension over to the Framework.

In order to make this as simple as possible, we've developed a utility that is able to extract necessary block info from the object returned by the old `getInfo` method -- this method defines the behavior of vanilla-javascript extensions and their blocks. 

This information can then be used when defining blocks. You'll use this for every block that is present in the old extension (and thus might be used in an already saved project). 

You're free to define additional blocks in your ported over extension, but you must support all blocks defined in the old extension with the method demonstrated below:

Here's how: 

1. Load up the [deployed site](https://playground.raise.mit.edu/dev/) which should include the 'old' extension you're working to port over. 
2. First, add in the `Extension Probe` extension using the [extensions menu](https://en.scratch-wiki.info/wiki/Extension#Adding_Extensions).
3. Next, add the extension you're porting over. 
4. Scroll back up to the blocks of the `Extension Probe` and execute the "Get Legacy Support" block (ensure that the block's input field is set to your extension's ID).
    - This will download a file called `legacy.ts` to your computer
    - After approving the download, follow the instructions in the popped-up UI to understand how to make use of the file. An example is included below. 

#### Usage of `legacy.ts`

The downloaded `legacy.ts` file should look something like the following:

[](./legacy.ts?export=extract)

**IMPORTANT!** Do not edit the `legacy.ts` file (unless you really know what you're doing).

Now that we've obtained the return of `legacy.ts`, we can make use of it's exports when defining our extension and its blocks like so: 

[](./ported.ts)

<details>
<summary>Already implemented your extension using the old "generics" method? Drop this down to see how you can use the legacy.ts info.
</summary>

[](./ported.generic.ts)

</details>