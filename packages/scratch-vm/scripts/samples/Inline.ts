import { Extension } from "../../src/typescript-support/Extension";
import { notImplemented } from "./common";

export default class Inline extends Extension<{
  title: "Inline_title",
  description: "",
  iconURL: "",
  insetIconURL: "",
},{}>{
  init = notImplemented();
  blockBuilders = notImplemented();
}