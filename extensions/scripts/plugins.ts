import fs from "fs";
import path from "path";
import type { ExtensionMenuDisplayDetails, PopulateCodeGenArgs } from "$common";
import rollup, { type Plugin } from "rollup";
import Transpiler, { TranspileEvent } from './typeProbing/Transpiler';
import { debug } from "./utils/debug";
import { getBlockIconURI } from "./utils/URIs";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "./extensionsMenu";
import { toNamedDefaultExport } from "./utils/importExport";
import { default as glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDir, fileName, generatedDetailsFileName, generatedMenuDetailsDir } from "./utils/fileSystem";
import { ExtensionInfo } from "./bundle";
import ts from "typescript";
import { getSrcCompilerOptions } from "./typeProbing/config";
import { extensionsFolder, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "./typeProbing/diagnostics";
import chalk from "chalk";

const runOnceForEachExtension = (): { check: () => boolean, internal?: any } => ({ internal: 0, check() { return 0 === (this.internal++ as number) } });
const runOnceAcrossAllExtensions = ({ indexInProcess }: ExtensionInfo): { check: () => boolean, internal?: any } =>
  indexInProcess === 0
    ? { internal: 0, check() { return 0 === (this.internal++ as number) } }
    : { check: () => false }

export const clearDestinationDirectories = (info: ExtensionInfo): Plugin => {
  const runner = runOnceAcrossAllExtensions(info);
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      deleteAllFilesInDir(extensionBundlesDir);
      deleteAllFilesInDir(generatedMenuDetailsDir);
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

      const options: ts.CompilerOptions = {
        ...getSrcCompilerOptions(),
        allowJs: true, checkJs: false, declaration: true, emitDeclarationOnly: true,
      }
      const host = ts.createCompilerHost(options);

      host.writeFile = (fileName: string, contents: string) => {
        if (fileName.includes(extensionsFolder) || !fileName.includes(".d.ts")) return;
        fs.writeFileSync(fileName, contents);
        const relativeToSrc = path.relative(vmSrc, fileName);
        const dir = path.dirname(relativeToSrc);
        const base = path.basename(relativeToSrc);
        emittedFiles.has(dir) ? emittedFiles.get(dir).push(base) : emittedFiles.set(dir, [base]);
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

export const fillInCodeGenArgs = ({ id, directory, menuDetails, indexFile }: ExtensionInfo) => {
  return {
    name: 'fill-in-code-gen-args-for-extension',
    transform: {
      order: 'post',
      handler: (code: string, file: string) => {
        if (file !== indexFile) return;
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
  const runner = runOnceForEachExtension();
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