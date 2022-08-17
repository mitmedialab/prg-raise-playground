import assert = require("assert");
import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import { CodeGenID, CodeGenName } from "../../src/typescript-support/Extension";
import { encode } from "../../src/extension-support/extension-id-factory";
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const idGuard: CodeGenID = "CODE GEN GUARD: Extension ID";
const nameGuard: CodeGenName = "CODE GEN GUARD: Extension Name";

export const fillInIDsForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>, getExtensionLocation: (id: string) => string) => {
  const encoding = "utf-8";
  for (const id in extensions) {
    const dir = getExtensionLocation(id);
    const index = path.join(dir, "index.js");
    const content = readFileSync(index, { encoding });
    assert(content.includes(idGuard), `Uh oh! The index file for the ${id} extension did not include the code gen ID. TO DO... more info...`);
    const encodedID = encode(id);
    const { name } = extensions[id];
    const generated = content.replace(idGuard, encodedID).replace(nameGuard, name);
    writeFileSync(index, generated, encoding);
  }
};