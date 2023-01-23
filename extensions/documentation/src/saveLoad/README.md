## Saving Custom Data for an Extension

The Extension Framework allows you to easily save arbitrary data for an extension when an `.sb3` (Scratch 3 format) project is saved. 

You can also set up how your extension utilizes that data when a project is loaded that contains custom save data. 

All you must do is define the `saveDataHandler` property on your extension, like so:

[](./index.ts?export=x)