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

const transpileAllTsExtensions = () => {
  const srcDir = path.resolve(__dirname, "..", "src");

  const baseOptions: ts.CompilerOptions = {
    noEmitOnError: false,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    rootDir: srcDir
  };

  const extensionsDir = path.join(srcDir, "extensions");

  glob(`${extensionsDir}/**/index.ts`, (err, files) => {

    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    const program = ts.createProgram(files, { ...baseOptions, outDir: srcDir, rootDir: srcDir });
    const result = program.emit();
    if (result.emitSkipped) {
      printDiagnostics(program, result);
    }
    else {
      const extensions = retrieveExtensionDetails(program);
      generateCodeForExtensions(extensions, program);
    }
  });
}

transpileAllTsExtensions();