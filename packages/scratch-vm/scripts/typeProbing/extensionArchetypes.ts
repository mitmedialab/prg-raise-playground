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
  blockBuilders = notImplemented;
}

class InlineB extends Extension<{
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class InlineC extends Extension<{
  title: "title",
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class InlineD extends Extension<{
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class SameFileA extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class SameFileB extends Extension<DisplayDetailsAggregated, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class SameFileC extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

class SameFileD extends Extension<DisplayDetailsAggregated, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

export const cachedPathsToMenuDetails: DisplayDetailsRetrievalPaths = {
  description: [
    "symbol.declarations[0].nextContainer.members[1].name.escapedText",
    "symbol.declarations[0].parent.statements[1].declarationList.declarations[0].initializer.nextContainer.nextContainer.type.literal.text",
  ],
  iconURL: [
    "symbol.declarations[0].nextContainer.members[2].name.escapedText",
    "symbol.declarations[0].parent.statements[1].declarationList.declarations[0].initializer.nextContainer.nextContainer.nextContainer.type.literal.text",
  ],
  insetIconURL: [
    "symbol.declarations[0].nextContainer.members[3].name.escapedText",
    "symbol.declarations[0].parent.statements[1].declarationList.declarations[0].initializer.nextContainer.nextContainer.nextContainer.nextContainer.type.literal.text",
  ],
  title: [
    "symbol.declarations[0].nextContainer.members[0].name.escapedText",
    "symbol.declarations[0].parent.statements[1].declarationList.declarations[0].initializer.nextContainer.type.literal.text",
  ],
};