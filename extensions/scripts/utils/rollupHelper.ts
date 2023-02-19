import path from "path";
import chalk from 'chalk';
import { watch, type RollupOptions, type OutputOptions } from "rollup";
import { commonDirectory } from "./fileSystem";

export const runOncePerBundling = (): { check: () => boolean, internal?: any } =>
  ({ internal: 0, check() { return 0 === (this.internal++ as number) } });

export const hackToFilterOutUnhelpfulRollupLogs = async () => {
  const warn = console.warn;

  const toFilter = new Set([
    "@rollup/plugin-typescript TS1005: ',' expected.",
    "@rollup/plugin-typescript TS1005: ';' expected.",
    "@rollup/plugin-typescript TS1005: '>' expected.",
    "@rollup/plugin-typescript TS1005: ')' expected.",
    "@rollup/plugin-typescript TS1109: Expression expected.",
    "@rollup/plugin-typescript TS1128: Declaration or statement expected.",
    "@rollup/plugin-typescript TS1144: '{' or ';' expected.",
    "@rollup/plugin-typescript TS1434: Unexpected keyword or identifier.",
    "@rollup/plugin-typescript TS1011: An element access expression should take an argument."
  ]);

  console.warn = function (...params: any[]) {
    if (toFilter.has(params[0])) return;
    warn(...params);
  }
}