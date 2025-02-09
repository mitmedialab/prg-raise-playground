import { codeSnippet } from "documentation";

export const x = codeSnippet();

import { Environment, extension, scratch } from "$common";
// We import our image as if it was a code file
import myPic from "./myPic.png";

export default class ExampleExtensionWithInlineImages extends extension({
    name: "This is an example extension with inline images",
}) {
    override init(env: Environment) { }

    @(scratch.command`Here's an inline image: ${
        {
            type: "image",
            uri: myPic,
            alt: "this is a test image", // description of the image for screen readers
            flipRTL: true,
        }
    }`)
    methodWithOnlyInlineImage(image: "inline image") {
        // NOTE: The `image` argument should not be used
    }

    @(scratch.command`Here's a number ${{ type: "number" }} and picture ${
        { 
            type: "image", 
            uri: myPic, 
            alt: "this is a test image", 
            flipRTL: true 
        }
    } and string ${"string"}}`)
    methodWithInlineImageAndOtherArguments(someNumber: number, image: "inline image", someString: string) {
        // NOTE: The `image` argument should not be used
    }
}

x.end;