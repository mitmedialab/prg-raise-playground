import { codeSnippet, notRelevantToExample } from "documentation"
import { BlockType, Extension } from "$common"
import { DefaultDisplayDetails } from "$testing/defaults";
import { BlockTypes as Blocks } from "./declaration";

export const x = codeSnippet();

export default class ExampleExtension extends Extension<DefaultDisplayDetails, Blocks> {
  init = notRelevantToExample;

  defineBlocks(): ExampleExtension["BlockDefinitions"] {
    return {
      someButton: () => ({
        type: BlockType.Button,
        text: `Button Text Goes Here`,
        operation: () => this.openUI("SvelteFileName", "Title of Window")
      })
    }
  }
}

x.end;