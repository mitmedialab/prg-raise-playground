import Extension = require(".")
import { Language } from "../../typescript-support/enums";

const defineTranslations = (): Extension["Translations"] => ({
  [Language.Español]: undefined
});

export default defineTranslations;