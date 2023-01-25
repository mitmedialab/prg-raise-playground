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
          console.log(resp);
          if (!resp.ok) return console.error(resp);
          if (resp.status !== 200) return console.error(resp.body);
          const json = await resp.json();
          console.log(json);
        }

      }
    }
  }
}
