# ✨ PRG Scratch Extension Development Environment

This repository is your one-stop-shop for developing [scratch extensions](https://en.scratch-wiki.info/wiki/Extension) for PRG curricula.

It's a fullblown [fork](https://en.wikipedia.org/wiki/Fork_(software_development)) of the official Scratch codebase, which the [Personal Robotics Group](https://robots.media.mit.edu/) (PRG) manages and extends to meet its needs. 

Looking for the old documentation (<= Aug. 2022)? Head [here](./BACKGROUND.md).

## 📖 Table of Contents
- [Quick Start](#-quick-start)
    - [Project setup](#-project-setup)
    - [Making an extension](#-making-an-extension)
        - [Advanced](#-advanced)
    - [Porting an Extension to Typescript](#-porting-an-extension-to-typescript)
- [From 0 to Extension](#-from-0-to-extension)
- [Project Dependencies](#project-dependencies)
- [Deploying](#-Deploying)
- [Troubleshooting](#-Troubleshooting)
    - [webpack: command not found](#webpack-command-not-found)

## ⚡ Quick Start

This section contains concise explanations on how to accomplish something (often just a couple of commands to run). If you need more info please check out one of the lower sections. 

### 🚧 Project setup

Assuming you have...
- Git installed ((if not, jump to: [Git](#Git))
- Node <=16 is installed (if not, jump to: [Node](#Node))
- VS Code installed with Typescript Extension added (if not, jump to: [Vs Code](#VS-Code-(Recommended)))

Run the following from the command line:

```shell script
git clone git@github.com:mitmedialab/prg-extension-boilerplate.git
# Cloning the full history (300mb) takes about 20 seconds on fast internet. Include -–depth 1 for a 4 second checkout

cd prg-extension-boilerplate/
# Change directory (cd) to the repository

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

### 🏃‍♂️ Running an extension

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

### 📦 Committing, pushing, and deploying your changes 

... Coming soon ... shouldn't be necessary for the beta test.

## How to program an extension

### *"I have an `index.ts` file.. now what?"*

Once you've [created your extension](#-making-an-extension) and opened the corresponding `index.ts` file in VS Code, you might be wondering where to start. 

First, read through the documentation of the `index.ts` file (written inside of [code comments](https://www.w3schools.com/js/js_comments.asp)). 

Also, try hovering over fields to view their documentation (typically a [summary](https://jsdoc.app/tags-summary.html), [examples](https://jsdoc.app/tags-example.html), and a [longer desrciption](https://jsdoc.app/tags-description.html)), like so:

![Gif of video hovering over fields to peak documentation](/DocumentationAssets/hover.gif)

Still stuck? Check out our [From 0 to Extension guide](#-from-0-to-extension) and/or contact more experienced Scratch developers, like [Parker](https://github.com/pmalacho-mit) or [Randi](https://github.com/randi-c-dubs)

### 🪜 From 0 to Extension

... Coming soon ... (will incorporate feedback from beta test)

Currently, depending on what's new to you, here are some recommendations:
- *New to Javascript and Typescript?* Follow this [javascript tutorial](https://www.w3schools.com/js/) and then check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- *Know javascript but new to Typescript?* Check out the [Typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- *Know javascript/typescript but never made an extension before?* Nice! The documentation of the template `index.ts` should be enough to get you started (and if not, please give that feedback)
- *New to the extension framework (but had developed extensions in the past)?* The [Porting an extension to Typescript guide](#-porting-an-extension-to-typescript) is likely for you!

Probably will have:
- Full step-by-step guide on:
    - What is an extension?
    - How do you make one using the typescript framework
- Video tutorial 
- FAQ?

### 🔀 Porting an Extension to Typescript

Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation? ***Great!***

#### Example

##### Vanilla JS

##### Typescript

##### Step by step

## ⛓️ Dependencies

### Git

Please [install git](https://git-scm.com/downloads), which helps us with [source contro](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) -- basically, how we preserve and share changes to the code. 

### Node

Like many web development projects, this project requires you to have [node](https://nodejs.org/en/) installed.

Also, [due to a Webpack 4 issue](https://github.com/webpack/webpack/issues/14532), we require a node version <=16.

Please follow [these instructions](https://nodejs.org/en/download/) to install a suitable version of Node on your machine.

#### Maintainer Note (9/15/22)

> In October 2022, node 18 LTS will be released, making it slightly harder to get node 16 LTS. 
Before then, we either need to upgrade webpack to be able to use node 18, or revise the above instructions to help users locate node 16.

### VS Code (Recommended)

We encourage you to use VS Code since it has great Typescript support. Also, it's easier to offer tips and tricks if most of us use the same text editor.

Here's how to [install VS Code](https://code.visualstudio.com/download).

Of course, if you prefer a different editor, go ahead and use it (but do so at your own 'risk').  

#### Extensions

We recommend adding the following extensions (which you can do [like so](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-an-extension)):

- [Typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## 📦 Deploying

We use GitHub Actions to build the combined scratch-gui using `npm`, and [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) to deploy to GitHub Pages.

Note that there is a step of adding an access token to the repository due to a bug with GitHub Actions. [Follow the steps here](https://github.com/marketplace/actions/deploy-to-github-pages#configuration-) to add an access token to your repository.

## 🤔 Troubleshooting

#### webpack: command not found
If you see the following:

```shell script
> scratch-render@0.1.0 build /Users/brian/code/aied/test/test2/packages/scratch-render
> webpack --progress --colors
sh: webpack: command not found
```

This may mean you have a half-installed node_modules version of webpack. Try starting [fresh](#-project-setup)!
