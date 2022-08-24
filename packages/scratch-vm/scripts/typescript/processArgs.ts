import { UnionToTuple } from "../../src/typescript-support/types";
import { TranspileOptions } from "./transpile";

type CommandLineFlags = { watch: string; cache: string };

// @ts-ignore
const options: UnionToTuple<keyof TranspileOptions> = [ "doWatch", "useCaches"];
// @ts-ignore
const flags: UnionToTuple<keyof CommandLineFlags> = ['watch', 'cache'];

const optionByFlag: Record<keyof CommandLineFlags, keyof TranspileOptions> = {
  watch: 'doWatch', 
  cache: 'useCaches',
};  

const validateFlag = (flag: string) => {
  if (flags.includes(flag as keyof CommandLineFlags)) return;
  throw new Error(`Could not parse flag: ${flag}`);
} 

export const processArgs = () => {
  const args = process.argv.slice(2);
  return args.reduce((input: TranspileOptions, value, index) => {
    const setting = value.split("=");
    const includesFlag = setting.length > 1;

    if (!includesFlag) {
      const key = options[index];
      input[key] = JSON.parse(value.toLowerCase());
      return input;
    }

    const flag = setting[0] as keyof CommandLineFlags;
    validateFlag(flag);

    const key = optionByFlag[flag];
    input[key] = JSON.parse(setting[1].toLowerCase());
    return input;
  }, { 
    doWatch: false, 
    useCaches: false,
  });
}