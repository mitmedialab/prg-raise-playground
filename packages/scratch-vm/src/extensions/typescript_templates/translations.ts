import Extension = require(".")
import { Language } from "../../typescript-support/enums";

// Ignore this file for now! 
// Translations are still a work in progress, but will be supported (woohoo!)

const defineTranslations = (): Extension["Translations"] => ({
  [Language.Español]: {}
});

export default defineTranslations;