import fs from "fs";
import path from "path";

export const debug = async (code: string, id: string, optOut: boolean = false) => {
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