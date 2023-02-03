import { processArgs } from "./processArgs";

export const flagByOption = { watch: "watch", specifiedDir: "only" };
export const optionDefaults = { watch: false, specifiedDir: "" };

export const processOptions = (defaultOverrides?: Partial<typeof optionDefaults>) =>
  processArgs(
    flagByOption,
    defaultOverrides ? { ...optionDefaults, ...defaultOverrides } : optionDefaults
  );
