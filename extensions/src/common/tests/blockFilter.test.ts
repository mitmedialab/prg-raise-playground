import { extension } from "$common/extension";
import { block } from "$common/extension/decorators/blocks";
import { Environment, ExtensionBlockMetadata, TargetType } from "$common/types";
import { createTestSuite } from "$testing";

class BlockFilterTestExtension extends extension({ name: "Dummy" }) {
    override init(env: Environment) { }

    // @ts-check
    @block({
        type: "command",
        text: "only for sprites",
        filter: [TargetType.Sprite]
    })
    spriteOnly() {

    }

    // @ts-check
    @block({
        type: "command",
        text: "only for the stage",
        filter: [TargetType.Stage]
    })
    stageOnly() {

    }

    // @ts-check
    @block({
        type: "command",
        text: "for sprites and the stage",
        filter: [TargetType.Sprite, TargetType.Stage]
    })
    both() {

    }

    // @ts-check
    @block({
        type: "command",
        text: "no filter specified"
    })
    unfiltered() {

    }
}

createTestSuite(
    {
        Extension: BlockFilterTestExtension,
        __dirname
    },
    {
        unitTests: null,
        integrationTests: {
            "filter is forwarded to the block's scratch metadata": ({ extension, testHelper: { expect } }) => {
                const blocks = extension.getBlockInfo()
                    .reduce(
                        (map, metadata) => map.set(metadata.opcode as keyof BlockFilterTestExtension, metadata),
                        new Map<keyof BlockFilterTestExtension, ExtensionBlockMetadata>()
                    );

                expect(blocks.get("spriteOnly").filter).toEqual([TargetType.Sprite]);
                expect(blocks.get("stageOnly").filter).toEqual([TargetType.Stage]);
                expect(blocks.get("both").filter).toEqual([TargetType.Sprite, TargetType.Stage]);
            },
            "blocks without a filter are left unrestricted": ({ extension, testHelper: { expect } }) => {
                const unfiltered = extension.getBlockInfo()
                    .find(({ opcode }) => opcode === "unfiltered");

                expect(unfiltered.filter).toBeUndefined();
            }
        }
    }
)
