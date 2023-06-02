import { extension } from "$common/extension";
import { block } from "$common/extension/decorators/blocks";
import { ArgumentType, Environment, ExtensionBlockMetadata, InlineImage } from "$common/types";
import { createTestSuite, imageMock } from "$testing";
import mocked from "./nonExistentFile.png";

class InlineImageTestExtension extends extension({ name: "Dummy" }) {
    override init(env: Environment) { }

    // @ts-check
    @block({
        type: "command",
        text: (arg) => `${arg}`,
        arg: {
            type: "image",
            uri: mocked,
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
            "number",
            {
                type: "image",
                uri: mocked,
                alt: "this is a test image",
            },
            {
                type: ArgumentType.String,
            }]
    })
    multiArg(x: number, y: "inline image", z: string) {
    }
}


createTestSuite(
    {
        Extension: InlineImageTestExtension,
        __dirname
    },
    {
        unitTests: null,
        integrationTests: {
            "check block info": ({ extension, testHelper: { expect } }) => {
                const blocks = extension.getBlockInfo()
                    .reduce(
                        (map, metadata) => map.set(metadata.opcode as keyof InlineImageTestExtension, metadata),
                        new Map<keyof InlineImageTestExtension, ExtensionBlockMetadata>()
                    );
                const imageArgs = [
                    blocks.get("singleArg").arguments[0],
                    blocks.get("multiArg").arguments[1]
                ];

                imageArgs
                    .map(arg => arg as InlineImage)
                    .forEach((arg) => expect(arg.uri).toBe(imageMock));

                imageArgs
                    .forEach((arg) => expect(arg).toHaveProperty("dataURI"));

                imageArgs
                    .forEach((arg) => expect(arg["dataURI"]).toBe(imageMock));
            }
        }
    }
)