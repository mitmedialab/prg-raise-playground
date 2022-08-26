import ts = require("typescript");
import glob = require("glob");
import chalk = require("chalk");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";
import { profile, start, stop } from "../../../scripts/profile";
import { writeFileSync } from "fs";
import { Flag, sendToParent } from "../../../scripts/devComms";
import { processArgs } from "../../../scripts/processArgs";
import { extensionsFolder, packages } from "../../../scripts/paths";

export type TranspileOptions = { doWatch: boolean; useCaches: boolean; };

const srcDir = path.resolve(packages.vm, "src");
const tsconfig = path.join(__dirname, "tsconfig.generated.json");

const printDiagnostics = (program: ts.Program, diagnostics: readonly ts.Diagnostic[]) => {
  const unique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;

  ts.getPreEmitDiagnostics(program)
    .concat(diagnostics)
    .map(diagnostic => {
      const flattenedMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
      if (!diagnostic.file) return chalk.red(flattenedMessage);
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      const msg = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${flattenedMessage}`;
      return chalk.red(msg);
    })
    .filter(unique)
    .forEach(msg => console.error(msg));
}

const writeOutTsConfig = (files: string[]) => {
  const compilerOptions: ts.CompilerOptions = {
    noEmitOnError: true,
    esModuleInterop: true,
    target: "ES5" as any as ts.ScriptTarget,
    module: "CommonJS" as any as ts.ModuleKind,
    moduleResolution: "Node" as any as ts.ModuleResolutionKind,
    rootDir: srcDir,  
    outDir: srcDir,
  };
  const config = { compilerOptions, files };
  writeFileSync(tsconfig, JSON.stringify(config));
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

const reportWatchStatusChanged = (diagnostic: ts.Diagnostic) => {
  const msg = ts.formatDiagnostic(diagnostic, formatHost);
  const stylized = chalk.greenBright(msg);
  console.info(stylized)
};

const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
  const msg = `Error ${diagnostic.code}: ${ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine())}`;
  const stylized = chalk.redBright(msg);
  console.error(stylized);
};

const getWatchHost = (): ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => 
  ts.createWatchCompilerHost(
    tsconfig, 
    { noEmitOnError: true }, 
    ts.sys, 
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  ); 

let transpileCount = 0;
let error = false;
const getProgramMsg = () => chalk.magenta(`Total time to create program (#${transpileCount})`);

const transpile = (
  {useCaches}: TranspileOptions, 
  ...files: string[]
): ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => {    
  writeOutTsConfig(files);
  const host = profile(getWatchHost, chalk.green("Retrived watch host in"));

  const { createProgram, afterProgramCreate } = host;
  host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
    start(getProgramMsg());

    const builder = createProgram(rootNames, options, host, oldProgram);
    const program = builder.getProgram();
    const result = profile(builder.emit, chalk.yellow("Emitted program in"));

    if (result.emitSkipped) {
      error = true;
      return builder;
    }

    const extensions = retrieveExtensionDetails(program);
    const firstRun = transpileCount === 0;
    generateCodeForExtensions(extensions, program, firstRun, !firstRun && useCaches);
    return builder;
  };

  host.afterProgramCreate = (semanticProgram) => {
    const firstRun = transpileCount === 0;
    stop(getProgramMsg());
    transpileCount++;
    if (error) {
      const program = semanticProgram.getProgram();
      const diagnostics = semanticProgram.getSemanticDiagnostics();
      printDiagnostics(program, diagnostics);
      sendToParent(process, { flag: Flag.TsError });
    } else if (firstRun) {
      sendToParent(process, { flag: Flag.InitialTranspileComplete });
    }
    return afterProgramCreate(semanticProgram);
  }

  return profile(() => ts.createWatchProgram(host), "Created watcher in");
};

const transpileAllTsExtensions = (options: TranspileOptions) => {
  glob(`${extensionsFolder}/**/index.ts`, (err, files) => {
    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    const watcher = profile(() => transpile(options, ...files), "Completed initial transpile in");
    const { doWatch } = options;
    if (!doWatch || error) watcher.close();
  });
}

const defaults: TranspileOptions = { 
  doWatch: false, 
  useCaches: false,
};

const flagByOption = {
  doWatch: "watch", 
  useCaches: "cache"
};

const options = processArgs<TranspileOptions>(flagByOption, defaults);
transpileAllTsExtensions(options);