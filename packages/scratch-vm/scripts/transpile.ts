import * as ts from "typescript";
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import { internalFindPath } from "./typeProbe";

const isObject = (value) => {
  return !!(value && typeof value === "object" && !Array.isArray(value));
};

const findPathToNestedValueInObject = (object: any, valueToMatch: string, keys: string[] = [], cache: any[] = []) => {
  if (cache.includes(object)) return null;

  if (isObject(object)) {

    const entries = Object.entries(object);

    for (let i = 0; i < entries.length; i += 1) {
      const [key, objectValue] = entries[i];


      if (objectValue === valueToMatch) {
        return [...keys, key].join(".");
      }

      if (isObject(objectValue)) {
        cache.push(object);
        const child = findPathToNestedValueInObject(objectValue, valueToMatch, [...keys, key], cache);

        if (child !== null) {
          return child;
        }
      }

      if (Array.isArray(objectValue)) {
        cache.push(object);

        let i = 0;
        for (const item of objectValue) {
          const child = findPathToNestedValueInObject(item, valueToMatch, [...keys, `${key}[${i}]`], cache);
          i++;
          if (child !== null) {
            return child;
          } 
        }
      }
    }
  }

  return null;
};

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

const tryRetrieveIdentifier = (program: ts.Program): void => {
  const typeChecker = program.getTypeChecker();
  const sources = program.getSourceFiles();
  const roots = program.getRootFileNames();
  const entries = sources.filter(source => roots.includes(source.fileName));
  for (const entry of entries) {
    ts.forEachChild(entry, node => {
      //const nodeName = (node as any)?.name?.escapedText;
      //if (nodeName !== "MyExtension") return;

      // Typescript_logo.png
      const type = typeChecker.getTypeAtLocation(node);
      const path = internalFindPath(type, "Extension");

      if (path !== null) {
        console.log(path);

        const keys = (path as string).split(".");
        let objects = [type];

        for (const key of keys) {
          const previous = objects[objects.length - 1];

          if (key.includes("[")) {
            const split = key.split("[");
            const index = parseInt(split[1].replace("]", ""));
            objects.push(previous[split[0]][index]);
          }
          else {
            objects.push(previous[key]);
          }
        }

        for (let index = objects.length - 1; index >= 0; index--) {
          const element = objects[index];
          const toExtension = findPathToNestedValueInObject(element, "Hello");

          if (toExtension !== null) {
            console.log(keys[index]);
            console.log(toExtension);
          }
        }
      }
      
    });
  }
}

type FileToWrite = {
  name: string,
  content: string
}

const supportingFiles: FileToWrite[] = [
  {
    name: "ONLY_EDIT_TS_FILES.md",
    content: `# NOTE TO THE DEVELOPER:
Only create and edit .ts files for this extension. 
The .js files are generated and thus any changes will be lost the next time you build the project.`
  },
];

supportingFiles.push({
  name: ".gitignore",
  content: [
    "# Prevent all .js files in this folder from being 'seen' by git",
    "**/*.js",
    "# Ignore other supporting files",
    ...supportingFiles.map(file => file.name)].join("\n")
},)

const addSuportingFiles = (dir: string) => supportingFiles.forEach(toAdd => fs.writeFileSync(path.join(dir, toAdd.name), toAdd.content));

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
  const supportDir = path.join(srcDir, "typescript-support");

  glob(`${extensionsDir}/**/index.ts`, (err, files) => {

    if (err) return console.error(err);
    if (!files) return console.error("No files found");

    const program = ts.createProgram(files, { ...baseOptions, outDir: srcDir, rootDir: srcDir });
    const result = program.emit();
    result.emitSkipped ? printDiagnostics(program, result) : tryRetrieveIdentifier(program);
    files.forEach(file => addSuportingFiles(path.dirname(file)));
    addSuportingFiles(supportDir);
  });
}

transpileAllTsExtensions();