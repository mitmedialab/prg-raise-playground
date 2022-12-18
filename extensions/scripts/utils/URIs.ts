import fs from "fs";
import path from "path";
import { ExtensionMenuDisplayDetails } from "$common";
import mime from "mime-types";

export const getBlockIconURI = (details: ExtensionMenuDisplayDetails, dir: string) => {
  const { insetIconURL } = details;

  const insetIconPath = path.join(dir, insetIconURL);
  if (insetIconURL === "" || !insetIconURL || !fs.existsSync(insetIconPath)) return "";

  const encoding = "base64";
  const insetSVG = fs.readFileSync(insetIconPath).toString(encoding);
  const mediaType = mime.lookup(insetIconPath);
  return `data:${mediaType};${encoding},${insetSVG}`;
}