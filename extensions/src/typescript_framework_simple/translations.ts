import Extension from "."
import { Language } from "$ExtensionFramework";

const defineTranslations = (): Extension["Translations"] => ({
  [Language.Español]: undefined
});

export default defineTranslations;