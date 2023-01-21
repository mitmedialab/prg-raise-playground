import { Extension, ArgumentType, BlockType, Environment } from "$common";
// @ts-ignore 
import formatMessage from 'format-message';

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

          // This doesn't actually work/compile -- perhaps the formatMessage API changed since the Scratch example was made
          return message.format({ text, letterNum, result });
        }
      })
    }
  }
}