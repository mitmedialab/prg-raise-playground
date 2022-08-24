import { existsSync, unlinkSync, writeFileSync } from "fs";
import path = require("path");
import chalk = require("chalk");

const readyFile = path.join(__dirname, "TS_IS_READY");
const errorFile = path.join(__dirname, "TS_ERROR");

const files = [readyFile, errorFile];

const deleteFile = (file: string) => {
  try {
    unlinkSync(file);
  } catch(err) {
    console.error(err)
  }
}

export const reset = () => files.forEach(file => {if (existsSync(file)) deleteFile(file)});

const checkForError = () => {
  if (!existsSync(errorFile)) return;
  deleteFile(errorFile);
  const msg = chalk.redBright("Transpilation failed. Exiting...");
  throw new Error(msg);
}

export const isTsReady = () => {
  checkForError();
  const exists = existsSync(readyFile);
  if (!exists) return false;
  reset();
  return true;
}

export const setTsIsReady = () => writeFileSync(readyFile, "");
export const raiseError = () => writeFileSync(errorFile, "");