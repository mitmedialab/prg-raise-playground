import { Extension, Environment, ButtonBlock, BlockType } from "$common";

type Details = {
  name: "A",
  description: "B",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  fireRequest: ButtonBlock,
}> {
  init(env: Environment) { }

  defineBlocks(): _["BlockDefinitions"] {
    return {
      fireRequest: {
        text: "Do it",
        type: BlockType.Button,
        operation: async () => {
          const url = "https://prg-key-server.netlify.app/.netlify/functions/ai-blocks-drive";
          const resp = await fetch(url, { method: 'GET' });
          const json = await resp.json();
          console.log(json);
        }

      }
    }
  }
}
