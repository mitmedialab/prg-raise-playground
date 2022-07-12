import { Extension } from "../../../src/typescript-support/Extension";
import { Description, IconURL, InsetIconURL, notImplemented, Title } from "../common";

export class InlineA extends Extension<{
  title: "title",
  description: "description",
  iconURL: "iconURL",
  insetIconURL: "insetIconURL",
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}

type title = "title";
type description = "description";
type iconURL = "iconURL";
type insetIconURL = "insetIconURL";

export class InlineB extends Extension<{
  title: title,
  description: description,
  iconURL: iconURL,
  insetIconURL: insetIconURL,
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}