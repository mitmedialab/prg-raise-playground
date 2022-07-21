import { Extension } from "../../src/typescript-support/Extension";
import { DisplayDetailsRetrievalPaths } from "./common";

export const location = () => __filename;


const notImplemented = () => { throw new Error("Method not implemented."); }

class Inline extends Extension<{
  title: "test_title",
  description: "test_description",
  iconURL: "test_iconURL",
  insetIconURL: "test_insetIconURL",
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

export type DisplayDetails = {
  title: "test_title",
  description: "test_description",
  iconURL: "test_iconURL",
  insetIconURL: "test_insetIconURL",
}

class SameFile extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

export const cachedPathsToMenuDetails: DisplayDetailsRetrievalPaths = {
  title: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[0].type.literal.text',
  ],
  description: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[1].type.literal.text',
  ],
  iconURL: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[2].type.literal.text',
  ],
  insetIconURL: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[3].type.literal.text',
  ]
};

export const typeCount = [Inline, SameFile].length;