import fs from "fs";
import path from "path";
import type { PopulateCodeGenArgs } from "$common";
import rollup from "rollup";

const debug = async (code: string, id: string, optOut: boolean = false) => {
  if (optOut) return;
  const outDir = path.join(__dirname, "fragments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const sanitizer = await (await import("sanitize-filename")).default;
  const basename = path.basename(id);
  const ext = path.extname(basename);
  const name = sanitizer(basename.replace(ext, ""));
  let filepath = path.join(outDir, name + ext);
  let count = 0;
  while (fs.existsSync(filepath)) {
    count++;
    filepath = path.join(outDir, name + count + ext)
  }
  fs.writeFileSync(filepath, `// ${id}\n${code}`);
}

export const extractMenuDetailsFromType = () => {
  return {
    name: 'extract-menu-details-from-extension-type',
    transform: {
      order: 'pre',
      handler: (code: string, id: string) => {
        debug(code, id);
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
        debug(code, id, true);
        return { code, map: null }
      }
    }
  };
}
