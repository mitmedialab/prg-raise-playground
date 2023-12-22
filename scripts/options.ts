import yargs, { type PositionalOptions, type InferredOptionType, Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers'

/**
 * Parses command line arguments (for the build script)
 * @param argv `process.argv`
 */
export default (argv: string[]) => yargs(hideBin(argv))
    .option("watch", {
        alias: "w",
        type: "boolean",
        default: true,
        description: "Watch for changes"
    })
    .option("include", {
        alias: "i",
        type: "string",
        array: true,
        description: "Only build specified extension(s)",
        demandOption: true,
    })
    .option("parrallel", {
        alias: "p",
        type: "boolean",
        default: true,
        description: "Build extensions in parallel (memory intensive)",
    })
    .parseSync();


const flagify = (name: string) => `--${name}`;
const flagifyPair = ([flag, value]: string[]) => [flagify(flag), value] as const;

/**
 * 
 * @param args 
 * @returns 
 */
export const convertToFlags = (args: Record<string, string>) => Object.entries(args).map(flagifyPair).flat();

/**
 * 
 * @param names 
 * @returns 
 */
export const asFlags = (...names: string[]) => names.map(flagify);

export type PositionalArg = [string, PositionalOptions];
type PositionalArgsToObject<T extends PositionalArg[]> = {
    [P in T[number][0]]: InferredOptionType<Extract<T[number], [P, any]>[1]>;
};

export const parsePositionalArgs = <const T extends [string, PositionalOptions][]>(...args: T): PositionalArgsToObject<T> => {
    const commandString = `$0 ${args.map(([name, options]) => options.default ? `[${name}]` : `<${name}>`).join(" ")}`;
    const options = yargs(hideBin(process.argv)).command(commandString, "", yargs => {
        args.reduce((acc, [name, options]) => acc.positional(name, options), yargs);
    }).parseSync();
    return options as any as PositionalArgsToObject<T> & Arguments;
}