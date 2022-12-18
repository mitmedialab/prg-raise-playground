import ts from "typescript";
import fs from "fs";
import path from "path";
import { reportDiagnostic } from "./typeProbing/diagnostics";
import { extensionsFolder, vmSrc, root, packages } from "$root/scripts/paths";
import chalk from "chalk";

const baseTsCompilerOptions = (root: string, forFile: boolean): ts.CompilerOptions => ({
  noEmitOnError: true,
  esModuleInterop: true,
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  rootDir: root,
  outDir: root,
  skipLibCheck: true,
  paths: {
    "$scratch-vm": [vmSrc],
    "$scratch-vm/*": [path.join(vmSrc, "*")],
  }
});

const compileJavascriptDeclarations = (root: string, files: string[]): void => {
  const options: ts.CompilerOptions = {
    ...baseTsCompilerOptions(root, false),
    allowJs: true,
    checkJs: false,
    declaration: true,
    emitDeclarationOnly: true,
  };

  const host = ts.createCompilerHost(options);

  const emittedFiles: Map<string, string[]> = new Map();

  host.writeFile = (fileName: string, contents: string) => {
    if (fileName.includes(extensionsFolder)) return;
    if (fileName.includes("typescript-support")) return;
    if (!fileName.includes(".d.ts")) return;
    fs.writeFileSync(fileName, contents);
    const relativeToSrc = path.relative(vmSrc, fileName);
    const dir = path.dirname(relativeToSrc);
    const base = path.basename(relativeToSrc);
    emittedFiles.has(dir) ? emittedFiles.get(dir).push(base) : emittedFiles.set(dir, [base]);
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(files, options, host);
  const result = program.emit();

  if (result.emitSkipped) {
    result.diagnostics.forEach(reportDiagnostic);
  }

  const readout = Object
    .entries(Object.fromEntries(emittedFiles))
    .map(([dir, files]) => ({ dir, files: files }));

  console.table(chalk.whiteBright(`Emitted declarations for javascript files:`));
  console.table(readout);
}

compileJavascriptDeclarations(root, [path.join(extensionsFolder, "src", "common", "index.ts")]);