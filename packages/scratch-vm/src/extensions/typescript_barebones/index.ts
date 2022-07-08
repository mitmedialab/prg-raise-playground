import { ArgumentType, BlockType } from "../../typescript-support/enums";
import type { ScratchExtension, ExtensionMetadata } from "../../typescript-support/types";

class BarebonesTs implements ScratchExtension {
  getInfo(): ExtensionMetadata {
    return {
      id: 'barebonesTs',
      blocks: [{
        opcode: 'log',
        blockType: BlockType.Command,
        text: 'Log [LETTER_NUM] to the console',
        arguments: {
          LETTER_NUM: {
            type: ArgumentType.String,
            defaultValue: 'Hello'
          }
        }
      }]
    }
  }

  log(args) {
    console.log(args.LETTER_NUM);
  }

}

export = BarebonesTs;