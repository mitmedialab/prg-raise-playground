import { processArgs } from "./processArgs";

export const flagByOption = { watch: "watch", specifiedDir: "only", individually: "onebyone" };
export const optionDefaults = { watch: true, specifiedDir: "", individually: false };

export const processOptions = (defaultOverrides?: Partial<typeof optionDefaults>) =>
  processArgs(
    flagByOption,
    defaultOverrides ? { ...optionDefaults, ...defaultOverrides } : optionDefaults
  );
