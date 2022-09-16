import ts = require("typescript");
import chalk = require("chalk");
import path = require("path");
import { retrieveExtensionDetails } from "./typeProbing";
import { generateCodeForExtensions } from "./codeGeneration";
import { profile, start, stop } from "../../../scripts/profile";
import { writeFileSync } from "fs";
import { Flag, sendToParent } from "../../../scripts/devComms";
import { extensionsFolder, vmSrc } from "../../../scripts/paths";

const tsconfig = path.join(__dirname, "tsconfig.generated.json");

type ProgramStatus = {
  isStartUp: boolean,
  useCaches: boolean,
  compileCount: number,
  error: boolean,
  increment: () => void,
  raiseError: () => void,
  createProgram: ts.CreateProgram<ts.EmitAndSemanticDiagnosticsBuilderProgram>,
  afterProgramCreate: (program: ts.EmitAndSemanticDiagnosticsBuilderProgram) => void,
}

export const transpileAndWatch = (
  useCaches: boolean,
  root: string,
  files: string[],
  onError: () => void
): ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> => {
  compileJavascriptDeclarations(root, files);
  writeOutTsConfig(root, files);
  const host = profile(getWatchHost, chalk.green("Retrived watch host in"));
  const { createProgram, afterProgramCreate } = host;

  const status: ProgramStatus = {
    isStartUp: true,
    compileCount: 0,
    error: false,
    increment: function () {
      this.compileCount++;
      this.isStartUp = false;
    },
    raiseError: function () {
      this.error = true;
      onError();
    },
    useCaches,
    createProgram,
    afterProgramCreate,
  }

  host.createProgram = (...params) => customCreateProgram(status, ...params);
  host.afterProgramCreate = (...params) => customAfterProgramCreate(status, ...params);

  return profile(() => ts.createWatchProgram(host), "Created watcher in");
};

function customCreateProgram(status: ProgramStatus, ...params: Parameters<ProgramStatus["createProgram"]>) {
  const { createProgram, compileCount, isStartUp, useCaches } = status;
  start(getProgramMsg(compileCount));
  const builder = createProgram(...params);
  const program = builder.getProgram();
  const result = profile(builder.emit, chalk.yellow("Emitted program in"));

  if (result.emitSkipped) {
    status.raiseError(); // don't destructure to avoid issues with 'this'
    return builder;
  }

  const extensions = retrieveExtensionDetails(program);
  generateCodeForExtensions(extensions, program, isStartUp, !isStartUp && useCaches);
  return builder;
}

function customAfterProgramCreate(status: ProgramStatus, ...params: Parameters<ProgramStatus['afterProgramCreate']>) {
  const [semanticProgram] = params;
  const { isStartUp, error, compileCount, afterProgramCreate } = status;
  stop(getProgramMsg(compileCount));

  if (error) {
    const program = semanticProgram.getProgram();
    const diagnostics = semanticProgram.getSemanticDiagnostics();
    printDiagnostics(program, diagnostics);
    sendToParent(process, { flag: Flag.TsError });
  }
  else if (isStartUp) {
    sendToParent(process, { flag: Flag.InitialTranspileComplete });
  }

  status.increment(); // don't destructure to avoid issues with 'this'
  return afterProgramCreate(semanticProgram);
}

const baseTsCompilerOptions = (root: string, forFile: boolean): ts.CompilerOptions => ({
  noEmitOnError: true,
  esModuleInterop: true,
  target: forFile ? "ES5" as any as ts.ScriptTarget : ts.ScriptTarget.ES5,
  module: forFile ? "CommonJS" as any as ts.ModuleKind : ts.ModuleKind.CommonJS,
  moduleResolution: forFile ? "Node" as any as ts.ModuleResolutionKind : ts.ModuleResolutionKind.NodeJs,
  rootDir: root,
  outDir: root,
});

const compileJavascriptDeclarations = (root: string, files: string[]): void => {
  const options: ts.CompilerOptions = {
    ...baseTsCompilerOptions(root, false),
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
  };

  const host = ts.createCompilerHost(options);

  const emittedFiles: Map<string, string[]> = new Map();

  host.writeFile = (fileName: string, contents: string) => {
    if (fileName.includes(extensionsFolder)) return;
    if (fileName.includes("typescript-support")) return;
    if (!fileName.includes(".d.ts")) return;
    writeFileSync(fileName, contents);
    const relativeToSrc = path.relative(vmSrc, fileName);
    const dir = path.dirname(relativeToSrc);
    const base = path.basename(relativeToSrc);
    emittedFiles.has(dir) ? emittedFiles.get(dir).push(base) : emittedFiles.set(dir, [base]);
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(files, options, host);
  program.emit();

  const readout = Object
    .entries(Object.fromEntries(emittedFiles))
    .map(([dir, files]) => ({ dir, files: files }));

  console.table(chalk.whiteBright(`Emitted declarations for javascript files:`));
  console.table(readout);
}

const writeOutTsConfig = (root: string, files: string[]) => {
  const compilerOptions = baseTsCompilerOptions(root, true);
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
  const msg = `Error ${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())}`;
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

const getProgramMsg = (iteration: number) => chalk.magenta(`Total time to create program (#${iteration})`);