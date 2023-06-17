import fs from "fs";
import path from "path";
import { FrameworkID, untilCondition, extensionBundleEvent, blockBundleEvent } from "$common";
import { type Plugin } from "rollup";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "../extensionsMenu";
import { exportAllFromModule, toNamedDefaultExport } from "../utils/importExport";
import { default as glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDirectory, fileName, generatedMenuDetailsDirectory, getBundleFile, getDirectoryAndFileName, tsToJs } from "../utils/fileSystem";
import { BundleInfo } from ".";
import ts from "typescript";
import { getSrcCompilerHost } from "../typeProbing/tsConfig";
import { extensionsFolder, packages, root, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "../typeProbing/diagnostics";
import chalk from "chalk";
import { runOncePerBundling } from "../utils/rollupHelper";
import { sendToParent } from "$root/scripts/comms";
import { setAuxiliaryInfoForExtension } from "./auxiliaryInfo";
import { getMethodsForExtension } from "scripts/typeProbing";
import { MixinName } from "$common/extension/mixins";

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

  const isUnhandledError = ({ file: { fileName: name }, code }: ts.Diagnostic) => {
    const ignorableCodes = [4094, 4023, 4058, 4020];
    return !(name.includes(path.join(commonDirectory, "extension")) && ignorableCodes.includes(code));
  }

  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;

      glob.sync(`${vmSrc}/**/*.d.ts`).forEach(declaration => fs.rmSync(declaration));

      const emittedFiles: Map<string, string[]> = new Map();

      const overrides: ts.CompilerOptions = { allowJs: true, checkJs: false, declaration: true, emitDeclarationOnly: true, };
      const { options, host } = getSrcCompilerHost(overrides);

      const exclude = [extensionsFolder, path.join(vmSrc, "extensions"), path.join(root, "scripts")];

      host.writeFile = (pathToFile: string, contents: string) => {
        if (exclude.some(excluded => pathToFile.includes(excluded)) || !pathToFile.includes(".d.ts")) return;
        fs.writeFileSync(pathToFile, contents);
        const { directory, fileName } = getDirectoryAndFileName(pathToFile, vmSrc);
        emittedFiles.has(directory) ? emittedFiles.get(directory).push(fileName) : emittedFiles.set(directory, [fileName]);
      };;

      const entry = path.join(commonDirectory, "index.ts");
      const program = ts.createProgram([entry], options, host);
      const result = program.emit();

      if (result.emitSkipped) result.diagnostics.filter(isUnhandledError).forEach(reportDiagnostic);

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
      fs.rmSync(bundleEntry);
    },
  }
}

export const finalizeGenericExtensionBundle = (info: BundleInfo): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "Finalize Generic Extension Bundle",
    buildEnd() {
      setAuxiliaryInfoForExtension(info);
      if (runner.check()) appendToRootDetailsFile(info);
      populateMenuFileForExtension(info);
    }
  }
}

export const onFrameworkBundle = (callback: () => void): Plugin => {
  const runner = runOncePerBundling();

  return {
    name: "Announce Extensions Written",
    writeBundle: () => {
      if (!runner.check()) return;
      callback();
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

const frameworkBundle: { content: Promise<string> } & Record<string, any> = {
  cache: null,
  retrieve: async () => {
    const framework = getBundleFile(FrameworkID);
    await untilCondition(() => fs.existsSync(framework));
    return fs.readFileSync(framework, "utf-8");
  },
  get content() {
    this.cache ??= this.retrieve();
    return this.cache;
  }
}

export const finalizeConfigurableExtensionBundle = (info: BundleInfo): Plugin => {
  const { bundleDestination, menuDetails, name, directory } = info;

  const executeBundleAndExtractMenuDetails = async () => {
    const framework = await frameworkBundle.content;
    let success = false;
    const supports: { [k in MixinName]?: boolean } = {};
    let methodTypes: ReturnType<typeof getMethodsForExtension>;

    extensionBundleEvent.registerCallback(function (extensionInfo, removeSelf) {
      if (!extensionInfo || !extensionInfo.details) return;
      const { details, addOns } = extensionInfo;
      for (const key in details) menuDetails[key] = details[key];
      for (const addOn of addOns) supports[addOn] = true;
      success = true;
      removeSelf();
    });

    // maybe create an object here for collecting AppInventor info

    blockBundleEvent.registerCallback(function (metadata) {
      if (!supports.appInventor) return;
      console.log(metadata); // build up all info needed for AppInventor code gen

      // Utilizing type information
      methodTypes ??= getMethodsForExtension(info);
      const { methodName } = metadata;
      const { parameterTypes, returnType, typeChecker } = methodTypes.get(metadata.methodName);
      const parameters = parameterTypes.map(([name, type]) => `${name}: ${typeChecker.typeToString(type)}`).join(", ");
      const signature = `${methodName}: (${parameters}) => ${typeChecker.typeToString(returnType)}`;
      console.log(signature);
    });

    eval(framework + "\n" + fs.readFileSync(bundleDestination, "utf-8"));

    if (supports.appInventor) {
      // post processing step to generate code
      // generate javascript glue code, and (Java) AppInvetor Extension
    }

    blockBundleEvent.removeCallback();
    if (!success) throw new Error(`No extension registered for '${name}'. Did you forget to use the extension decorator?`);
  }

  const runner = runOncePerBundling();

  const writeOutMenuDetails = () => {
    if (runner.check()) appendToRootDetailsFile(info);
    populateMenuFileForExtension(info);
  }

  return {
    name: "Finalize Configurable Extension Bundle",
    writeBundle: async () => {
      try {
        await executeBundleAndExtractMenuDetails();
        setAuxiliaryInfoForExtension(info)
        writeOutMenuDetails();
      }
      catch (e) {
        throw new Error(`Unable to execute bundle (& extract display menu details) for ${name} (${directory}/): ${e}`)
      }
    }
  }
}