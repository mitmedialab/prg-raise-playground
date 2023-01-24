import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet, notRelevantToExample } from "documentation";
import { BlockDefinitions, BlockType, Extension } from "$common";
import { MyCustomArgument, Blocks } from "./extension";

export const x = codeSnippet();

export default class ExtensionWithCustomArgument extends Extension<DefaultDisplayDetails, Blocks> {
  init = notRelevantToExample;

  defineBlocks(): BlockDefinitions<ExtensionWithCustomArgument> {
    return {
      blockWithCustomArgument: {
        type: BlockType.Command,
        text: (arg) => `Set custom argument ${arg}`,

        /** Invoke the member `makeCustomArgument` function of the Extension class, which requires:
         * - component: The name of the `.svelte` file that should be display when this argument is clicked on.
         * - initial: The value that the argument should default to. NOTE that this item has both a 'text' and 'value' field. 
         *  - This is because the value of the custom argument must be able to be represented as a string and displayed directly in the block
         *    once the UI closes -- this is what the 'text' field is used for. Whenever you set a custom argument, 
         *    you'll need to provide both a 'value' and a 'text' representation of that value.
         *    Here, we use the method `convertArgToText` (see below), which implements this conversion process for our custom type.
         */
        arg: this.makeCustomArgument({
          component: "MyArgUI",
          initial: { value: { a: 10, b: "Hello world", c: false }, text: this.convertArgToText({ a: 10, b: "Hello world", c: false }), }
        }),

        /** Our operation should expect an input that matches our custom argument type */
        operation: (arg) => {
          const { a, b, c } = arg;
          console.log(`${b}: ${a}, ${c}`);
        }
      }
    }
  };

  convertArgToText(arg: MyCustomArgument) {
    const { a, b, c } = arg;
    return `${a}, \"${b}\", ${c}`;
  }
}

x.end;