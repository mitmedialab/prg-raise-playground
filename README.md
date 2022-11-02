# ✨ PRG Scratch Extension Development Environment

This repository is your one-stop-shop for developing [scratch extensions](https://en.scratch-wiki.info/wiki/Extension) for PRG curricula.

It's a fullblown [fork](https://en.wikipedia.org/wiki/Fork_(software_development)) of the official Scratch codebase, which the [Personal Robotics Group](https://robots.media.mit.edu/) (PRG) manages and extends to meet its needs. 

Looking for the old documentation (<= Sept. 2022)? Head [here](./BACKGROUND.md).

## 📖 Table of Contents
- [Quick Start](#-quick-start)
    - [Project setup](#-project-setup)
    - [Making an extension](#-making-an-extension)
        - [Advanced](#-advanced)
    - [Running an extension](#-running-an-extension)
    - [Committing, pushing, and deploying an extension](#-committing-pushing-and-deploying-an-extension)
- [How to program an extension](#-how-to-program-an-extension)
    - [*"I have an `index.ts` file.. now what?"*](#i-have-an-indexts-file-now-what)
    - [From 0 to Extension](#-from-0-to-extension)
    - [Porting an Extension to Typescript](#-porting-an-extension-to-typescript)
- [Project Dependencies](#project-dependencies)
    - [Git](#git)
    - [Node](#node)
    - [NPM](#NPM)
    - [VS Code](#vs-code-recommended) 
- [Troubleshooting](#-Troubleshooting)
    - [webpack: command not found](#webpack-command-not-found)

## ⚡ Quick Start

This section contains concise explanations on how to accomplish something (often just a couple of commands to run). If you need more info please check out one of the lower sections. 

### 🚧 Project setup

Assuming you have...
- Git installed (if not, jump to: [Git](#Git))
- Node <=16 is installed (if not, jump to: [Node](#Node))
- NPM >= 8.3.0 installed (if not, jump to: [NPM](#NPM))
- VS Code installed with Typescript Extension added (if not, jump to: [Vs Code](#VS-Code-(Recommended)))

Run the following from the command line:

```shell script
git clone git@github.com:mitmedialab/prg-extension-boilerplate.git
# Clone the repository onto your computer. This could take a while (~5m), grab a beverage!

cd prg-extension-boilerplate/
# Change directory (cd) to the repository

git checkout beta 
# Checkout beta branch -- NOTE: in the future, you'll actually checkout the dev or main branches, but we're using the beta branch for this trial

npm run init
# This will symlink the packages together to allow for seamless local development, and installs dependencies for each package. 
# This should only need to be ran once (unless you checkout a branch that adds new package dependencies).
# Takes ~1.5 minutes

npm run dev
# This starts up a development server, serving all the currently implemented extensions.
# It takes about ~20s to initially startup and serve everything.
# Open http://localhost:8601/ in your browser (keep refreshing if nothing's coming up)
```

### 🔨 Making an extension

To make a new extension, run the following commands:

```shell script
cd prg-extension-boilerplate/ # If not already there
# Change directory (cd) to prg-extension-boilerplate/ 

git checkout beta # Checkout beta branch -- NOTE: in the future, you'll actually checkout the dev branch, but we're using the beta branch for this trial
git pull # Update branch with any remote changes
git checkout -b <my branch> # Checkout your 'feature' branch, e.g. git checkout -b my_awesome_extension
# For example: git checkout -b new_rad_extension

npm run new:extension <folder to contain extension>
# For example: npm run new:extension my_awesome_extension
# If succesful, the output of this command will tell you where to find your new extension file.
# It will be an index.ts file, and its documentation should help you get started
```

#### 🥋 Advanced

If you're a pro extension-maker, use the following command to make a new extension that contains no documentation and/or filler text. 

```shell script
npm run new:extension <folder to contain extension> barebones 
# Note the 'barenones' at the end
```

### 🏃 Running an extension

After you've [made your extension](#-making-an-extension), run the following commands to serve it locally and view it in your browser. 

```shell script
cd prg-extension-boilerplate/ # If not already there
# Change directory (cd) to prg-extension-boilerplate/ 

npm run dev
# Start a development server to view your extension and reload it as you make changes
# This command will take ~20s to startup and serve everything to http://localhost:8601/
```

Then, after navigating to http://localhost:8601/, follow the 'Adding Extensions' guidance in the [official extension documentation](https://en.scratch-wiki.info/wiki/Extension) to add your extension to the workspace. 

As long as the development server is running (meaning the `npm run dev` command is still executing), every change you make to the extension file(s) will trigger the page to refresh and your changes will be reflected automagically 🪄. 

### 📦 Committing, pushing, and deploying an extension 

... Coming soon ... shouldn't be necessary for the beta test.

## 🔎 How to program an extension

### *"I have an `index.ts` file.. now what?"*

Once you've [created your extension](#-making-an-extension) and opened the corresponding `index.ts` file in VS Code, you might be wondering where to start. 

First, read through the documentation of the `index.ts` file (written inside of [code comments](https://www.w3schools.com/js/js_comments.asp)). 

Also, try hovering over fields to view their documentation (typically a [summary](https://jsdoc.app/tags-summary.html), [examples](https://jsdoc.app/tags-example.html), and a [longer desrciption](https://jsdoc.app/tags-description.html)).

![Gif of video hovering over fields to peak documentation](/assets/hover.gif)

Still stuck? Check out our [From 0 to Extension guide](#-from-0-to-extension) and/or contact more experienced Scratch developers, like [Parker](https://github.com/pmalacho-mit) or [Randi](https://github.com/randi-c-dubs)

### 🪜 From 0 to Extension

... Coming soon ... (will incorporate feedback from beta test)

Currently, depending on what's new to you, here are some recommendations:
- ***New to Javascript and Typescript?*** Follow this [javascript tutorial](https://www.w3schools.com/js/) and then check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- ***Know javascript but new to Typescript?*** Check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- ***Know javascript/typescript but never made an extension before?*** Nice! The documentation of the template `index.ts` should be enough to get you started (and if not, please give that feedback)
- ***New to the extension framework (but had developed extensions in the past)?*** The [Porting an extension to Typescript guide](#-porting-an-extension-to-typescript) is likely for you!

Probably will have:
- Full step-by-step guide on:
    - What is an extension?
    - How do you make one using the typescript framework
- Video tutorial 
- FAQ?

### 🎨 Adding UI

```bash
npm run add:ui <extension folder>
# For example: npm run add:ui myExtension
```

### 🔀 Porting an Extension to Typescript

*Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation?* **Great!**

Please check out the below example to get a good idea of what this would look like:

#### Vanilla JS

Below is a sample, vanilla JS extension based on the final example provided in the [Scratch Extensions document](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md). 

What's not captured in the below example is all the additional work necessary to get the extension to show up, which includes:
- Updating [extension library jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/5ec7cca7e1827da49c2faaf173706fc19874a3a1/packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71)
- Updating [extension manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/5ec7cca7e1827da49c2faaf173706fc19874a3a1/packages/scratch-vm/src/extension-support/extension-manager.js#L11) to support this extension 

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

#### Typescript Extension Framework

Things to note:
- The `Details` type object encodes how the extension will be displayed in the extensions menu
    - No more editing [any jsx](https://github.com/mitmedialab/prg-extension-boilerplate/blob/5ec7cca7e1827da49c2faaf173706fc19874a3a1/packages/scratch-gui/src/lib/libraries/extensions/index.jsx#L71) to specify how your extension should display in the Extensions Menu
    - Now your image assets related to your extension should reside in the same place as your implementation (i.e. in the same directory as the `index.ts` file)
- Any index.ts file within a subfolder of the [extensions directory](https://github.com/mitmedialab/prg-extension-boilerplate/tree/main/packages/scratch-vm/src/extensions) will be assumed to implement an extension
    - This means there's no need to specify your extension in the [extension-manager](https://github.com/mitmedialab/prg-extension-boilerplate/blob/5ec7cca7e1827da49c2faaf173706fc19874a3a1/packages/scratch-vm/src/extension-support/extension-manager.js#L11)
- All Block text is automatically formatted for translation
    - How to actually specify these translations is coming soon! 
    - Translations for extensions are not actually supported via Scratch out of the box, so enabling this for all extensions is a win for the Typescript Framework!
- Fields not yet supported (but will be for official release):
    - [filter](https://github.com/mitmedialab/prg-extension-boilerplate/issues/163)
    - [branchCount](https://github.com/mitmedialab/prg-extension-boilerplate/issues/168)

```ts
import Runtime from "../../engine/runtime";
import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment } from "../../typescript-support/types";
import defineTranslations from "./translations";
import formatMessage = require('format-message');

type Details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
  iconURL: "example.png", // Relative path to image file (which you need to add, likely at the same level as the index.ts file) -- Used for extensions menu, but NOT 'menuIconURI'
  insetIconURL: "inset.png" // Relative path to image file (which you need to add, likely at the same level as the index.ts file) -- Will automatically be used as the blockIconURI
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

  defineTranslations = defineTranslations;
}

export = SomeBlocks;
```

## ⛓️ Dependencies

### Git

Please [install git](https://git-scm.com/downloads), which helps us with [source control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) -- basically, how we preserve and share (changes to) the code. 

### Node

Like many web development projects, this project requires [node](https://nodejs.org/en/).

Also, [due to a Webpack 4 issue](https://github.com/webpack/webpack/issues/14532), we require a node version <=16.

Please follow [these instructions](https://nodejs.org/en/download/) to install a suitable version of Node on your machine.

#### Maintainer Note (9/15/22)

> In October 2022, node 18 LTS will be released, making it slightly harder to get node 16 LTS. 
Before then, we either need to upgrade webpack to be able to use node 18, or revise the above instructions to help users locate node 16.

### NPM

[NPM](https://www.npmjs.com/) (Node Package Manager) is a [package manager](https://en.wikipedia.org/wiki/Package_manager) that is *usually* automatically installed with [Node](#Node). 

This project requires you to have NPM version ***8.3.0*** or later (in order to leverage [overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides)).

Please follow [these instructions](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) to check which version of NPM you have and upgrade it if it's older than ***8.3.0***.

### VS Code (Recommended)

We encourage you to use VS Code since it has great Typescript support. Also, it's easier to offer tips and tricks if most of us use the same text editor.

Here's how to [install VS Code](https://code.visualstudio.com/download).

Of course, if you prefer a different editor, go ahead and use it (but do so at your own 'risk').  

#### Extensions

We recommend adding the following VS Code extensions (which you can do [like so](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-an-extension)):

- [Typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## 🤔 Troubleshooting

#### webpack: command not found
If you see the following:

```shell script
> scratch-render@0.1.0 build /Users/brian/code/aied/test/test2/packages/scratch-render
> webpack --progress --colors
sh: webpack: command not found
```

This may mean you have a half-installed node_modules version of webpack. Try starting [fresh](#-project-setup)!
