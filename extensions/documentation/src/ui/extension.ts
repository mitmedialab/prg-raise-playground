import { codeSnippet, notRelevantToExample } from "documentation";

export const x = codeSnippet();

import { extension } from "$common";

const name = "Button Examples";

/**
 * IMPORTANT! Note the usage of "ui" passed as an 'add on' 
 * in the second argument of the `extension` factory function.
 * This effectively 'adds on' to your extension the ability to open UI. 
 */
export default class ExampleExtension extends extension({ name }, "ui") {
  init = notRelevantToExample;
}

x.end;