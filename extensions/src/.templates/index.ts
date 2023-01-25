import { Extension, Environment } from "$common";

type Details = {
  name: "",
  description: "",
  iconURL: "",
  insetIconURL: ""
};

export default class _ extends Extension<Details, {
  // Blocks
}> {
  init(env: Environment) { }

  defineBlocks(): _["BlockDefinitions"] {
    return {

    }
  }
}