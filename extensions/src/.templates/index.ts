import { Extension, Environment } from "$common";
import defineTranslations from "./translations";

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

  // Ignore! Translations are still a work in progress (but will be supported)
  defineTranslations = defineTranslations;
}