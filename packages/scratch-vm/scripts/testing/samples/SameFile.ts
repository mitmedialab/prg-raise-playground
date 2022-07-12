import { Extension } from "../../../src/typescript-support/Extension";
import { notImplemented } from "../common";

type DisplayDetails = {
  title: "SameFile_title",
  description: "SameFile_description",
  iconURL: "SameFile_iconURL",
  insetIconURL: "SameFile_insetIconURL",
}

export class SameFile extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}