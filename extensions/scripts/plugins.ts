import fs from "fs";
import path from "path";
import { Extension, FrameworkID, PopulateCodeGenArgs, V2FrameworkID, copyTo, untilCondition } from "$common";
import { type Plugin } from "rollup";
import Transpiler from './typeProbing/Transpiler';
import { getBlockIconURI } from "./utils/URIs";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "./extensionsMenu";
import { exportAllFromModule, toNamedDefaultExport } from "./utils/importExport";
import { default as glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDirectory, fileName, generatedMenuDetailsDirectory, getBundleFile, getDirectoryAndFileName, tsToJs } from "./utils/fileSystem";
import { BundleInfo } from "./bundles";
import ts from "typescript";
import { getSrcCompilerHost } from "./typeProbing/tsConfig";
import { extensionsFolder, packages, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "./typeProbing/diagnostics";
import chalk from "chalk";
import { runOncePerBundling } from "./utils/rollupHelper";
import { sendToParent } from "$root/scripts/comms";
import { createMatchGroup, matchAnyWhiteSpaceIncludingNewLine, matchOneOrMoreTimes } from "./utils/regularExpressions";
import { registerDetailsIdentifier } from "$v2";

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
      const pathToFile = path.join(commonDirectory, filename);
      const { options, host } = getSrcCompilerHost();

      const outDir = path.join(extensionsFolder, "dist");
      const outFile = path.join(outDir, tsToJs(filename));
      fs.rmSync(outFile, { force: true });

      const program = ts.createProgram([pathToFile], { ...options, outDir }, host);
      const result = program.emit();

      if (result.emitSkipped) return result.diagnostics.forEach(reportDiagnostic);

      const destinations = [packages.vm, packages.gui].map(dir => path.join(dir, "src", "dist"));

      destinations.forEach(destination => {
        if (!fs.existsSync(destination)) fs.mkdirSync(destination);
        fs.copyFileSync(outFile, path.join(destination, tsToJs(filename)));
      });
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
    name: "Setup Bundle Entry",
    buildStart() {
      const svelteFiles = glob.sync(`${directory}/**/*.svelte`);
      const filesToBundle = svelteFiles
        .map(file => ({ path: file, name: fileName(file) }))
        .map(toNamedDefaultExport);
      filesToBundle.push(toNamedDefaultExport({ path: indexFile, name: "Extension" }));
      const content = filesToBundle.join("\n");
      if (!fs.existsSync(bundleEntry) || fs.readFileSync(bundleEntry, "utf8") !== content)
        fs.writeFileSync(bundleEntry, filesToBundle.join("\n"));
    },
    buildEnd() {
      //fs.rmSync(bundleEntry);
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

export const executee = ({ id, directory, menuDetails, indexFile }: BundleInfo): Plugin => {
  return {
    name: "",
  }
}

export const fillInCodeGenArgs = ({ id, directory, menuDetails, indexFile }: BundleInfo): Plugin => {
  const keywords = ["extends", "Extension", "{"];
  const matchClass = keywords.join(matchAnyWhiteSpaceIncludingNewLine + matchOneOrMoreTimes);
  const expression = createMatchGroup(matchClass);

  return {
    name: 'Fill in Code Gen Args per Extension',
    transform: {
      order: 'post',
      handler: (code: string, file: string) => {
        if (file !== indexFile) return;
        const re = new RegExp(expression);
        const match = re.exec(code);

        const errorPrefix = "Framework error -- contact Parker Malachowsky (or project maintainer): ";
        if (match.length < 2) throw new Error(errorPrefix + "Unable to locate insertion point within Extension class. The strategy likely needs to be updated...");
        if (match.length > 2) throw new Error(errorPrefix + "Multiple matches found when trying to locate insertion point within Extension class. The strategy likely needs to be updated...");

        const [matchText] = match;
        const { index } = match;
        const splitPoint = index + matchText.length;
        const [before, after] = [code.substring(0, splitPoint), code.substring(splitPoint)];
        const { name } = menuDetails;
        const blockIconURI = getBlockIconURI(menuDetails, directory);
        const codeGenArgs: PopulateCodeGenArgs = { id, name, blockIconURI };
        const getCodeGenArgs = `${Extension.InternalCodeGenArgsGetterKey}() { return ${JSON.stringify(codeGenArgs)} }`;
        return { code: `${before}\n\t${getCodeGenArgs}\n${after}`, map: null }
      }
    }
  };
}

export const createExtensionMenuAssets = (info: BundleInfo): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "Create Menu Assets",
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
    name: "Announce Extensions Written",
    writeBundle: () => {
      if (!runner.check()) return;
      if (++writeCount === totalNumberOfExtensions) allExtensionsInitiallyWritten();
    }
  }
}

let [frameworkContent, getFrameworkContent] = [null, async () => {
  const v1Framework = getBundleFile(FrameworkID);
  const v2Framework = getBundleFile(V2FrameworkID);
  const frameworkBundles = [v1Framework, v2Framework];
  const { length } = frameworkBundles;
  await untilCondition(() => frameworkBundles.filter(fs.existsSync).length == length);
  return frameworkBundles.map(file => fs.readFileSync(file, "utf-8")).join("\n");
}];

export const finalizeV2Bundle = (info: BundleInfo): Plugin => {
  const { bundleDestination, id, menuDetails, totalNumberOfExtensions } = info;
  const runner = runOncePerBundling();

  const executeBundleAndExtractMenuDetails = async () => {
    frameworkContent ??= await getFrameworkContent();
    global[registerDetailsIdentifier] = (details) => { for (const key in details) menuDetails[key] = details[key]; };
    eval(frameworkContent + "\n" + fs.readFileSync(bundleDestination));
    delete global[registerDetailsIdentifier];
  }

  const writeOutMenuDetails = (isFirstRun: boolean) => {
    if (isFirstRun) appendToRootDetailsFile(info);
    populateMenuFileForExtension(info);
  }

  const tryAnnounceInitialExtensionsWrite = (isFirstRun: boolean) => {
    if (!isFirstRun) return;
    if (++writeCount === totalNumberOfExtensions) {
      console.log(chalk.green("All extensions bundled!"));
      sendToParent(process, { condition: "extensions complete" });
    }
  }

  return {
    name: "Bundle check",
    writeBundle: async () => {
      try {
        await executeBundleAndExtractMenuDetails();
        const isFirstRun = runner.check();
        writeOutMenuDetails(isFirstRun);
        tryAnnounceInitialExtensionsWrite(isFirstRun);
      }
      catch (e) {
        throw new Error(`Unable to execute bundle (& extract display menu details) for ${id}: ${e}`)
      }
    }

  }
}