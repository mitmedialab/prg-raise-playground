import { ArgumentType, BlockType } from "../../typescript-support/enums";
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
}> {
  init(env: Environment) {}
  defineBlocks(): BlockDefinitions<{ log: (msg: string) => void; }> {
    return {
      log: () => ({
        type: BlockType.Command,
        args: [ArgumentType.String],
        text: (msg) => `Log ${msg} to the console`,
        operation: (msg) => console.log(msg)
      })
    }
  }
}

export = SimpleTypescript;