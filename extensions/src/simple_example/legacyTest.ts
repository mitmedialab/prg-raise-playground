import { ExtensionMetadata } from "$common";

export const oldGetInfo = {
  id: "",
  blocks: [
    {
      blockType: "reporter",
      text: "aaa",
      opcode: "log",
      arguments: {
        X: {
          type: "string"
        }
      }
    }
  ]
} as const satisfies ExtensionMetadata;