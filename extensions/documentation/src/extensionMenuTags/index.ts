import { extension } from "$common";

export default class TagsExample extends extension(
    {
        name: "A demonstration of using tags to categorize extensions",
        tags: ["Made by PRG"]
    }
) {
    init() { /* ignore */ }
}