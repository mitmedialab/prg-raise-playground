import fs from "fs";
import path from "path";
import { FrameworkID, untilCondition, extensionBundleEvent, blockBundleEvent } from "$common";
import { type Plugin, OutputAsset, OutputChunk, OutputBundle, NormalizedOutputOptions, PluginContext } from "rollup";
import { appendToRootDetailsFile, populateMenuFileForExtension } from "../extensionsMenu";
import { exportAllFromModule, toNamedDefaultExport } from "../utils/importExport";
import { glob } from 'glob';
import { commonDirectory, deleteAllFilesInDir, extensionBundlesDirectory, fileName, generatedMenuDetailsDirectory, getBundleFile, tsToJs } from "../utils/fileSystem";
import { BundleInfo } from ".";
import ts from "typescript";
import { getSrcCompilerHost } from "../typeProbing/tsConfig";
import { extensionsFolder, scratchPackages } from "$root/scripts/paths";
import { reportDiagnostic } from "../typeProbing/diagnostics";
import chalk from "chalk";
import { runOncePerBundling } from "../utils/rollupHelper";
import { sendToParent } from "$root/scripts/comms";
import { setAuxiliaryInfoForExtension } from "./auxiliaryInfo";
import { getAppInventorGenerator } from "scripts/utils/interop";
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { vmDeclarations } from "scripts/utils/generate";
import { chromium } from 'playwright';

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

export const transpileExtensionGlobals = (): Plugin => {
  const runner = runOncePerBundling();
  return {
    name: "",
    buildStart() {
      if (!runner.check()) return;
      const filename = "globals.ts";
      const pathToFile = path.join(commonDirectory, filename);
      const { options, host } = getSrcCompilerHost({ module: ts.ModuleKind.CommonJS });

      const outDir = path.join(extensionsFolder, "dist");
      const outFile = path.join(outDir, tsToJs(filename));
      fs.rmSync(outFile, { force: true });

      const program = ts.createProgram([pathToFile], { ...options, outDir }, host);
      const result = program.emit();

      if (result.emitSkipped) return result.diagnostics.forEach(reportDiagnostic);

      const destinations = [scratchPackages.vm, scratchPackages.gui].map(dir => path.join(dir, "src", "dist"));

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

export const mp3Bundler = (info: BundleInfo): Plugin => {
  const { bundleDestination, menuDetails, name, directory } = info;
  const filter = createFilter('**/*.mp3');
  const outputDir = path.dirname(bundleDestination) + "/mp3";

  return {
    name: 'mp3-bundler',

    async load(id: string) {
      if (!filter(id)) return null;
      const assetPath = path.resolve(id);
      const fileContent = fs.readFileSync(assetPath);
      const base64String = fileContent.toString('base64');
      return {
        code: `export default 'data:audio/mp3;base64,${base64String}';`,
        map: { mappings: '' },
      };
    },

    async generateBundle(this: PluginContext, outputOptions: NormalizedOutputOptions, bundle: OutputBundle, isWrite: boolean) {
      const keys = Object.keys(bundle).filter((fileName) => fileName.endsWith('.js'));
      const outputChunk = bundle[keys[0]] as OutputChunk;
      const mp3Files = Object.keys(outputChunk.modules).filter((fileName) =>
        fileName.endsWith('.mp3')
      );
      for (const fileName of mp3Files) {
        const assetPath = path.resolve(fileName);
        const fileContent = fs.readFileSync(assetPath);
        const base64String = fileContent.toString('base64');
        var code = `export default 'data:audio/mp3;base64,${base64String}';`;
        const outputPath = path.join(outputDir, path.basename(fileName).replace(".mp3", ".js"));
        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, code);
        delete bundle[fileName];
      }
    },
  };
}

async function playwrightTest(framework, bundledJsPath) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('about:blank');
  const bundledJs = fs.readFileSync(bundledJsPath, 'utf8');
  await page.evaluate(`
  ${framework}
  ${bundledJs}`)
  await page.waitForSelector('#menuDetails', { state: 'attached' });
  var detailsJSON = await page.$eval('#menuDetails', (element) => element.textContent);
  detailsJSON = JSON.parse(detailsJSON);
  await browser.close();
  return detailsJSON;
}

export const finalizeConfigurableExtensionBundle = (info: BundleInfo): Plugin => {
  const { bundleDestination, menuDetails, name, directory } = info;

  const executeBundleAndExtractMenuDetails = async () => {
    const framework = await frameworkBundle.content;

    const generateAppInventor = getAppInventorGenerator(info);

    const detailsJSON: any = await playwrightTest(framework, bundleDestination);
    for (const key in menuDetails) delete menuDetails[key];
    for (const key in detailsJSON) menuDetails[key] = detailsJSON[key];

    generateAppInventor();
    
    // eval(framework + "\n" + fs.readFileSync(bundleDestination, "utf-8"));
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