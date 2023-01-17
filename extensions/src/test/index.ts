import { Extension, Environment, BlockType, ArgumentType } from "$common";

type Details = {
  name: "ee",
  description: "Ahoy",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  test: (x: { t: string }) => { t: string },
  list: (x: string) => void,
}> {
  init(env): void { }

  defineBlocks(): _["BlockDefinitions"] {
    return {

      test: () => ({
        text: (arg) => `Hi ${arg}`,
        operation: (arg) => arg,
        type: BlockType.Reporter,
        arg: this.makeCustomArgument({
          component: "Dummy",
          initial: { text: "hi", value: { t: "e" } }
        })
      }),

      list: () => ({
        text: (arg) => `${arg}`,
        operation: (arg) => { console.log(arg) },
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: {
            acceptsReporters: true,
            handler: (x) => x["t"],
            getItems: () => this.customArgumentManager.getCurrentEntries().map(([_0, _1]) => _1)
          }
        }
      })
    }
  }
}