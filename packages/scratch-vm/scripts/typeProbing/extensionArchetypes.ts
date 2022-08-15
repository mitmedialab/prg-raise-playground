import { Extension } from "../../src/typescript-support/Extension";
import { DisplayDetailsRetrievalPaths } from "./common";

export const location = () => __filename;

export type Title = "title";
export type Description = "description";
export type IconURL = "iconURL";
export type InsetIconURL = "insetIconURL";

const notImplemented = () => { throw new Error("Method not implemented."); }

type DisplayDetails = {
  title: "title",
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}

type DisplayDetailsAggregated = {
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}

class InlineA extends Extension<{
  title: "title",
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class InlineB extends Extension<{
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

type ti = "ti";
type tle = "tle";

class InlineC extends Extension<{
  title: `${ti}${tle}`,
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class InlineD extends Extension<{
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class SameFileA extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class SameFileB extends Extension<DisplayDetailsAggregated, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class SameFileC extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

class SameFileD extends Extension<DisplayDetailsAggregated, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

export const cachedPathsToMenuDetails: DisplayDetailsRetrievalPaths = {
  title: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[0].name.escapedText',
    'resolvedTypeArguments[0].symbol.declarations[0].members[0].symbol.escapedName'
  ],
  description: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[1].name.escapedText',
    'resolvedTypeArguments[0].symbol.declarations[0].members[1].symbol.escapedName'
  ],
  iconURL: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[2].name.escapedText',
    'resolvedTypeArguments[0].symbol.declarations[0].members[2].symbol.escapedName'
  ],
  insetIconURL: [
    'resolvedTypeArguments[0].symbol.declarations[0].members[3].name.escapedText',
    'resolvedTypeArguments[0].symbol.declarations[0].members[3].symbol.escapedName'
  ]
};

export const typeCount = [
  InlineA, 
  InlineB, 
  InlineC, 
  InlineD, 
  SameFileA, 
  SameFileB, 
  SameFileC, 
  SameFileD].length;
