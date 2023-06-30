# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 2023-03-25 (pending)

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
