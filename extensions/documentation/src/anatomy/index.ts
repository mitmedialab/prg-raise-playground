import { Extension } from "$common";
import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "documentation";

type DisplayDetails = DefaultDisplayDetails;
type Blocks = {};

export const x = codeSnippet();
export default class ExampleExtension extends Extension<DisplayDetails, Blocks> {
  init;
  defineBlocks;
}
x.end;

