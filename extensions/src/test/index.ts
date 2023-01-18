import { Extension, Environment, BlockType, ArgumentType, VerboseArgument } from "$common";

type Details = {
  name: "ee",
  description: "Ahoy",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  test: (x: { t: string }) => { t: string },
  extract: ({ t }: { t: string }) => string,
}> {
  init(env): void { }

  defineBlocks(): _["BlockDefinitions"] {
    return {
      test: {
        text: (arg) => `Hi ${arg}`,
        operation: (arg) => arg,
        type: BlockType.Reporter,
        arg: this.makeCustomArgument({
          component: "Dummy",
          initial: { text: "hi", value: { t: "e" } }
        })
      },
      extract: {
        text: (arg) => `Return ${arg}`,
        operation: ({ t }) => {
          console.log(t);
          return t;
        },
        type: BlockType.Reporter,
        arg: this.makeCustomArgument({
          component: "Dummy",
          initial: { text: "hi", value: { t: "e" } },
          acceptReportersHandler: (x) => x
        }),
      }
    }
  }
}