import chalk from "chalk";
import ts from "typescript";

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

export const reportWatchStatusChanged = (diagnostic: ts.Diagnostic) => {
  const msg = ts.formatDiagnostic(diagnostic, formatHost);
  const stylized = chalk.greenBright(msg);
  console.info(stylized)
};

export const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
  if (!diagnostic.file) return console.error(chalk.redBright(ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())));
  let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
  const msg = `Error ${diagnostic.code} [${diagnostic.file.fileName} (${line + 1},${character + 1})]: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())}`;
  const stylized = chalk.redBright(msg);
  console.error(stylized);
};

export const printDiagnostics = (program: ts.Program, diagnostics: readonly ts.Diagnostic[]) => {
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

export const getProgramMsg = (iteration: number) => chalk.magenta(`Total time to create program (#${iteration})`);