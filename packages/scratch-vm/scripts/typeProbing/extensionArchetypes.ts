import { Extension } from "../../src/typescript-support/Extension";

export const location = () => __filename;

const notImplemented = () => { throw new Error("Method not implemented."); }

class Inline extends Extension<{
  name: "test_title",
  bluetoothRequired: false,
  description: "test_description",
  iconURL: "test_iconURL",
  insetIconURL: "test_insetIconURL",
}, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

export type DisplayDetails = {
  name: "test_title",
  description: "test_description",
  iconURL: "test_iconURL",
  insetIconURL: "test_insetIconURL",
}

class SameFile extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  defineBlocks = notImplemented;
}

export const typeCount = [Inline, SameFile].length;