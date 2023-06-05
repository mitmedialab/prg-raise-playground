import { codeSnippet } from "documentation";

export const x = codeSnippet();

import { Environment, block, extension } from "$common";
// We import our image as if it was a code file
import myPic from "./myPic.png";

export default class ExampleExtensionWithInlineImages extends extension({
    name: "This is an example extension with inline images",
}) {
    override init(env: Environment) { }

    @block({
        type: "command",
        text: (image) => `Here's an inline image: ${image}`,
        arg: {
            type: "image",
            uri: myPic,
            alt: "this is a test image", // description of the image for screen readers
            flipRTL: true,
        }
    })
    methodWithOnlyInlineImage(image: "inline image") {
        // NOTE: The `image` argument should not be used
    }

    @block({
        type: "command",
        text: (someNumber, image, someString) => `Here's a number ${someNumber} and picture ${image} and string ${someString}}`,
        args: [
            { type: "number" },
            { type: "image", uri: myPic, alt: "this is a test image", flipRTL: true },
            "string"
        ]
    })
    methodWithInlineImageAndOtherArguments(someNumber: number, image: "inline image", someString: string) {
        // NOTE: The `image` argument should not be used
    }
}

x.end;