import { Extension, Environment, ButtonBlock, BlockType, fetchWithTimeout } from "$common";

type Details = {
  name: "A",
  description: "B",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  fireRequest: (arg: { url: string, entries: Record<string, string> }) => void,
}> {
  init(env: Environment) { }

  defineBlocks(): _["BlockDefinitions"] {
    return {
      fireRequest: {
        text: (arg) => "Do it " + arg,
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "CustomArgument",
          initial: { value: { url: "", entries: {} }, text: "click" }
        }),
        operation: async ({ url, entries }) => {

          console.log(url);
          console.log(entries);
          const resp = await fetch(url, {
            ...entries
          });

          if (!resp.ok) {
            const json = await resp.json() as { error: string };
            return console.error(json.error);
          }

          const json = await resp.json();
          console.log(json);
        }

      }
    }
  }
}
