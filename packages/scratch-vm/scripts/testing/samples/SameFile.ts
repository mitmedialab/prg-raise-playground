import { Extension } from "../../../src/typescript-support/Extension";
import { notImplemented } from "../common";

type DisplayDetails = {
  title: "title",
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}

export class SameFileA extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

type title = "title";
type description = "description";
type iconURL = "iconURL";
type insetIconURL = "insetIconURL";

type DisplayDetailsAggregated = {
  title: title,
  description: description,
  iconURL: iconURL,
  insetIconURL: insetIconURL,
}

export class SameFileB extends Extension<DisplayDetailsAggregated, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}