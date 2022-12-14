import fs from "fs";
import path from "path";
import type { PopulateCodeGenArgs } from "$ExtensionFramework";

const debug = async (code: string, id: string) => {
  if (false) return; // change this to opt in/out of debugging
  const outDir = path.join(__dirname, "fragments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const sanitizer = await (await import("sanitize-filename")).default;
  const name = sanitizer(path.basename(id));
  fs.writeFileSync(path.join(outDir, name), code);
}

export default (opts = {}) => {

  return {
    name: 'custom PRG plugin',

    transform(code: string, id: string) {
      const codeGenArgs: PopulateCodeGenArgs = {
        id: "test",
        name: "test",
        blockIconURI: "",
      };
      code = code.replace("= codeGenArgs", `= /* codeGenArgs */ ${JSON.stringify(codeGenArgs)}`);
      debug(code, id);
      return { code, map: null }
    }
  };
}
