import ts = require("typescript");
import glob = require("glob");
import chalk = require("chalk");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";
import { processArgs } from "./processArgs";
import { profile, start, stop } from "../utility/profile";
import { writeFileSync } from "fs";
import { raiseError, setTsIsReady } from "./interprocessCoordination";

export type TranspileOptions = { doWatch: boolean; useCaches: boolean; };

const srcDir = path.resolve(__dirname, "..", "..", "src");
const tsconfig = path.join(__dirname, "tsconfig.json");

const printDiagnostics = (program: ts.Program, diagnostics: readonly ts.Diagnostic[]) => {
  ts.getPreEmitDiagnostics(program)
    .concat(diagnostics)
    .forEach(diagnostic => {
      const flattenedMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
      if (!diagnostic.file) return console.error(chalk.red(flattenedMessage));
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      const msg = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${flattenedMessage}`;
      console.error(chalk.red(msg));
    });
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
const getProgramMsg = () => `Total time to create program (#${transpileCount})`;

const transpile = (
  {useCaches}: TranspileOptions, 
  ...files: string[]
): ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => {    
  writeOutTsConfig(files);
  const host = profile(getWatchHost, "Retrived watch host in");

  const { createProgram, afterProgramCreate } = host;
  host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
    start(getProgramMsg());

    const builder = createProgram(rootNames, options, host, oldProgram);
    const program = builder.getProgram();
    const result = profile(builder.emit, "Emitted program in");

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
    firstRun && !error ? setTsIsReady() : {};
    if (error) {
      raiseError();
      const program = semanticProgram.getProgram();
      const diagnostics = semanticProgram.getSemanticDiagnostics();
      printDiagnostics(program, diagnostics);
    }
    return afterProgramCreate(semanticProgram);
  }

  return profile(() => ts.createWatchProgram(host), "Created watcher in");
};

const transpileAllTsExtensions = (options: TranspileOptions) => {
  const extensionsDir = path.join(srcDir, "extensions");

  glob(`${extensionsDir}/**/index.ts`, (err, files) => {
    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    const watcher = profile(() => transpile(options, ...files), "Completed initial transpile in");
    const { doWatch } = options;
    if (!doWatch || error) watcher.close();
  });
}

const options = processArgs();
transpileAllTsExtensions(options);