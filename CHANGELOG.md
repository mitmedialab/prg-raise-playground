# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 2023-12-22

### Changed
- Using `yargs` npm package to parse command-line options instead of homegrown functionality (no more ugly `only=`)
- Extensions are now bundled / served explicilty (based on the `--include` / `-i` flag) instead of all being included by default
  - I.e. `npm run dev` now **REQUIRES** the `--include` / `-i` flag to be provided to indicate which extension(s) to bundle & serve
    - e.g. `npm run dev -- --include myAwesomeExtension` or `npm run dev -- -i myAwesomeExtension`
- Based on input / work from @sanjaiyan-dev, now bundle all extensions concurrently
  - This was previously avoided, since it could lead to out of memory issues (since `npm run dev` was bundling all extensions by default). Now that extension bundling is more explicit, this is is less of a concern, and extensions are bundled concurrently by default
  - Concurrent bundling can be opted-out-of (as is the case for the github action the bundles all extensions) by setting the `--parrallel` / `-p` flag to `false`
    - e.g. `npm run dev -- --include all -p false`

## 2023-07-14

### Changed
- Custom Argument UI now support updating the value of the argument whenever it's `setter` is called (instead of having to explicitly click "Apply")
  - This is a lot more intuitive and really how it should've been implemented from the beginning (it just didn't occur to me how) -- these changes also bring some serious cleanup and simplification of the custom argument code to hopefully make maintenance easier in the future
  - In the process of implemeting this, we were able to remove the need for any changes to the `scratch-vm` to make custom arguments work
  - **BREAKING CHANGE:** If you're a developer who uses custom arguments in their extension, you will have to change how you specify the `component` to associate with your custom argument. Instead of specifying the name of the svelte file to load (in a string), you'll actually now import the svelte component directly:
    - Before:
    ```ts
    arg: self.makeCustomArgument({
      component: "MyArgUI",
      initial: { value: { a: 10, b: "Hello world", c: false }, text: "[10, Hello world, false]", }
    }),
    ```
    - Now:
    ```ts
    // At top of file
    import MyArgUI from "./MyArgUI.svelte"

    // Within block definition 
    arg: self.makeCustomArgument({
      component: MyArgUI,
      initial: { value: { a: 10, b: "Hello world", c: false }, text: "[10, Hello world, false]", }
    }),
    ```

## 2023-03 - 2023-06 (backfill)

### Added
- Support for changing the color of blocks. (docs coming soon -- ping @pmalacho-mit if you need 'em and can't find em)
- Support for inline image arguments. [See docs](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#adding-inline-images-to-the-text-of-blocks)
- Support for indicators (docs coming soon --  ping @pmalacho-mit if you need 'em and can't find em))
- Support for accessing block's ID form `BlockUtility`. [See docs](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#block-id)
- Ability to tag extensions to control how they are sorted in the extensions menu: [See docs](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#extension-menu-tags--categories)

### Changed

- Teachable machine extension is now a `configurable` extension (as opposed to a `generic` extension (the old way of doing things))

## 2023-03-25

### Changed

- Info about an extension (e.g. its `id`, `name`, and `blockIconURI`) are now loaded via an external `.js` file instead of being 'filled in' at bundle-time (which was error prone)
  - [Scratch VM Change](#scratch-vm-change): changes are implemented in _bundle-loader.js_ to load this file in and utilize when retrieving an Extension's constructor

## 2023-03-20

### Added

- **_Video mixin:_** Ability for extensions to enable video feed and set transparency 
  - Available as `"video"` addon
- **_Drawable mixin:_** Ability for extensions to draw arbitrary images onto the stage
  - Available as `"drawable`" addon
- **_Add Costumes mixin:_** Ability for extensions to add and set costumes for sprites
  - Available as `"addCostumes"` addon
  - [Scratch VM Change](#scratch-vm-change): Added `addCostime` function onto `runtime` to allow for utilizing the `loadCostume` function of `scratch-vm/src/import/load-costume.js`
- Block mixins
  - **_Toggle video:_** Ability for extensions to include a toggle video block to set the state of the video feed
    - Available as `"toggleVideoBlock"` addon
  - **_Video transparency:_** Ability for extensions to include a set transparency block to set how see-through the video feed is
    - Available as `"setTransparencyBlock"` addon
- **_Legacy Support mixin:_** Legacy support available as a mixin (in addition / instead of as a class decorator)
  - Available as "legacySupport"
- Selfie Segmentation extension:
- Guidance on developing on windows
- Vs Code setting to use this project's typescript version instead of Vs Code's

### Fixed

- Limited the potential for endless bundling loops
  - Now bundles are only re-generated when a file with a `.ts`, `.svelte`, `.png`, and/or `.svg` extension is changed
  - **_NOTE_**: The above 'watched' file extensions can / should grow overtime
- Corrected Extension Probe runtime errors

### Changed

- Extension's `init` function now supports be implemented as `async`
  - [Scratch VM Change](#scratch-vm-change): _extension-manager_ now `await`s the `tryInitExtension` function from the _bundle-loader_
  - Tests update to support
- The prescribed workflow for legacy support now uses the Legacy Support mixin (instead of the Legacy Extension class decorator)
- Typescript version set to the `latest`
- New way to express dependencies within mixin architecture

# Tags

## Scratch VM Change

As best as possible, we should keep track of when changes are committed that change the `packages/scratch-vm` source and thus cause our repo to diverge (further) from [LLK's scratch-vm](https://github.com/LLK/scratch-vm)

## Scratch GUI Change

As best as possible, we should keep track of when changes are committed that change the `packages/scratch-gui` source and thus cause our repo to diverge (further) from [LLK's scratch-gui](https://github.com/LLK/scratch-gui)

# Template

## YYYY-MM-DD

### Added

### Fixed

### Changed

### Deprecated

### Removed

### Fixed

### Security
