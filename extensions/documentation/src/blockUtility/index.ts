import { BlockUtilityWithID, Environment, block, extension } from "$common";

export default class extends extension({ name: "Block Utility example" }) {
    override init(env: Environment) { }

    @block({
        type: "command",
        text: (someArgument) => `Block text with ${someArgument}`,
        arg: "number"
    })
    exampleBlockMethod(someArgument: number, util: BlockUtilityWithID) {
        const { blockID } = util;
        console.log(`My ID is: ${blockID}`)
    }
}