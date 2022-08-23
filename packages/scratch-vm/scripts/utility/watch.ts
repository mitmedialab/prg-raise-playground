import { readFileSync } from "fs";
import path = require("path");
import chokidar = require('chokidar');
import { transpileOnChange } from "../transpile";

export const watchExtensionEntry = (entry: string) => {
  const dir = path.dirname(entry);
  const gitignore = path.join(dir, ".gitignore");
  const ignoredFiles = readFileSync(gitignore, 'utf-8').split("\n") .filter(line => !line.startsWith("#"));
  const watcher = chokidar.watch(dir, { persistent: true });
  watcher.on('all', (event, filepath) => {
    switch (event) {
      case 'add':
        return;
      case 'unlinkDir':
        return;
      case 'change':
        const relativePath = path.relative(dir, filepath);
        if (ignoredFiles.includes(relativePath)) return;
        console.log(`Retranspiling due to change event from: ${relativePath}`);
        return transpileOnChange(entry);
      case 'unlink':
        return;
      case 'unlinkDir':
        return;
    }
  });
}