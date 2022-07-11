import { Extension } from "../../../src/typescript-support/Extension";
import { Description, IconURL, InsetIconURL, notImplemented, Title } from "../common";

type name = "Inline";

class Inline extends Extension<{
  title: Title<name>,
  description: Description<name>,
  iconURL: IconURL<name>,
  insetIconURL: InsetIconURL<name>,
},{}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}