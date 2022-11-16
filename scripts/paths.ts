import path = require("path");
import fs = require("fs");
import assert = require("assert");

export const root = path.resolve(__dirname, "..");

const getPackage = (name: string) => path.join(root, "packages", `scratch-${name}`);

export const packages = {
  gui: getPackage("gui"),
  vm: getPackage("vm"),
  blocks: getPackage("blocks"),
  render: getPackage("render"),
}

export const vmSrc = path.join(packages.vm, "src");
export const guiSrc = path.join(packages.gui, "src");
export const extensionsFolder = path.join(vmSrc, "extensions");


assert(fs.existsSync(root));
Object.values(packages).forEach(location => fs.existsSync(location));