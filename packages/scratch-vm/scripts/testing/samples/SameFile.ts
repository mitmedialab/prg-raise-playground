import { Extension } from "../../../src/typescript-support/Extension";
import { notImplemented, Title, Description, IconURL, InsetIconURL } from "../common";

type name = "SameFile";

type DisplayDetails = {
  title: Title<name>;
  description: Description<name>;
  iconURL: IconURL<name>;
  insetIconURL: InsetIconURL<name>;
}

class SameFile extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}