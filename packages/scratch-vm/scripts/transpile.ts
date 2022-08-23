import ts = require("typescript");
import glob = require("glob");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";
import { processArgs } from "./utility/processArgs";
import { watchExtensionEntry } from "./utility/watch";
import { profile } from "./utility/profile";
import { writeFileSync } from "fs";

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

const srcDir = path.resolve(__dirname, "..", "src");

const baseCompilerOptions: ts.CompilerOptions = {
  noEmitOnError: false,
  esModuleInterop: true,
  target: "ES5" as any as ts.ScriptTarget,
  module: "CommonJS" as any as ts.ModuleKind,
  moduleResolution: "Node" as any as ts.ModuleResolutionKind,
  rootDir: srcDir,  
  outDir: srcDir,
};

const tsconfig = path.join(__dirname, "tsconfig.json");

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()));
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

const getWatchHost = (): ts.WatchCompilerHostOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => 
  ts.createWatchCompilerHost(
    tsconfig, 
    {}, 
    ts.sys, 
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  ); 

const transpile = (isStartUp: boolean, useCaches: boolean, ...files: string[]) => {    
  writeFileSync(tsconfig, `{
    "compilerOptions" : ${JSON.stringify(baseCompilerOptions)},
    "files": ${JSON.stringify(files)}
  }`);
  const host = profile(getWatchHost, "Retrived watch host in:");
  const watcher = profile(() => ts.createWatchProgram(host), "Created watcher in:");
  const semanticProgram = profile(watcher.getProgram, "Got semantic program in:");
  const program = profile(semanticProgram.getProgram, "Got program in:");

  //const result = profile(() => program.emit(), "Emit program completed in:");
  //if (result.emitSkipped) return printDiagnostics(program, result);

  const extensions = retrieveExtensionDetails(program);
  generateCodeForExtensions(extensions, program, isStartUp, useCaches);
};

const initialTranspile = (useCaches: boolean, files: string[]) => 
  profile(() => transpile(true, useCaches, ...files), "Completed initial transpile in:");

export const transpileOnChange = (entry: string) =>
  profile(() => transpile(false, true, entry), "Completed re-transpile on change in:");

export type TranspileOptions = { doWatch: boolean; useCaches: boolean; };
const transpileAllTsExtensions = ({doWatch, useCaches}: TranspileOptions) => {
  const extensionsDir = path.join(srcDir, "extensions");

  glob(`${extensionsDir}/**/index.ts`, (err, files) => {
    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    initialTranspile(useCaches, files);

    if (!doWatch) return;

    files.forEach(watchExtensionEntry);
  });
}

const options = processArgs();
console.log(options);
transpileAllTsExtensions(options);