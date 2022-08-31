import { ArgumentType, BlockType, Branch } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment } from "../../typescript-support/types";
import getTranslations from "./translations";

type Details = {
  name: "Super Simple Typescript Extension",
  description: "Skeleton for a typescript extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

class SimpleTypescript extends Extension<Details, {
  log: (msg: string, a: string) => void;
  dummy: () => void;
}> {
  init(env: Environment) { }

  getTranslations = getTranslations;

  defineBlocks(): SimpleTypescript["BlockDefinitions"] {
    return {
      log: () => ({
        type: BlockType.Command,
        args: [
          {
            type: ArgumentType.String, 
            options: {
              items: ['one', 'two', 'three'],
              acceptsReporters: true,
              handler: (x: any) => Extension.TryCastToArgumentType(ArgumentType.String, x, () => {
                alert(`Unsopported input: ${x}`);
                return "";
              })
            }
          }, ArgumentType.String],
        text: (msg) => `Log ${msg} to the console`,
        operation: (msg) => console.log(msg)
      }),
      dummy: () => ({
        type: BlockType.Loop,
        text: "Dummy loop",
        operation: util => util.startBranch(Branch.First, true)
      })
    }
  }
}

export = SimpleTypescript;