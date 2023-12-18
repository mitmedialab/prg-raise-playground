import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

/**
 * Parses command line arguments
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