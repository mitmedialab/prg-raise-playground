# ✨ PRG Scratch Extension Development Environment

This repository is your one-stop-shop for developing [scratch extensions](https://en.scratch-wiki.info/wiki/Extension) for PRG curricula.

It's a fullblown [fork](https://en.wikipedia.org/wiki/Fork_(software_development)) of the official Scratch codebase, which the [Personal Robotics Group](https://robots.media.mit.edu/) (PRG) manages and extends to meet its needs. 

Looking for the old documentation (<= Aug. 2022)? Head [here](./BACKGROUND.md).

## 📖 Table of Contents
1. [⚡ Quick Start](#quick-start)
    - [🚧 Project setup](#project-setup)
    - [🛠️ Making an extension](#making-an-extension)
        - [🥋 Advanced](#advanced)
    - [🔀 Porting an Extension to Typescript](#porting-an-extension-to-typescript)
2. [🪜 From 0 To Extension](#from-0-to-extension)

## Quick Start ⚡

This section contains concise explanations on how to accomplish something (often just a couple of commands to run). If you need more info please check out one of the other sections. 

### Project setup

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

### 🛠️ Making an extension

To make a new extension, run the following commands:

```shell script
cd prg-extension-boilerplate/ # if not already there
# Change directory (cd) to prg-extension-boilerplate/ 

npm run new:extension <folder to contain extension>
# For example: npm run new:extension my_awesome_extension
# If succesful, the output of this command will tell you where to find your new extension file.

npm run dev
# Start a development server to view your extension and reload it as you make changes
# This command will take ~20s to startup and serve everything to http://localhost:8601/
```
The documentation in the file the `npm run new:extension` generates for you (*index.ts*) should help you get started building your extension. You can also hop down to our full tutorial: [From 0 to Extension](#from-0-to-extension)

After navigationg to http://localhost:8601/, follow the 'Adding Extensions' guidance in the [official extension documentation](https://en.scratch-wiki.info/wiki/Extension) to locate your extension and add it to the workspace. 

As long as the development server is running (meaning the `npm run dev` command is still executing), every change you make to the extension file will trigger the page to refresh and your changes will be reflected automagically 🪄. 

#### 🥋 Advanced

If you're a pro extension-maker, use the following command to make a new extension that contains no documentation and/or filler text. 

```shell script
npm run new:extension <folder to contain extension> barebones 
# Note the 'barenones' at the end
```

### 🔀 Porting an Extension to Typescript

Want to move your vanilla-JS extension to our Typescript framework and reap the benefits of type safety and code generation? ***Great!***

The process should be pretty straightforwarded, made only a little challenging depending on how many cases of type

## 💿 From 0 To Extension

### 🤔 Troubleshooting

#### If you see `sh: webpack: command not found`:

```shell script
> scratch-render@0.1.0 build /Users/brian/code/aied/test/test2/packages/scratch-render
> webpack --progress --colors
sh: webpack: command not found
```

**Solution**: This may mean you have a half-installed node_modules version of webpack. Try starting fresh!

## 💡 How this was made:

### Sub-packages

This project uses [`lerna`](https://github.com/lerna/lerna) as a utility to import npm packages with their git history (relatively) intact. That way stuff like `git log` and `git blame` will continue to provide a bit of insight into why code in the repository is the way it is! 

```shell script
npx lerna init
cd .. && mkdir scratch-fresh && cd scratch-latest
git clone https://github.com/LLK/scratch-vm.git
git clone https://github.com/LLK/scratch-gui.git
git clone https://github.com/LLK/scratch-render.git
git clone https://github.com/LLK/scratch-blocks.git
cd prg-extension-boilerplate
npx lerna import ../scratch-latest/scratch-vm --preserve-commit --flatten 
npx lerna import ../scratch-latest/scratch-gui --preserve-commit --flatten 
npx lerna import ../scratch-latest/scratch-render --preserve-commit --flatten 
npx lerna import ../scratch-latest/scratch-blocks --preserve-commit --flatten 
```

### Deployment

We use GitHub Actions to build the combined scratch-gui using `npm`, and [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) to deploy to GitHub Pages.

Note that there is a step of adding an access token to the repository due to a bug with GitHub Actions. [Follow the steps here](https://github.com/marketplace/actions/deploy-to-github-pages#configuration-) to add an access token to your repository.

## 😸 Caveats

Eventually, work on Scratch Extensions may supersede this project's utility! This repo is most convenient for projects that can't accomplish what they need to within the Extensions framework.

Note the [`LICENSE`](packages/scratch-gui/LICENSE)s and especially [`TRADEMARK`](packages/scratch-gui/TRADEMARK)s for each Scratch component project carefully — e.g., you may not use the Scratch name, logo, cat, etc. in derivative projects without permission.  
