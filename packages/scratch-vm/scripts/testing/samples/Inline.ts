import { Extension } from "../../../src/typescript-support/Extension";
import { Description, IconURL, InsetIconURL, notImplemented, Title } from "../common";

export class Inline extends Extension<{
  title: "Inline_title",
  description: "Inline_description",
  iconURL: "Inline_iconURL",
  insetIconURL: "Inline_insetIconURL",
}, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}