import { ArgumentType, BlockType, Environment, block, extension } from "$common";
import BlockUtility from "$root/scratch-packages/scratch-vm/src/engine/block-utility";
import formatMessage from './format-message'; // This should actually be an npm package and thus be 'format-message'

const details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
  iconURL: "example.png",
  insetIconURL: "thumbnail.svg"
}

export default class SomeBlocks extends extension(details) {

  init(env: Environment) { }

  @block({
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
  })
  myReporter(text: string, letterNum: number, util: BlockUtility) {
    const message = formatMessage({
      id: 'myReporter.result',
      default: 'Letter {letterNum} of {text} is {result}.',
      description: 'The text template for the "myReporter" block result'
    });

    const result = text.charAt(letterNum);

    return message.format({ text, letterNum, result });
  }
}