import { ArgumentType, BlockType, BlockUtilityWithID, Environment, extension, scratch } from "$common";
import formatMessage from './format-message'; // This should actually be an npm package and thus be 'format-message'

const details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
  iconURL: "example.png",
  insetIconURL: "thumbnail.svg"
}

export default class SomeBlocks extends extension(details) {

  init(env: Environment) { }

  @(scratch.reporter`letter ${
    { 
      type: "string", 
      defaultValue: 'text', 
      options: [{ text: 'Item One', value: 'itemId1' },'itemId2'] 
    }
  } of ${{ type: "number", defaultValue: 1 }}`)
  myReporter(text: string, letterNum: number, util: BlockUtilityWithID) {
    const message = formatMessage({
      id: 'myReporter.result',
      default: 'Letter {letterNum} of {text} is {result}.',
      description: 'The text template for the "myReporter" block result'
    });

    const result = text.charAt(letterNum);

    return message.format({ text, letterNum, result });
  }
}