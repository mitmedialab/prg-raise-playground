import ts = require("typescript");
import glob = require("glob");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";
import { processArgs } from "./utility/processArgs";
import { profile, start, stop } from "./utility/profile";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { reset, setTsIsReady } from "./utility/waitForTs";

export type TranspileOptions = { doWatch: boolean; useCaches: boolean; };

const srcDir = path.resolve(__dirname, "..", "src");
const utilityDir = path.join(__dirname, "utility");
const tsconfig = path.join(utilityDir, "tsconfig.json");

const printDiagnostics = (program: ts.Program, result: ts.EmitResult) => {
  ts.getPreEmitDiagnostics(program)
    .concat(result.diagnostics)
    .forEach(diagnostic => {
      const flattenedMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
      if (!diagnostic.file) return console.error(flattenedMessage);
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${flattenedMessage}`);
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

const reportWatchStatusChanged = (diagnostic: ts.Diagnostic) => console.info(ts.formatDiagnostic(diagnostic, formatHost));
const reportDiagnostic = (diagnostic: ts.Diagnostic) => console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()));

const getWatchHost = (): ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => 
  ts.createWatchCompilerHost(
    tsconfig, 
    {}, 
    ts.sys, 
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  ); 

let transpileCount = 0;
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
      printDiagnostics(program, result);
      return builder;
    }

    const extensions = retrieveExtensionDetails(program);
    const firstRun = transpileCount === 0;
    generateCodeForExtensions(extensions, program, firstRun, !firstRun && useCaches);
    if (firstRun) setTsIsReady();
    return builder;
  };

  host.afterProgramCreate = (program) => {
    stop(getProgramMsg());
    transpileCount++;
    return afterProgramCreate(program);
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
    if (!doWatch) watcher.close();
  });
}

reset();
const options = processArgs();
transpileAllTsExtensions(options);