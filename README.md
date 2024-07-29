# ✨ PRG RAISE Playground

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev)

This repository is your one-stop-shop for developing [scratch extensions](https://en.scratch-wiki.info/wiki/Extension) for PRG curricula.

It [forks](https://en.wikipedia.org/wiki/Fork_(software_development)) a few of the official Scratch codebases, which the [Personal Robotics Group](https://robots.media.mit.edu/) (PRG) manages and extends to meet its needs. These exist as [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) located inside of the [scratch-packages/](./scratch-packages/) folder.
- [scratch-packages/scratch-gui/](./scratch-packages/scratch-gui/)
    - [prg-raise-playground-scratch-gui](https://github.com/mitmedialab/prg-raise-playground-scratch-gui) forks the [scratch-gui](https://github.com/scratchfoundation/scratch-gui) package. See [our changes](https://github.com/mitmedialab/prg-raise-playground-scratch-gui/pull/7).
- [scratch-packages/scratch-vm/](./scratch-packages/scratch-vm/)
    - [prg-raise-playground-scratch-vm](https://github.com/mitmedialab/prg-raise-playground-scratch-vm) forks the [scratch-vm](https://github.com/scratchfoundation/scratch-vm) package. See [our changes](https://github.com/mitmedialab/prg-raise-playground-scratch-vm/pull/2).

Looking for the old documentation (<= Sept. 2022)? Head [here](./BACKGROUND.md).

## 📖 Table of Contents

[Click on the ⁝≡ icon above](https://github.blog/changelog/2021-04-13-table-of-contents-support-in-markdown-files/)

## ⚡ Quick Start

This section contains concise explanations on how to accomplish something (often just a couple of [terminal commands](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line) to run). If you need more info please check out one of the lower sections. 

### 🚧 Project setup

Assuming you have...
- Git installed (if not, jump to: [Git](#Git))
- **_(Windows only)_** WSL setup (if not, jump to: [Windows Setup](#windows-only))
- Node is installed (if not, jump to: [Node](#Node))
- PNPM is installed: [PNPM](#PNPM)
- VS Code installed with Typescript Extension added (if not, jump to: [Vs Code](#VS-Code-(Recommended)))

Run the following from the command line:

(**NOTE:** If using gitpod, this all will be done for you on startup)

```shell script
git clone --recurse-submodules git@github.com:mitmedialab/prg-extension-boilerplate.git
# Clone the repository (including git submodules: scratch-gui and scratch-vm) onto your computer. This could take a while (~5m), grab a beverage!

cd prg-extension-boilerplate/
# Change directory (cd) to the repository

git checkout dev 

pnpm install
# This will symlink the packages together to allow for seamless local development, and installs dependencies for each package. 
# This should only need to be ran once (unless you checkout a branch that adds new package dependencies).
# Takes ~1.5 minutes the first time it runs, and is much quicker (a few seconds) for later installs / updates

pnpm dev -i examples
# This starts up a development server, serving the two "example" extensions.
# It takes about ~20s to initially startup and serve everything.
# Open http://localhost:8601/ in your browser (keep refreshing if nothing's coming up)
```

### 🔨 Making an extension

To make a new extension, run the following commands:

```shell script
cd prg-extension-boilerplate/ # If not already there
# Change directory (cd) to prg-extension-boilerplate/ 

git checkout dev
git pull # Update branch with any remote changes
git checkout -b <my branch> # Checkout your 'feature' branch, e.g. git checkout -b new_rad_extension

pnpm new:extension <folder to contain extension>
# For example: pnpm new:extension my_awesome_extension
# If succesful, the output of this command will tell you where to find your new extension file.
# It will be an index.ts file, and its documentation should help you get started
```

#### 🥋 Advanced

If you're a pro extension-maker, use the following command to make a new extension that contains no documentation and/or filler text. 

```shell script
pnpm new:extension <folder to contain extension> barebones 
# Note the 'barenones' at the end
```

### 🏃 Running an extension

After you've [made your extension](#-making-an-extension), run the following commands to serve it locally and view it in your browser. 

```shell script
cd prg-extension-boilerplate/ # If not already there
# Change directory (cd) to prg-extension-boilerplate/ 

pnpm dev -i <folder name of extension(s)>
# For example: pnpm dev -i my_awesome_extension
# Start a development server to view your extension and reload it as you make changes
# This command will take ~20s to startup and serve everything to http://localhost:8601/

# Note: you can use the '-i' shorthand instead of writing out '--include'
pnpm dev -i <folder name of extension(s)>

# Alternatively, serve all the currently implemented extensions
pnpm dev -i all
# NOTE: This will be much more intensive on your computer
```

Then, after navigating to http://localhost:8601/, follow the 'Adding Extensions' guidance in the [official extension documentation](https://en.scratch-wiki.info/wiki/Extension) to add your extension to the workspace. 

As long as the development server is running (meaning the `pnpm dev` command is still executing), every change you make to the extension file(s) will trigger the page to refresh and your changes will be reflected automagically 🪄. 

### 📦 Committing, pushing, and deploying an extension 

To learn how to manage git-tracking and deploying your extension, please head to the [CICD.md](./CI-CD.md) (continuous integration & continuous delivery / deployment) documentation.

## 🔎 How to program an extension

### *"I have an `index.ts` file.. now what?"*

Once you've [created your extension](#-making-an-extension) and opened the corresponding `index.ts` file in VS Code, you might be wondering where to start. 

First, read through the documentation of the `index.ts` file (written inside of [code comments](https://www.w3schools.com/js/js_comments.asp)). 

Also, try hovering over fields to view their documentation (typically a [summary](https://jsdoc.app/tags-summary.html), [examples](https://jsdoc.app/tags-example.html), and a [longer desrciption](https://jsdoc.app/tags-description.html)).

![Gif of video hovering over fields to peak documentation](//.assets/hover.gif)

Still stuck? Check out our [From 0 to Extension guide](#-from-0-to-extension) and/or contact more experienced extension developers, like [Parker](https://github.com/pmalacho-mit) or [Maya](https://github.com/mayarajan3)

### 🪜 From 0 to Extension

... Coming soon ...

Currently, depending on what's new to you, here are some recommendations:
- ***New to Javascript and Typescript?*** Follow this [javascript tutorial](https://www.w3schools.com/js/) and then check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- ***Know javascript but new to Typescript?*** Check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- ***Know javascript/typescript but never made an extension before?*** Nice! The documentation of the template `index.ts` should be enough to get you started (and if not, please give us that feedback)
- ***New to the extension framework (but had developed extensions in the past)?*** The [Porting an extension to Typescript guide](#-porting-an-extension-to-typescript) is likely for you!

Probably will have:
- Full step-by-step guide on:
    - What is an extension?
    - How do you make one using the typescript framework
- Video tutorial 
- FAQ?

### 🎨 Adding UI

An exciting feature of PRG's work to expand the Scratch Extension workflow is that you can easily create custom UIs for your extensions. 

We require you to implement this interface in the [Svelte front-end framework](https://svelte.dev/). Hop down to the [Svelte dependency](#svelte-only-if-you-are-developing-ui) to configure your development environment, understand why we chose svelte, and start learning the ropes.

Then, head over to the [Extension specific section on adding / developing UI](https://github.com/mitmedialab/prg-extension-boilerplate/blob/main/extensions/README.md#creating-ui-for-extensions).

## ⛓️ Dependencies

Not interested in setting up your local environemnt? 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev)

### Windows Only

Please setup and perform all commands through [Node on Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl).

### Git

Please [install git](https://git-scm.com/downloads), which helps us with [source control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) -- basically, how we preserve and share (changes to) the code. 

### Node

Like many web development projects, this project requires [node](https://nodejs.org/en/).

If you don't have Node installed, check out [this page](https://nodejs.org/en/download/package-manager) on how to download it.

#### Maintainer Note (9/15/22)

> In October 2022, node 18 LTS will be released, making it slightly harder to get node 16 LTS. 
Before then, we either need to upgrade webpack to be able to use node 18, or revise the above instructions to help users locate node 16.

### PNPM

[PNPM](https://pnpm.io/) (Performant Node Package Manager) is a [package manager](https://en.wikipedia.org/wiki/Package_manager) that enhances dependency management for JavaScript projects by storing package files globally and using symbolic links in the `node_modules` folder. This approach reduces disk space usage and maintains the module dependency tree, making it a faster and more space-efficient alternative to traditional package managers like [NPM](https://www.npmjs.com/), [Node](#Node)'s default package manager.

If you've already installed [Node](#Node), you'll likely have NPM automatically installed. Run the command below to install PNPM using NPM.
```shell script
npm install -g pnpm
```

If you don't have NPM, you can [follow these instructions](https://pnpm.io/installation) to install PNPM.

### VS Code (Recommended)

We encourage you to use VS Code since it has great Typescript support. Also, it's easier to offer tips and tricks if most of us use the same text editor.

Here's how to [install VS Code](https://code.visualstudio.com/download).

Of course, if you prefer a different editor, go ahead and use it (but do so at your own 'risk').  

#### Extensions

We recommend adding the following VS Code extensions (which you can do [like so](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-an-extension)):

- [Typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) (Only if you are developing custom UI for your extensions)

### Svelte (Only if you are developing UI)

If you will be implementing [custom UI windows](#-adding-ui) for your extension, you'll need to work with [Svelte](https://svelte.dev/). 

As noted above, you should install the [Svelte Vs Code Extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

If you're wondering why we chose Svelte, it's because:
- It offers a great typescript-developer expererience 
- It allows you to use a **single file** to define the css/html/javascript (or in our case, typescript) that makes up an interface
- *Just works* more often than other frameworks
- It is (debatebly) more beginner friendly than other frameworks, since there aren't as many advanced concepts to understand
    - But the tradeoff is you have to learn some svelte-specific concepts that you likely haven't seen anywhere else, like: [Reactive Assignments](https://svelte.dev/tutorial/reactive-assignments), [Reactive Statements](https://svelte.dev/tutorial/reactive-statements), [Bindings](https://svelte.dev/tutorial/text-inputs), etc. But these are all innovative concepts intended to make your life easier.

The best way to learn how to write Svelte is through following their [interactive tutorial](https://svelte.dev/tutorial/) (which takes ~2hrs total, but spending just 30 minutes on it would get you a long way).

## 🤔 Troubleshooting

#### webpack: command not found
If you see the following:

```shell script
> scratch-render@0.1.0 build /Users/brian/code/aied/test/test2/packages/scratch-render
> webpack --progress --colors
sh: webpack: command not found
```


This may mean you have a half-installed node_modules version of webpack. Try starting [fresh](#-project-setup)!

Note the [`LICENSE`](packages/scratch-gui/LICENSE)s and especially [`TRADEMARK`](packages/scratch-gui/TRADEMARK)s for each Scratch component project carefully — e.g., you may not use the Scratch name, logo, cat, etc. in derivative projects without permission.
