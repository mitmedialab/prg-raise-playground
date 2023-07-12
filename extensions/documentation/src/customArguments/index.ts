import { codeSnippet, notRelevantToExample } from "documentation";
import { block, extension } from "$common";
import { MyCustomArgument, details } from "./extension";

export const x = codeSnippet();

export default class ExtensionWithCustomArgument extends extension(details, "customArguments") {
  init = notRelevantToExample;

  @block((self) => ({
    type: "command",
    text: (arg) => `Set custom argument ${arg}`,

    /** Invoke the member function `makeCustomArgument` of `self` parameter 
     * (which is an instance of our `ExtensionWithCustomArgument` class).
     * The `makeCustomArgument` function accepts an object with the following fields:
     * - component: The name of the `.svelte` file that should be displayed when this argument is clicked on.
     * - initial: The value that the argument should default to. NOTE that this item has both a 'text' and 'value' field. 
     *  - This is because the value of the custom argument must be able to be represented as a string
     *    and displayed directly in the block once the UI closes.
     *    Thus, whenever you set a custom argument, you'll need to provide both a 'value' and a 'text' 
     *    representation of that value.
     */
    arg: self.makeCustomArgument({
      component: "MyArgUI",
      initial: { value: { a: 10, b: "Hello world", c: false }, text: "[10, Hello world, false]", }
    }),
  }))
  /** Our operation should expect an input that matches our custom argument type */
  blockWithCustomArgument(custom: MyCustomArgument) {
    const { a, b, c } = custom;
    console.log(`${b}: ${a}, ${c}`);
  }
}

x.end;