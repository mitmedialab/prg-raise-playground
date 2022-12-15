import fs from "fs";
import path from "path";
import type { PopulateCodeGenArgs } from "$ExtensionFramework";
import rollup from "rollup";

const debug = async (code: string, id: string, optIn: boolean = true) => {
  if (!optIn) return; // change this to opt in/out of debugging
  const outDir = path.join(__dirname, "fragments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const sanitizer = await (await import("sanitize-filename")).default;
  const name = sanitizer(path.basename(id));
  fs.writeFileSync(path.join(outDir, name), code);
}

export const extractMenuDetailsFromType = () => {
  return {
    name: 'extract-menu-details-from-extension-type',
    transform: {
      order: 'pre',
      handler: (code: string, id: string) => {
        debug(code, id, true);
      }
    }
  }
}

export const fillInCodeGenArgs = (opts = {}) => {
  return {
    name: 'fill-in-code-gen-args-for-extension',
    transform: {
      order: 'post',
      handler: (code: string, id: string) => {
        const codeGenArgs: PopulateCodeGenArgs = {
          id: "test",
          name: "test",
          blockIconURI: "",
        };
        code = code.replace("= codeGenArgs", `= /* codeGenArgs */ ${JSON.stringify(codeGenArgs)}`);
        debug(code, id, false);
        return { code, map: null }
      }
    }
  };
}
