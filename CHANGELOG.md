# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 2023-03-17 (Pending)

### Added

- Video mixin:
- Drawable mixin:
- Add Costumes mixin:
  - [Scratch VM Change](#scratch-vm-change): Added `addCostime` function onto `runtime` to allow for utilizing the `loadCostume` function of `scratch-vm/src/import/load-costume.js`
- Legacy Support mixin:
- Selfie Segmentation extension:
- **TODO** Guidance on develop on windows
- Vs Code setting to use this project's typescript version instead of Vs Code's

### Fixed

- Limited the potential for endless bundling loops
  - Now bundles are only re-generated when a file with a `.ts`, `.svelte`, `.png`, and/or `.svg` extension is changed
  - **_NOTE_**: The above 'watched' file extensions can / should grow overtime
- 

### Changed

- Extension's `init` function now supports be implemented as `async`
  - Tests update to support
- The prescribed workflow for legacy support now uses the Legacy Support mixin (instead of the Legacy Extension class decorator)
- Typescript version set to the `5.0.1-rc`

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