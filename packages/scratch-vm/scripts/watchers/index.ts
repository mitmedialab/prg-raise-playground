import { writeFileSync } from "fs";
import path = require("path");
import { vmSrc } from "../../../../scripts/paths";
import svelteWatcher from "./svelteWatcher";
import chalk = require("chalk");

export type Watcher = {
  close: () => void;
}

export type MakeWatcher = (refresh: typeof triggerRefresh) => Watcher;

const flagContent = "export type EnsureInclusionInTypescriptProgram = never;"
const flagFile = path.join(vmSrc, "typescript-support", "flag.ts");
const triggerRefresh = () => writeFileSync(flagFile, flagContent);

export const getAllWatchers = () => [svelteWatcher(triggerRefresh)];