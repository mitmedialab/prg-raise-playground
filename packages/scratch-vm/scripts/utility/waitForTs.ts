import { existsSync, unlinkSync, writeFileSync } from "fs";
import path = require("path");

const readyFile = path.join(__dirname, "TS_IS_READY");

export const reset = () => {
  if (!existsSync(readyFile)) return;
  
  try {
    unlinkSync(readyFile);
  } catch(err) {
    console.error(err)
  }
}

export const isTsReady = () => {
  const exists = existsSync(readyFile);
  if (!exists) return false;
  reset();
  return true;
}

export const setTsIsReady = () => writeFileSync(readyFile, "");