import { Extension, ArgumentType, BlockType, Environment } from "$common";
import formatMessage from './format-message'; // This should actually be an npm package and thus be 'format-message'

type Details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
  iconURL: "example.png",
  insetIconURL: "inset.png"
};

export default class SomeBlocks extends Extension<Details, {
  myReporter: (text: string, letterNum: number) => string;
}> {

  init(env: Environment) { }

  defineBlocks(): SomeBlocks["BlockDefinitions"] {
    return {
      myReporter: (self: SomeBlocks) => ({
        type: BlockType.Reporter,
        args: [
          {
            type: ArgumentType.String,
            defaultValue: 'text',
            options: [
              { text: 'Item One', value: 'itemId1' },
              'itemId2'
            ]
          },
          { type: ArgumentType.Number, defaultValue: 1 }
        ],
        text: (text, letterNum) => `letter ${letterNum} of ${text}'`,
        operation: (text, letterNum, util) => {

          const message = formatMessage({
            id: 'myReporter.result',
            default: 'Letter {letterNum} of {text} is {result}.',
            description: 'The text template for the "myReporter" block result'
          });

          const result = text.charAt(letterNum);

          return message.format({ text, letterNum, result });
        }
      })
    }
  }
}