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

Requirements, your java version should be 8 or higher. Check `java -version`.

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
