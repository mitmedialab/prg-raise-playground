import ts = require("typescript");
import glob = require("glob");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";

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
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  rootDir: srcDir
};

const transpile = (isStartUp: boolean, ...files: string[]) => {
  const program = ts.createProgram(files, { ...baseCompilerOptions, outDir: srcDir, rootDir: srcDir });
  const result = program.emit();
  if (result.emitSkipped) return printDiagnostics(program, result);

  const extensions = retrieveExtensionDetails(program);
  generateCodeForExtensions(extensions, program, isStartUp);
}

const transpileAllTsExtensions = () => {
  const extensionsDir = path.join(srcDir, "extensions");

  glob(`${extensionsDir}/**/index.ts`, (err, files) => {

    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    transpile(true, ...files);

    // files.forEach watch directory, if change, re-run transpile
  });
}

transpileAllTsExtensions();