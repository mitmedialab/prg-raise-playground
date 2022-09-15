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
- Node <=16 is installed (if not, jump to: ...)
- VS Code installed with Typescript Extension added (if not, jump to: ...)

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
cd prg-extension-boilerplate/ # if not already there
# Change directory (cd) to prg-extension-boilerplate/ 

npm run new:extension <folder to contain extension>
# For example: npm run new:extension my_awesome_extension
# If succesful, the output of this command will tell you where to find your new extension file.
# It will be an index.ts file, and its documentation should help you get started

npm run dev
# Start a development server to view your extension and reload it as you make changes
# This command will take ~20s to startup and serve everything to http://localhost:8601/
```

After navigating to http://localhost:8601/, follow the 'Adding Extensions' guidance in the [official extension documentation](https://en.scratch-wiki.info/wiki/Extension) to add your extension to the workspace. 

As long as the development server is running (meaning the `npm run dev` command is still executing), every change you make to the extension file will trigger the page to refresh and your changes will be reflected automagically 🪄. 

#### 🥋 Advanced

If you're a pro extension-maker, use the following command to make a new extension that contains no documentation and/or filler text. 

```shell script
npm run new:extension <folder to contain extension> barebones 
# Note the 'barenones' at the end
```

### 🔀 Porting an Extension to Typescript

Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation? ***Great!***

#### Example

##### Vanilla JS

##### Typescript

##### Step by step

## 🪜 From 0 to Extension

... Coming soon ... 

Likely will have:
- Full step-by-step guide on:
    - What is an extension?
    - How do you make one using the typescript framework
- Video tutorial 
- FAQ?

### Dependencies

### Node

Like many web development projects, this project requires you to have [node](https://nodejs.org/en/) installed.

Also, [due to a Webpack 4 issue](https://github.com/webpack/webpack/issues/14532), we require a node version <=16.

Please follow [these instructions](https://nodejs.org/en/download/) to install a suitable version of Node on your machine.

#### Maintainer Note (9/15/22)

In October 2022, node 18 LTS will be released, making it slightly harder to get node 16 LTS. 
Before then, we either need to upgrade webpack to be able to use node 18, or revise the above instructions to help users locate node 16.

### VS Code (Recommended)

We encourage you to use VS Code since it has great Typescript support. Also, it's easier to offer tips and tricks if most of us use the same text editor.

Here's how to [install VS Code]().

Of course, if you prefer a different editor, go ahead and use it (but do so at your own 'risk').  

#### Extensions

We recommend adding the following extensions (which you can do [like so]()):

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
