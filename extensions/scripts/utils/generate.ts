import fs from "fs";
import path from "path";
import { glob } from 'glob';
import { commonDirectory, getDirectoryAndFileName, } from "./fileSystem";
import ts from "typescript";
import { getSrcCompilerHost } from "../typeProbing/tsConfig";
import { extensionsFolder, root, vmSrc } from "$root/scripts/paths";
import { reportDiagnostic } from "../typeProbing/diagnostics";
import chalk from "chalk";

const isUnhandledTypescriptError = ({ file: { fileName: name }, code }: ts.Diagnostic) => {
    const ignorableCodes = [4094, 4023, 4058, 4020];
    return !(name.includes(path.join(commonDirectory, "extension")) && ignorableCodes.includes(code));
}

/**
 * @description Generates declaration files for all javascript files in the scratch-packages/scratch-vm src directory.
 */
export const vmDeclarations = () => {
    glob.sync(`${vmSrc}/**/*.d.ts`).forEach(declaration => fs.rmSync(declaration));

    const emittedFiles: Map<string, string[]> = new Map();

    const overrides: ts.CompilerOptions = { allowJs: true, checkJs: false, declaration: true, emitDeclarationOnly: true, };
    const { options, host } = getSrcCompilerHost(overrides);

    const exclude = [extensionsFolder, path.join(vmSrc, "extensions"), path.join(root, "scripts")];

    host.writeFile = (pathToFile: string, contents: string) => {
        if (exclude.some(excluded => pathToFile.includes(excluded)) || !pathToFile.includes(".d.ts")) return;
        fs.writeFileSync(pathToFile, contents);
        const { directory, fileName } = getDirectoryAndFileName(pathToFile, vmSrc);
        emittedFiles.has(directory) ? emittedFiles.get(directory).push(fileName) : emittedFiles.set(directory, [fileName]);
    };;

    const entry = path.join(commonDirectory, "index.ts");
    const program = ts.createProgram([entry], options, host);
    const result = program.emit();

    if (result.emitSkipped) result.diagnostics.filter(isUnhandledTypescriptError).forEach(reportDiagnostic);

    const readout = Object.entries(Object.fromEntries(emittedFiles)).map(([dir, files]) => ({ dir, files }));
    console.log(chalk.whiteBright(`Emitted declarations for javascript files:`));
    console.table(readout);
}