## Loading External Files / Assets

It's possible your extension might need to leverage an external file (for example a `.png` used in a UI, or an `.onnx` model used for neural network inferencing). In these cases, you likely want a URL pointing to the asset, instead of bundling it with your extension, as is done with code. 

The supported way to do this is:
1. Create an `assets` directory inside of your extension directory, and place your assets inside of there. 
2. Get a path / URL to the asset by invoking the `getPathAsset` Extension method. For example:
[](./index.ts?export=x)