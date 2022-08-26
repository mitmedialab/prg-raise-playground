import { Extension } from "../../typescript-support/Extension";
import { Environment } from "../../typescript-support/types";

type Details = {
  name: "",
  description: "",
  iconURL: "",
  insetIconURL: ""
};

class _ extends Extension<Details, {
  // Blocks
}> {
  init(env: Environment) { }

  defineBlocks(): _["BlockDefinitions"] {
    return {

    }
  }
}

export = _;