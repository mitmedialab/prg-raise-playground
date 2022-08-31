import Extension = require(".")
import { Language } from "../../typescript-support/enums";

const getTranslations = (): Extension["Translations"] => ({
  [Language.English]: undefined,
  [Language.Español]: {
    log: {
      blockText: (msg) => `Imprime ${msg}`,
      argsText: [{options: ['uno', 'dos', 'tres'], defaultValue: 'uno'}, {}]
    },
    dummy: "nada"
  }
});

export default getTranslations;