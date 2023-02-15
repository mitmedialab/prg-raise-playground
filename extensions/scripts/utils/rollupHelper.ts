import path from "path";
import chalk from 'chalk';
import { watch, type RollupOptions, type OutputOptions } from "rollup";
import { commonDirectory } from "./fileSystem";

export const runOncePerBundling = (): { check: () => boolean, internal?: any } =>
  ({ internal: 0, check() { return 0 === (this.internal++ as number) } });