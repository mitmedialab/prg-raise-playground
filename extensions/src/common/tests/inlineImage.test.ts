import { extension } from "$common/extension";
import { block } from "$common/extension/decorators/blocks";
import { ArgumentType, Environment } from "$common/types";
import testImage from "./testImage.png";

class _ extends extension({ name: "Dummy" }) {
    override init(env: Environment) { }

    // @ts-check
    @block({
        type: "command",
        text: (arg) => `${arg}`,
        arg: {
            type: "image",
            uri: testImage,
            alt: "this is a test image",
        }
    })
    singleArg(arg: "inline image") {

    }

    // @ts-check
    @block({
        type: "command",
        text: (x, y, z) => `${x} ${y} ${z}`,
        args: [
            "number", {
                type: "image",
                uri: testImage,
                alt: "this is a test image",
            }, {

                type: ArgumentType.String,
            }]
    })
    multiArg(x: number, y: "inline image", z: string) {
    }
}