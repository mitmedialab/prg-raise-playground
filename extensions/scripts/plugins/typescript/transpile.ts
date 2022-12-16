import chalk from "chalk";
import fs from "fs";
import path from "path";
import ts from "typescript";
import { retrieveExtensionDetails } from "../typeProbing";
//import { generateCodeForExtensions } from "./codeGeneration";
import { profile, start, stop } from "../../../../scripts/profile";
import { Conditon, sendToParent } from "../../../../scripts/devComms";
import { extensionsFolder, vmSrc } from "../../../../scripts/paths";
import { oneliner } from "../../../../scripts/utils";
import { writeFileSync } from "fs";
import { getProgramMsg, printDiagnostics, reportDiagnostic, reportWatchStatusChanged } from "./diagnostics";

type Program = ts.EmitAndSemanticDiagnosticsBuilderProgram;
type Host = ts.WatchCompilerHostOfFilesAndCompilerOptions<Program>;
type Watcher = ts.WatchOfFilesAndCompilerOptions<Program>;

export const watcher: { internal: Watcher | null } = { internal: null };

const emittedFiles = new Map<string, string>();


class ProgramState {
  isStartUp: boolean = true;
  compileCount: number = 0;
  error: boolean = false;
  host: Host;
  createProgram: Host["createProgram"];
  afterProgramCreate: Host["afterProgramCreate"];

  constructor(files: string[], private onError: () => void) {
    this.host = profile(() => getWatchHost(files, this.raiseError.bind(this)), chalk.green("Retrived watch host in"));
    const { createProgram, afterProgramCreate } = this.host;
    this.createProgram = createProgram;
    this.host.createProgram = (...params) => customCreateProgram(this, ...params);
    this.afterProgramCreate = afterProgramCreate;
    this.host.afterProgramCreate = (...params) => customAfterProgramCreate(this, ...params);
  }

  increment() {
    this.compileCount++;
    this.isStartUp = false;
  }

  raiseError() {
    this.error = true;
    this.onError();
  }
}

export const transpileAndWatch = (files: string[], onError: () => void): Watcher => {
  const state = new ProgramState(files, onError);
  return profile(() => watcher.internal = ts.createWatchProgram(state.host), "Created watcher in");
};

function customCreateProgram(state: ProgramState, ...params: Parameters<ProgramState["createProgram"]>) {
  const { createProgram, compileCount } = state;
  start(getProgramMsg(compileCount));
  const builder = createProgram(...params);
  const program = builder.getProgram();

  //if (result.emitSkipped) return oneliner({ call: state.raiseError, thenReturn: builder });

  //const extensions = retrieveExtensionDetails(program);
  //generateCodeForExtensions(extensions, program, isStartUp, !isStartUp && useCaches);
  return builder;
}

function customAfterProgramCreate(state: ProgramState, ...params: Parameters<Host['afterProgramCreate']>) {
  const [semanticProgram] = params;
  const { isStartUp, compileCount, afterProgramCreate } = state;

  stop(getProgramMsg(compileCount));
  afterProgramCreate(semanticProgram);

  if (state.error) announceError(semanticProgram, state);
  else if (isStartUp) announceTranspilation();

  state.increment();
}

const src = path.join(extensionsFolder, "src");
const configFile = path.join(src, "tsconfig.json");

const getWatchHost = (files: string[], onError: () => void): Host => {
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, src, undefined, configFile);

  return ts.createWatchCompilerHost(
    files,
    options,
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    (diagnostic, _, __, errorCount) => {
      reportWatchStatusChanged(diagnostic);
      if (errorCount) onError();
    },
  );
}

const announceError = (semanticProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram, state: ProgramState) => {
  console.log("here");
  printDiagnostics(semanticProgram.getProgram(), semanticProgram.getSemanticDiagnostics());
  sendToParent(process, { condition: "typescript error" });
}

const announceTranspilation = () => sendToParent(process, { condition: "transpile complete" });