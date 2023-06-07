import Extension from ".";
import { Language } from "$common";

// Ignore this file for now! 
// Translations are still a work in progress, but will be supported (woohoo!)

const defineTranslations = (): Extension["Translations"] => ({
  [Language.Español]: undefined,
});

export default defineTranslations;