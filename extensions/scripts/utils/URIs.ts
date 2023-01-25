import fs from "fs";
import path from "path";
import { ExtensionMenuDisplayDetails } from "$common";
import mime from "mime-types";
import { iconDefaults } from "scripts/extensionsMenu/icons";

const getValidPath = (insetIconURL: string, dir: string) => {
  if (insetIconURL === "" || !insetIconURL) return iconDefaults["insetIconURL"];
  const insetIconPath = path.join(dir, insetIconURL);
  return fs.existsSync(insetIconPath) ? insetIconPath : iconDefaults["insetIconURL"];
}

export const getBlockIconURI = ({ insetIconURL }: ExtensionMenuDisplayDetails, dir: string) => {
  let insetIconPath = getValidPath(insetIconURL, dir);
  const encoding = "base64";
  const insetSVG = fs.readFileSync(insetIconPath).toString(encoding);
  const mediaType = mime.lookup(insetIconPath);
  return `data:${mediaType};${encoding},${insetSVG}`;
}