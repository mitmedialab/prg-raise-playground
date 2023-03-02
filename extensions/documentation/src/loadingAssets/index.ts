import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "../../";

export const x = codeSnippet();

import { Extension } from "$common";

export default class ExampleThatUsesAsset extends Extension<DefaultDisplayDetails, {}> {
  pathToMyAsset: string;

  init(): void {
    // This will give us a URL where the asset 'mySpecialPicture.jpg' is hosted
    this.pathToMyAsset = this.getAssetPath("mySpecialPicture.jpg");
  }

  defineBlocks = notRelevant;
}

x.end;

import { BlockDefinitions } from "$common";
const notRelevant: () => BlockDefinitions<ExampleThatUsesAsset> = () => ({});