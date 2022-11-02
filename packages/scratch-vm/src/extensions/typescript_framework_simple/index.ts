import { ArgumentType, BlockType, Branch, Language } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { ButtonBlock, Environment } from "../../typescript-support/types";
import defineTranslations from "./translations";

type Details = {
  name: "Super Simple Typescript Extension",
  description: "Skeleton for a typescript extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg",
  implementationLanguage: Language.English,
  [Language.Español]: {
    name: "Extensión simple Typescript",
    description: "Ejemplo de una extensión simple usando Typescript"
  }
};

class SimpleTypescript extends Extension<Details, {
  log: (msg: string) => void;
  dummy: ButtonBlock;
}> {
  init(env: Environment) {
  }

  defineTranslations = defineTranslations;

  defineBlocks(): SimpleTypescript["BlockDefinitions"] {
    return {
      log: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: {
            items: ['one', 'two', 'three'],
            acceptsReporters: true,
            handler: (x: any) => Extension.TryCastToArgumentType(ArgumentType.String, x, () => {
              alert(`Unsopported input: ${x}`);
              return "";
            })
          }
        },
        text: (msg) => `Log ${msg} to the console`,
        operation: (msg) => console.log(msg)
      }),
      dummy: () => ({
        type: BlockType.Button,
        text: "Dummy Block",
        operation: () => console.log("hi")
      })
    }
  }
}

export = SimpleTypescript;