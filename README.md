# ✨ Drag-and-Drop Coding Environment Boilerplate

This is intended to be a repository that makes it simple to play with and deploy a GUI based on Scratch-3.0 components! It may be handy for:

- Developing prototype Scratch 3.0 extensions that don't fit within the current extension limitations
- Experimenting with tweaks to the Scratch 3.0 GUI
- Quickly deploying a fork of the Scratch 3.0 GUI

It is not so great for:

- Pushing small changes back to upstream Scratch components often (it's possible, and this project retains the git history of the constituent sub-projects, but there's an extra messy step to get your work together for a pull request)

It is structured as a monorepo, where the Scratch components you'll typically want to modify live within the repository so you can edit them all at once, manage their versions all in one place, and perform a simple static site deploy of the GUI with the synced dependencies.

- [packages/scratch-gui](packages/scratch-gui)
- [packages/scratch-vm](packages/scratch-vm)
- [packages/scratch-render](packages/scratch-render)
- [packages/scratch-blocks](packages/scratch-blocks)

## ⚡ Quick Setup️

Requirements
1. Your java version should be 8 or higher. Check `java -version`.
2. Install node.js https://nodejs.org/en/ (tested with Linux version 6.13.4 and Mac)

```shell script
git clone git@github.com:mitmedialab/prg-extension-boilerplate.git
# Cloning the full history (300mb) takes about 20 seconds on fast internet. Include -–depth 1 for a 4 second checkout
npx lerna bootstrap --force-local
# This will symlink the packages together to allow for seamless local development, and installs dependencies for each package
# Takes about 1.5 minutes
cd packages/scratch-gui
npm start

# Open http://localhost:8601/ in your browser
```

Now you can make changes, and they will auto-build from the scratch-gui watcher and live-reload!

- render, gui, and vm will auto-build while `scratch-gui`'s `npm start` is running (as in steps above)
- the blocks component currently requires manually building and re-starting the GUI build:
    ```shell script
    # Make your change to scratch-blocks, then:
    cd packages/scratch-blocks
    npm run prepublish
    # And re-start scratch-gui's npm start
    ```
  
Alternatively, use GitPod!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/prg-extension-boilerplate)

### 🤔 Troubleshooting

#### If you see `sh: webpack: command not found`:

```shell script
> scratch-render@0.1.0 build /Users/brian/code/aied/test/test2/packages/scratch-render
> webpack --progress --colors
sh: webpack: command not found
```

**Solution**: This may mean you have a half-installed node_modules version of webpack. Try starting fresh!

## Adding a new Scratch Extension

The most common modification to Scratch that you will be doing is adding a new category of blocks, also called an extension, to the toolbox. To complete this work, you will primarily be working in [packages/scratch-vm](packages/scratch-vm).
1. Enter `packages/scratch-vm` and navigate to `packages/scratch-vm/src/extensions`. This folder contains all of the extensions that currently exist in your toolbox.
2. Make a new folder for the extension that you want to create. For example, make a folder called `scratch3_test`. Then enter that folder.
3. In `scratch3_test`, create a new file, `index.js`.
4. To populate the `index.js` file that you created, look at [this annonated Scratch extension example](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md#annotated-example). This example can be copied directly as a starting point. Another starting point to consider would be copying the `index.js` of another extension in the `packages/scratch-vm/extensions` folder that has most of the functionality that you are looking for.
5. Once your index.js is settled, add the name of the extension to `scratch-vm/src/extension-support/extension-manager.js`. Look at the other extensions added there as a template for how you should add your new extension.
6. Now you will have to navigate to `packages/scratch-gui`. Add the extension name and url of your new extension to `scratch-gui/src/lib/libraries/extensions/index.jsx`.
7. [Optional] If you want the extension to automatically be loaded whenever you load the page, add it as a CORE_EXTENSION in `scratch-vm/src/virtual-machine.js`.

More information about creating a new Scratch extension [can be found here](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md).


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
