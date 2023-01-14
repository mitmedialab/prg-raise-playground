import { Extension, Environment, BlockType, ArgumentType } from "$common";

type Details = {
  name: "ee",
  description: "Ahoy",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  test: (x: string) => string
}> {
  init(env): void { }

  defineBlocks(): _["BlockDefinitions"] {
    return {
      test: () => ({
        text: (arg) => `Hi ${arg}`,
        operation: (arg) => arg,
        type: BlockType.Reporter,
        arg: Extension.MakeCustomArgument("Dummy", { text: "hi", value: 5 })
      })
    }
  }
}