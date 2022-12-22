import path from "path";
import { copyFileSync, existsSync } from "fs";
import { generatedMenuDetailsDir, prgLogo, raiseLogo } from "scripts/utils/fileSystem";
import { ExtensionMenuDisplayDetails } from "$common";

export const iconDefaults = {
  iconURL: raiseLogo,
  insetIconURL: prgLogo
}

type Key = keyof typeof iconDefaults;
export type PathToIcons = Record<Key, string>;

const getPathToDefault = (key: keyof typeof iconDefaults) => {
  const location = iconDefaults[key];
  const fileName = path.basename(location);
  const destination = path.join(generatedMenuDetailsDir, fileName);
  if (!existsSync(destination)) copyFileSync(location, destination);
  return `../${fileName}`;
}

const copyOverFileAndGetImportPath = (key: keyof typeof iconDefaults, name: string, source: string, destination: string): string => {
  const nameInvalid = name === "" || !name;
  if (nameInvalid) return getPathToDefault(key);
  const location = path.join(source, name);
  if (!existsSync(location)) return getPathToDefault(key);
  const destinationLocation = path.join(destination, name);
  copyFileSync(location, destinationLocation);
  return `./${name}`;
}

type Entry = [keyof typeof iconDefaults, string];

export const copyIconsToAssetsDirectory = (source: string, destination: string, { iconURL, insetIconURL }: ExtensionMenuDisplayDetails): PathToIcons =>
  Object.entries({ iconURL, insetIconURL })
    .map(([key, name]: Entry) => [key, copyOverFileAndGetImportPath(key, name, source, destination)])
    .reduce((acc, [key, path]) => {
      if (!(key in acc)) throw new Error(`Unexpected key: ${key}`)
      acc[key] = path;
      return acc;
    }, { insetIconURL: undefined, iconURL: undefined });