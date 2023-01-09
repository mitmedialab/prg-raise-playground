import fs from "fs";
import path from "path";
import type { PopulateCodeGenArgs } from "$common";
import { type Plugin } from "rollup";
import Transpiler from './typeProbing/Transpiler';
import { getBlockIconURI } from "./utils/URIs";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "./extensionsMenu";
import { exportAllFromModule, toNamedDefaultExport } from "./utils/importExport";
import { default as glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDirectory, fileName, generatedMenuDetailsDirectory, getDirectoryAndFileName, tsToJs } from "./utils/fileSystem";
import { BundleInfo } from "./bundle";
import ts from "typescript";
import { getSrcCompilerHost } from "./typeProbing/tsConfig";
import { extensionsFolder, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "./typeProbing/diagnostics";
import chalk from "chalk";
import { runOncePerBundling } from "./utils/rollupHelper";
import { sendToParent } from "$root/scripts/comms";
import { createMatchGroup, createMatchSelection, matchAnyLetterOrNumber, matchOneOrMoreTimes } from "./utils/regularExpressions";

export const clearDestinationDirectories = (): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      deleteAllFilesInDir(extensionBundlesDirectory);
      deleteAllFilesInDir(generatedMenuDetailsDirectory);
    }
  }
}

export const generateVmDeclarations = (): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;

      glob.sync(`${vmSrc}/**/*.d.ts`).forEach(declaration => fs.rmSync(declaration));

      const emittedFiles: Map<string, string[]> = new Map();

      const overrides: ts.CompilerOptions = { allowJs: true, checkJs: false, declaration: true, emitDeclarationOnly: true };
      const { options, host } = getSrcCompilerHost(overrides);

      host.writeFile = (pathToFile: string, contents: string) => {
        if (pathToFile.includes(extensionsFolder) || !pathToFile.includes(".d.ts")) return;
        fs.writeFileSync(pathToFile, contents);
        const { directory, fileName } = getDirectoryAndFileName(pathToFile, vmSrc);
        emittedFiles.has(directory) ? emittedFiles.get(directory).push(fileName) : emittedFiles.set(directory, [fileName]);
      };;

      const entry = path.join(commonDirectory, "index.ts");
      const program = ts.createProgram([entry], options, host);
      const result = program.emit();

      if (result.emitSkipped) result.diagnostics.forEach(reportDiagnostic);

      const readout = Object.entries(Object.fromEntries(emittedFiles)).map(([dir, files]) => ({ dir, files }));
      console.log(chalk.whiteBright(`Emitted declarations for javascript files:`));
      console.table(readout);
    }
  }
}

export const transpileExtensionGlobals = (): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      const filename = "globals.ts";
      const eventsFile = path.join(commonDirectory, filename);
      const { options, host } = getSrcCompilerHost();

      const program = ts.createProgram([eventsFile], options, host);
      const result = program.emit();

      if (result.emitSkipped) return result.diagnostics.forEach(reportDiagnostic);

      const transpiledFile = tsToJs(eventsFile);
      const destinationDir = path.join(extensionsFolder, "dist");

      if (!fs.existsSync(destinationDir)) fs.mkdirSync(destinationDir);
      fs.renameSync(transpiledFile, path.join(destinationDir, tsToJs(filename)));
    }
  }
}


export const setupFrameworkBundleEntry = ({ indexFile, bundleEntry }: BundleInfo): Plugin => {
  return {
    name: "",
    buildStart() {
      fs.writeFileSync(bundleEntry, exportAllFromModule(indexFile));
    },
    buildEnd() {
      fs.rmSync(bundleEntry);
    },
  }
}

export const setupExtensionBundleEntry = ({ indexFile, bundleEntry, directory }: BundleInfo): Plugin => {
  return {
    name: "",
    buildStart() {
      const svelteFiles = glob.sync(`${directory}/**/*.svelte`);
      const filesToBundle = svelteFiles
        .map(file => ({ path: file, name: fileName(file) }))
        .map(toNamedDefaultExport);
      filesToBundle.push(toNamedDefaultExport({ path: indexFile, name: "Extension" }));
      fs.writeFileSync(bundleEntry, filesToBundle.join("\n"));
    },
    buildEnd() {
      fs.rmSync(bundleEntry);
    },
  }
}

type TranspileEventNames = "onSuccess" | "onError";
type TranspileEventForExtension = (ts: Transpiler, info: BundleInfo) => void;
export const transpileExtensions = (info: BundleInfo, callbacks: Record<TranspileEventNames, TranspileEventForExtension>): Plugin => {
  let ts: Transpiler;
  const { indexFile } = info;
  const { onSuccess, onError } = callbacks;
  return {
    name: 'transpile-extension-typescript',
    buildStart() { ts ??= Transpiler.Make([indexFile], (ts) => onSuccess(ts, info), () => onError(ts, info)) },
    buildEnd() { if (this.meta.watchMode !== true) ts?.close(); },
  }
}

export const fillInCodeGenArgs = ({ id, directory, menuDetails, indexFile }: BundleInfo): Plugin => {
  const matchArgsName = createMatchSelection(matchAnyLetterOrNumber) + matchOneOrMoreTimes;
  const matchArgsGroup = createMatchGroup(matchArgsName);
  const getCallToSuper = (query: string) => `super\\(...${query}\\)`;
  const expression = getCallToSuper(matchArgsGroup);

  return {
    name: 'Fill in Code Gen Args per Extension',
    transform: {
      order: 'post',
      handler: (code: string, file: string) => {
        if (file !== indexFile) return;
        const re = new RegExp(expression);
        const match = re.exec(code);

        if (match.length < 2) throw new Error("Unable to location call to Extension's constructor. The strategy likely needs to be updated...");
        if (match.length > 2) throw new Error("Multiple matches found when trying to locate call to Extension's constructor. The strategy likely needs to be updated...");

        const [matchText, argName] = match;
        const { index } = match;
        const [before, after] = [code.substring(0, index), code.substring(index + matchText.length)];
        const { name } = menuDetails;
        const blockIconURI = getBlockIconURI(menuDetails, directory);
        const codeGenArgs: PopulateCodeGenArgs = { id, name, blockIconURI };
        const replacement = `[...${argName}, ${JSON.stringify(codeGenArgs)}]`;
        return { code: before + matchText.replace(argName, replacement) + after, map: null }
      }
    }
  };
}

export const createExtensionMenuAssets = (info: BundleInfo): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "",
    buildStart() {
      if (runner.check()) appendToRootDetailsFile(info);
      populateMenuFileForExtension(info);
    }
  }
}

let writeCount = 0;
export const announceWrite = ({ totalNumberOfExtensions }: BundleInfo): Plugin => {
  const runner = runOncePerBundling();

  const allExtensionsInitiallyWritten = () => {
    console.log(chalk.green("All extensions bundled!"));
    sendToParent(process, { condition: "extensions complete" });
  }

  return {
    name: "",
    writeBundle: () => {
      if (!runner.check()) return;
      if (++writeCount === totalNumberOfExtensions) allExtensionsInitiallyWritten();
    }
  }
}