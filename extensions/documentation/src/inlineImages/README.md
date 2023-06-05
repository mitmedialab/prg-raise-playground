# Adding inline images to the text of blocks

As noted in [Scratch's extension documentation](https://github.com/scratchfoundation/scratch-vm/blob/develop/docs/extensions.md#adding-an-inline-image), Blocks support arguments that can display images inline within their text display.

We can make use of this feature within the framework by adding an extra argument of type `"inline image"` to our extension's method, and then seperately add an `arg` (or `args`) entry within the associated `@block` decorator invocation.

See the below example (which assumes that a file `myPic.png` is located in the same directory as our code):

[](./index.ts?export=x)