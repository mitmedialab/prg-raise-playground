import ts = require("typescript");
import path = require("path");

const transpileDir = '.transpiled';

const transpileAndImport = (dirName: string) => {
  const absolutePath = path.resolve('');
  console.log(absolutePath);
  const pathToDir = path.resolve(path.dirname(__dirname), 'extensions', dirName);
  console.log(pathToDir);
  const outDir = path.join(pathToDir, transpileDir);
  try {
    const options: ts.CompilerOptions = {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      outDir
    };

    const entry = path.join(pathToDir, "index.ts");
    const program = ts.createProgram([entry], options);
    const emitResult = program.emit();
  }
  catch {
    console.log(pathToDir);
    console.log(outDir);
  }

  return require(outDir);
}

export default transpileAndImport;