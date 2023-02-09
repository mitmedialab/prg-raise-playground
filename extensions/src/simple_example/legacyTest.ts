import { ExtensionMetadata } from "$common";

export const oldGetInfo = {
  id: "",
  blocks: [
    {
      blockType: "reporter",
      text: "aaa",
      opcode: "hello",
      arguments: {
        X: {
          type: "string"
        }
      }
    }
  ]
} as const satisfies ExtensionMetadata;