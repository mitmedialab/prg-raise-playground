# Blocks-based Coding Environment Boilerplate

## Based on Scratch

This is intended to be a repository that makes it easy to modify and deploy a Scratch-3.0-like GUI.

Currently this requires managing two separate repositories (at a minimum) depending on which portions of the Scratch GUI you would like to modify.

Eventually, Scratch Extensions may supersede the need to modify the core. For certain use cases like importing external libraries, etc., it is currently necessary to fork the current repositories.

## How to Import and Update Packages to Modify

This project uses [`lerna`](https://github.com/lerna/lerna) as a utility to import npm packages with their existing history intact.

```
npx lerna init
```
