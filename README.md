# Blocks-based Coding Environment Boilerplate

## Based on Scratch

This is intended to be a repository that makes it easy to modify and deploy a Scratch-3.0-like GUI.

Currently this requires managing two separate repositories (at a minimum) depending on which portions of the Scratch GUI you would like to modify.

Eventually, Scratch Extensions may supersede the need to modify the core. For certain use cases like importing external libraries, etc., it is currently necessary to fork the current repositories.

## How to Import and Update Packages to Modify

This project uses [`lerna`](https://github.com/lerna/lerna) as a utility to import npm packages with their existing history intact.

```
npx lerna init
cd .. && mkdir scratch-fresh && cd scratch-latest
git clone https://github.com/LLK/scratch-vm.git
git clone https://github.com/LLK/scratch-gui.git
git clone https://github.com/LLK/scratch-render.git
git clone https://github.com/LLK/scratch-blocks.git
cd prg-scratch-extension-boilerplate
npx lerna import ../scratch-latest/scratch-vm --preserve-commit
npx lerna import ../scratch-latest/scratch-gui --preserve-commit
npx lerna import ../scratch-latest/scratch-render --preserve-commit
npx lerna import ../scratch-latest/scratch-blocks --preserve-commit
```

