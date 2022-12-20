import Extension from "."
import { Language } from "$common";

const defineTranslations = (): Extension["Translations"] => ({
  [Language.Español]: undefined
});

export default defineTranslations;