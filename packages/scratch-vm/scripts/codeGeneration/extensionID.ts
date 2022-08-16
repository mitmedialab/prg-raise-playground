import assert = require("assert");
import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import { CodeGenID } from "../../src/typescript-support/Extension";

const codeGenGaurd: CodeGenID = "CODE GEN GUARD: Extension ID";

export const fillInIDsForExtensions = (extensions: string[], getExtensionLocation: (id: string) => string) => {
  const encoding = "utf-8";
  for (const id of extensions) {
    const dir = getExtensionLocation(id);
    const index = path.join(dir, "index.js");
    const content = readFileSync(index, { encoding });
    assert(content.includes(codeGenGaurd), `Uh oh! The index file for the ${id} extension did not include the code gen ID. TO DO... more info...`);
    writeFileSync(index, content.replace(codeGenGaurd, id), encoding);
  }
};