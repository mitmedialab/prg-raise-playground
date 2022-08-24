import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment, BlockDefinitions } from "../../typescript-support/types";

type Details = {
  name: "REPLACE_ME",
  description: "REPLACE_ME",
  iconURL: "REPLACE_ME",
  insetIconURL: "REPLACE_ME"
};

class REPLACE_ME extends Extension<Details, {
  example: (argument: string) => void;
}> {
  init(env: Environment) { }

  defineBlocks(): REPLACE_ME["BlockDefinitions"] {
    return {

      example: (self: REPLACE_ME) => ({
        type: BlockType.Command,
        args: [ArgumentType.String],
        text: (argument) => `Replace with block's display text using ${argument}`,
        operation: () => {          
          // Replace with what the block should do! 
        }
      }),

     }
  }
}

export = REPLACE_ME;