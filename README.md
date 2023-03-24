# ✨ PRG Scratch Extension Development Environment

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev)

This repository is your one-stop-shop for developing [scratch extensions](https://en.scratch-wiki.info/wiki/Extension) for PRG curricula.

It's a fullblown [fork](https://en.wikipedia.org/wiki/Fork_(software_development)) of the official Scratch codebase, which the [Personal Robotics Group](https://robots.media.mit.edu/) (PRG) manages and extends to meet its needs. 

Looking for the old documentation (<= Sept. 2022)? Head [here](./BACKGROUND.md).

## 📖 Table of Contents

[Click on the ⁝≡ icon above](https://github.blog/changelog/2021-04-13-table-of-contents-support-in-markdown-files/)

## ⚡ Quick Start

This section contains concise explanations on how to accomplish something (often just a couple of commands to run). If you need more info please check out one of the lower sections. 

### 🚧 Project setup

Assuming you have...
- Git installed (if not, jump to: [Git](#Git))
- **_(Windows only)_** WSL setup (if not, jump to: [Windows Setup](#windows-only))
- Node <=16 is installed (if not, jump to: [Node](#Node))
- NPM >= 8.3.0 installed (if not, jump to: [NPM](#NPM))
- VS Code installed with Typescript Extension added (if not, jump to: [Vs Code](#VS-Code-(Recommended)))

Run the following from the command line:

```shell script
git clone git@github.com:mitmedialab/prg-extension-boilerplate.git
# Clone the repository onto your computer. This could take a while (~5m), grab a beverage!

cd prg-extension-boilerplate/
# Change directory (cd) to the repository

git checkout dev 

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

git checkout dev
git pull # Update branch with any remote changes
git checkout -b <my branch> # Checkout your 'feature' branch, e.g. git checkout -b new_rad_extension

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

npm run dev only=<folder name of extension>
# For example: npm run dev only=my_awesome_extension
# Start a development server to view your extension and reload it as you make changes
# This command will take ~20s to startup and serve everything to http://localhost:8601/

# Alternatively, serve all the currently implemented extensions
npm run dev
# NOTE: This will be more intensive on your computer
```

Then, after navigating to http://localhost:8601/, follow the 'Adding Extensions' guidance in the [official extension documentation](https://en.scratch-wiki.info/wiki/Extension) to add your extension to the workspace. 

As long as the development server is running (meaning the `npm run dev` command is still executing), every change you make to the extension file(s) will trigger the page to refresh and your changes will be reflected automagically 🪄. 

### 📦 Committing, pushing, and deploying an extension 

If you followed the steps outlined in [Making an Extension](#🔨-making-an-extension), you should have created a new branch off of the `dev` branch where you implemented your extension. 

#### Automatic Deployment to Temperorary URL

Whenever you [push]() on this new branch, a [github action]() will automatically deploy your extension to a URL corresponding to your branch name. 

For example, if my branch is called `myNewExtension`, whenever I succesfully push up code on this branch, I should be able to see my changes at: https://playground.raise.mit.edu/myNewExtension/

> NOTE: The github action(s) that manages deployment can take anywhere from 10 - 30 minutes. View the status of actions in the repo's [Actions tab](https://github.com/mitmedialab/prg-extension-boilerplate/actions). In order for your site to be succesfully deployed, both an action titled with your commmit message and one after it titled ***pages build and deployment*** must complete succesfully. 

Though this branch-specific URL can be very helpful for sharing your extension quickly, we **require** that you don't use this URL for _official_ purposes -- instead you should follow the instructions in [Integrating Your Extension into the main Branch](#integrating-your-extension-into-the-main-branch) if you want to share extension as part of a curricullum, to an outside organization, etc. 

So this means you can use your branch-specific URL to share your extension with colleagues, get feedback, and quickly iterate on your extension. However, if you want to share your extension externally, especially with students, it must first be integrated into the `main` branch, and then you can direct them to: https://playground.raise.mit.edu/main/

#### Integrating Your Extension into the `main` Branch

The extensions pushed into the `main` branch should represent all of the extensions PRG officially supports, and thus what PRG is committed to maintaining now and into the future. 

Thus, you should only _officially_ share extensions via the `main` branch and corresponding [main site](https://playground.raise.mit.edu/main/) (https://playground.raise.mit.edu/main/). In other words, if an outside party (student, teacher, organization, etc.) reports a bug about an extension (or the platform), they should be doing so based on their usage of the main site -- not a branch-specific site that no other team members know about. 

By adhering to this practice, as well as a regimented process for [merging](https://git-scm.com/docs/git-merge) changes to the `dev` and `main` branches, we can ensure both the best experinece for our users and the least amount of headache for us as developers / maintainers.

Here's the process for getting your extension into the `main` branch and deployed to https://playground.raise.mit.edu/main/:

1. Get your development branch current with the `dev` branch
    ```bash
    cd prg-extension-boilerplate/ # Change directory (cd) to prg-extension-boilerplate/, if not already there

    git checkout <your branch name> # Checkout your brnahc, if not already checked out

    git pull # Fetch the latest changes from all remote branches. 
    # NOTE: using `git fetch` would do the same, but it's yet another git command to remember...

    git merge origin/dev # Merge the latest changes from the remote (i.e. origin) dev branch into your development branch
    ```
2. Create a Pull Request (PR) from your branch into `dev`
    1. Go to the [Pull Requests tab](https://github.com/mitmedialab/prg-extension-boilerplate/pulls)
    2. Click **New Pull Request** 
    3. Set _base_ to `dev` and _compare_ to the name of your branch
        - The flow should look like: `dev` <-- `<your branch>`
    4. Select **Create Pull Request** 
        - Do this enough times so that the pull request is actually created -- github's UI seems to be a little redunant
3. Set [pmalacho-mit](https://github.com/pmalacho-mit) (Parker Malachowsky) as the reviewer of the PR
    - NOTE: If anyone's interested in being a reviewer please also talk to Parker and he will add you above.
4. Work with your reviewer to get your PR approved, and then **YOUR REVIEWER** will merge your PR and your changes will go into `dev` 🎉🎉🎉.  In this way, you and the reviewer are equally responsible for keeping the `dev` branch bug-free. 
    - Your reviewer will review your code, test your extension, and leave comments for you to respond to.
    - You can speed up the review process by doing the following:
        - Writing readable code and leaving necessary (but [_only necessary_](https://levelup.gitconnected.com/please-dont-comment-your-code-d0830785bdc9)) comments
            - Use [JSDoc comments](https://jsdoc.app/about-getting-started.html) where possible (e.g. on functions, classes, method parameters, etc.)
        - [Writing tests for your extension]() (coming soon)
        - [Creating tutorials for your extension]() (coming soon)
5. Once your code is in `dev`, your work is done! The code base's maintainer (Parker, at this time) will then semiweekly merge the `dev` branch into the `main` branch.
6. Once Parker has notified you that your changes are live, you can direct your audience to the deployed `main` branch: https://playground.raise.mit.edu/main/
    - Check out the [URL Parameters]() section to see how you can customize this link to automatically add your extension, tutorials, demo project, etc. when the page is loaded. 

## 🔎 How to program an extension

### *"I have an `index.ts` file.. now what?"*

Once you've [created your extension](#-making-an-extension) and opened the corresponding `index.ts` file in VS Code, you might be wondering where to start. 

First, read through the documentation of the `index.ts` file (written inside of [code comments](https://www.w3schools.com/js/js_comments.asp)). 

Also, try hovering over fields to view their documentation (typically a [summary](https://jsdoc.app/tags-summary.html), [examples](https://jsdoc.app/tags-example.html), and a [longer desrciption](https://jsdoc.app/tags-description.html)).

![Gif of video hovering over fields to peak documentation](/assets/hover.gif)

Still stuck? Check out our [From 0 to Extension guide](#-from-0-to-extension) and/or contact more experienced Scratch developers, like [Parker](https://github.com/pmalacho-mit) or [Randi](https://github.com/randi-c-dubs)

### 🪜 From 0 to Extension

... Coming soon ...

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

Also, [due to a Webpack 4 issue](https://github.com/webpack/webpack/issues/14532), we require a node version <=16.

Please locate the [latest v16 release](https://nodejs.org/en/blog/release) and install a suitable version for your operating system.

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
