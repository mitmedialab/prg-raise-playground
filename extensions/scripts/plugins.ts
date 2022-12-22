import fs from "fs";
import path from "path";
import type { PopulateCodeGenArgs } from "$common";
import { type Plugin } from "rollup";
import Transpiler, { TranspileEvent } from './typeProbing/Transpiler';
import { getBlockIconURI } from "./utils/URIs";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "./extensionsMenu";
import { toNamedDefaultExport } from "./utils/importExport";
import { default as glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDirectory, extensionsSrc, fileName, generatedDetailsFileName, generatedMenuDetailsDirectory, getDirectoryAndFileName, tsToJs } from "./utils/fileSystem";
import { ExtensionInfo } from "./bundle";
import ts from "typescript";
import { getSrcCompilerHost, getSrcCompilerOptions } from "./typeProbing/tsConfig";
import { extensionsFolder, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "./typeProbing/diagnostics";
import chalk from "chalk";
import { runOnceAcrossAllExtensions, runOncePerExtension } from "./utils/coordination";
import { sendToParent } from "$root/scripts/devComms";

export const clearDestinationDirectories = (info: ExtensionInfo): Plugin => {
  const runner = runOnceAcrossAllExtensions(info);
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      deleteAllFilesInDir(extensionBundlesDirectory);
      deleteAllFilesInDir(generatedMenuDetailsDirectory);
    }
  }
}

export const generateVmDeclarations = (info: ExtensionInfo): Plugin => {
  const runner = runOnceAcrossAllExtensions(info);
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

export const transpileExtensionEvents = (info: ExtensionInfo): Plugin => {
  const runner = runOnceAcrossAllExtensions(info);
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      const eventsFile = path.join(commonDirectory, "events.ts");
      const { options, host } = getSrcCompilerHost();

      const program = ts.createProgram([eventsFile], options, host);
      const result = program.emit();

      if (result.emitSkipped) return result.diagnostics.forEach(reportDiagnostic);

      const transpiledFile = tsToJs(eventsFile);
      const destinationDir = path.join(extensionsFolder, "dist");

      if (!fs.existsSync(destinationDir)) fs.mkdirSync(destinationDir);
      fs.renameSync(transpiledFile, path.join(destinationDir, "events.js"));
    }
  }
}

export const setupBundleEntry = ({ indexFile, bundleEntry, directory }: ExtensionInfo): Plugin => {
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

export const transpileExtensions = ({ indexFile, onSuccess, onError }: ExtensionInfo & { onSuccess: TranspileEvent, onError: TranspileEvent }): Plugin => {
  let ts: Transpiler;
  return {
    name: 'transpile-extension-typescript',
    buildStart() { ts ??= Transpiler.Make([indexFile], onSuccess, onError) },
    buildEnd() { if (this.meta.watchMode !== true) ts?.close(); },
  }
}

export const fillInCodeGenArgs = ({ id, directory, menuDetails, indexFile }: ExtensionInfo): Plugin => {
  return {
    name: 'Fill in Code Gen Args per Extension',
    transform: {
      order: 'post',
      handler: (code: string, file: string) => {
        if (!file.includes("Extension.ts")) return;
        const { name } = menuDetails;
        const blockIconURI = getBlockIconURI(menuDetails, directory);
        const codeGenArgs: PopulateCodeGenArgs = { id, name, blockIconURI };
        code = code.replace("= codeGenArgs", `= /* codeGenArgs */ ${JSON.stringify(codeGenArgs)}`);
        return { code, map: null }
      }
    }
  };
}

export const createExtensionMenuAssets = (info: ExtensionInfo): Plugin => {
  const runner = runOncePerExtension();
  return {
    name: "",
    buildStart() {
      if (runner.check()) appendToRootDetailsFile(info);
      populateMenuFileForExtension(info);
    }
  }
}

export const cleanup = ({ bundleDestination }: ExtensionInfo): Plugin => {
  return {
    name: "",
    writeBundle: () => {
      fs.rmSync(path.join(path.resolve(bundleDestination, ".."), "assets"), { recursive: true, force: true });
    }
  }
}

let writeCount = 0;
const allExtensionsInitiallyWritten = () => {
  console.log(chalk.green("All extensions bundled!"));
  sendToParent(process, { condition: "extensions complete" });
}

export const announceWrite = ({ totalNumberOfExtensions, name }: ExtensionInfo): Plugin => {
  const runner = runOncePerExtension();
  return {
    name: "",
    writeBundle: () => {
      if (!runner.check()) return;
      if (++writeCount === totalNumberOfExtensions) allExtensionsInitiallyWritten();
    }
  }
}