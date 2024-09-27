import { BlockUtilityWithID, Environment, extension, scratch } from "$common";

export default class extends extension({ name: "Block Utility example" }) {
    override init(env: Environment) { }

    @(scratch.command`Block text with ${"number"}`)
    exampleBlockMethod(someArgument: number, util: BlockUtilityWithID) {
        const { blockID } = util;
        console.log(`My ID is: ${blockID}`)
    }
}