import path from "path";
import fs from "fs";
import assert from "assert";

export const root = path.resolve(__dirname, "..");

const getPackage = (name: string) => path.join(root, "scratch-packages", `scratch-${name}`);

export const packages = {
  gui: getPackage("gui"),
  vm: getPackage("vm"),
}

export const vmSrc = path.join(packages.vm, "src");
export const guiSrc = path.join(packages.gui, "src");
export const extensionsFolder = path.join(root, "extensions");


assert(fs.existsSync(root));
Object.values(packages).forEach(location => fs.existsSync(location));