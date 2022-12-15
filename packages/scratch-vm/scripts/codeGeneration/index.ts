import chalk = require("chalk");
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path = require("path");
import ts = require("typescript");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { profile } from "../../../../scripts/profile";
import { fillInContentForExtensions } from "./extension";
import { generateGitIgnoresForExtensions } from "./gitingore";
import { collectSvelteComponentsForExtensions } from "./svelte";
import { detailFileName, populateMenuForExtensions, generatedFileWarning } from "./menu";
import { packages, extensionsFolder } from "../../../../scripts/paths";

export type GenerationCache = ExtensionMenuDisplayDetails & {
  extensionId: string,
  tsProgramFiles: string,
  blockIconURI: string,
};

export type GenerationDetails = {
  details: ExtensionMenuDisplayDetails,
  implementationDirectory: string,
  tsProgramFiles: string[],
  assetsDirectory: string,
  cached?: GenerationCache,
  cacheUpdates: Partial<GenerationCache>
};

export type ExtensionCodeGenerator = (extensions: Record<string, GenerationDetails>) => void;

export const cacheFile = "cache.generated.json";

const { gui } = packages;

const generatedDirectory = path.join(gui, "generated");
const generatedFile = path.join(generatedDirectory, `${detailFileName}.js`);
const newline = "\n";
const tab = "\t";

const getCached = (location: string): GenerationCache | undefined => {
  const pathToCache = path.join(location, cacheFile);
  if (!existsSync(pathToCache)) return undefined;
  const cacheContent = readFileSync(pathToCache, 'utf-8');
  return JSON.parse(cacheContent) as GenerationCache;
}

const writeOutGeneratedFile = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const extensionIDs = Object.keys(extensions);
  const imports = extensionIDs.map(id => `import ${id} from './${id}/${detailFileName}';`).join(newline);
  const exports = `
export default [
  ${extensionIDs.join("," + newline + tab)}
];
`;
  writeFileSync(generatedFile, [generatedFileWarning, imports, exports].join(newline));
}

const getFilesByExtension = (program: ts.Program): Record<string, string[]> =>
  program.getSourceFiles()
    .filter(({ fileName }) => path.extname(fileName) === ".ts")
    .map(({ fileName }) => path.relative(extensionsFolder, fileName))
    .map(pathToFile => path.parse(pathToFile))
    .filter(parsed => !parsed.dir.startsWith(".."))
    .reduce((filesByExtension, parsed) => {
      const { dir, base } = parsed;
      const parts = dir.split("/");
      const extensionBase = parts[0];
      const files = filesByExtension[extensionBase];
      const fullPath = path.join(...[...parts.slice(1), base]);
      files ? files.push(fullPath) : filesByExtension[extensionBase] = [fullPath];
      return filesByExtension;
    }, {});

const extensionCodeGenerators: ExtensionCodeGenerator[] = [
  fillInContentForExtensions,
  populateMenuForExtensions,
  generateGitIgnoresForExtensions,
  collectSvelteComponentsForExtensions
];

export const generateCodeForExtensions = (
  extensions: Record<string, ExtensionMenuDisplayDetails>,
  program: ts.Program,
  isStartUp: boolean,
  useCaches: boolean
) => {
  const extensionsForGeneration = {} as Record<string, GenerationDetails>;
  const filesByExtension = getFilesByExtension(program);

  for (const extensionId in extensions) {
    const assetsDirectory = path.join(generatedDirectory, extensionId);
    if (!existsSync(generatedDirectory)) mkdirSync(generatedDirectory);
    if (!existsSync(assetsDirectory)) mkdirSync(assetsDirectory);
    const implementationDirectory = path.join(extensionsFolder, extensionId);
    const cached = useCaches ? getCached(implementationDirectory) : undefined;
    extensionsForGeneration[extensionId] = {
      details: extensions[extensionId],
      assetsDirectory,
      implementationDirectory,
      cached,
      tsProgramFiles: filesByExtension[extensionId].sort(),
      cacheUpdates: cached?.extensionId === extensionId ? {} : { extensionId }
    }
  }

  if (isStartUp) writeOutGeneratedFile(extensions);

  extensionCodeGenerators.forEach((generate, index) => {
    profile(() => generate(extensionsForGeneration), chalk.cyan(`Step ${index} of generation (${generate.name}) took`))
  });

  for (const extensionId in extensionsForGeneration) {
    const { implementationDirectory, cached, cacheUpdates } = extensionsForGeneration[extensionId];
    if (Object.keys(cacheUpdates).length === 0) continue;

    const pathToCache = path.join(implementationDirectory, cacheFile);
    writeFileSync(pathToCache, JSON.stringify({ ...cached, ...cacheUpdates, extensionId }));
  }
}