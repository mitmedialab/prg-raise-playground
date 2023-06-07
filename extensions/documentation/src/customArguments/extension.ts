import { codeSnippet, notRelevantToExample } from "documentation";

const definedBelow: any = {}

export const x = codeSnippet();

import { block, extension } from "$common";

type MyCustomArgument = { a: number, b: string, c: boolean };

const details = { name: "Extension using Custom Arguments" };

/**
 * IMPORTANT! Note the usage of "customArguments" passed as an 'add on' 
 * in the second argument of the `extension` factory function.
 * This effectively 'adds on' to your extension the ability to create custom arguemnts. 
 */
export default class ExtensionWithCustomArgument extends extension(details, "customArguments") {
  init = notRelevantToExample;

  @block(definedBelow)
  blockWithCustomArgument(arg: MyCustomArgument) { }
}

x.end;

export type { MyCustomArgument };
export { details }