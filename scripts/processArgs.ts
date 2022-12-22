const parse = (value: any) => {
  try {
    return JSON.parse(value.toLowerCase())
  }
  catch {
    return value; // must be string (not bool or number)
  }
}

/**
 * @description
 * Process arguments passed to node process.
 * It differs from typical command line parsing in that it assumes args either come in:
 *  * one after the other, for example: `node script.js arg1 arg2 arg3`
 *  * Or as key value pairs seperated by an '=', for example: `node script.ts arg1=true arg5=hello`
 * @todo Handle string inputs w/ spaces (should enforce using quotes, eg. node script.js stringArg="Hello world")
 * @param flagForOptions Order matters!
 * @param defaults 
 * @returns 
 */
export const processArgs = <TProcessedOutput>(
  flagForOptions: Record<keyof TProcessedOutput, string>,
  defaults: TProcessedOutput
) => {
  const args = process.argv.slice(2);
  const options = Object.keys(flagForOptions);
  const flags: string[] = Object.values(flagForOptions);
  const optionByFlag = Object.entries<string>(flagForOptions).reduce((output, [option, flag]) => {
    output[flag] = option;
    return output;
  }, {});

  return args.reduce((output: TProcessedOutput, value, index) => {
    const setting = value.split("=");
    const includesFlag = setting.length > 1;

    if (!includesFlag) {
      const key = options[index];
      output[key] = parse(value);
      return output;
    }

    const flag = setting[0];
    if (!flags.includes(flag)) throw new Error(`The passed in command line flag '${flag}' is not valid. Valid options are: ${flags.join(", ")}`);

    const key = optionByFlag[flag];
    output[key] = parse(setting[1]);
    return output;
  }, { ...defaults });
}