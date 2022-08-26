import { ArgumentType, BlockType, Branch } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment, BlockDefinitions } from "../../typescript-support/types";

type Details = {
  name: "Super Simple Typescript Extension",
  description: "Skeleton for a typescript extension",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

class SimpleTypescript extends Extension<Details, {
  log: (msg: string) => void;
  dummy: () => void;
}> {
  init(env: Environment) { }

  defineBlocks(): SimpleTypescript["BlockDefinitions"] {
    return {
      log: () => ({
        type: BlockType.Command,
        args: [
          {
            type: ArgumentType.String, 
            options: {
              items: ['1', '2', '3'],
              handler: (x: any) => {
                if (typeof x === 'string' || x instanceof String) return x as string;
                return `Unsopported input: ${x}`
              }
            }
          }],
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