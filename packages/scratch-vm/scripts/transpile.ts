import * as ts from "typescript";
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

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
    rootDir: srcDir
  };

  const queryDir = path.join(srcDir, "extensions");

  glob(`${queryDir}/**/index.ts`, (err, files) => {

    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    files.forEach(file => {
      const dir = path.dirname(file);
      fs.writeFileSync(path.join(dir, ".gitignore"), "**/*.js");
    })

    const program = ts.createProgram(files, { ...baseOptions, outDir: srcDir, rootDir: srcDir });
    const result = program.emit();
    printDiagnostics(program, result);
  });
}

transpileAllTsExtensions();