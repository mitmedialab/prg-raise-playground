import extension = require(".")
import { Language } from "../../typescript-support/enums";
import { Translations } from "../../typescript-support/types";

const overrides: Translations<extension> = {
  [Language.English]: undefined
}

export default overrides;