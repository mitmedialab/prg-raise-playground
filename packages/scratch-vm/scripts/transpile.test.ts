import glob = require("glob");
import path = require("path");
import ts = require("typescript");
import { retrieveExtensionDetails } from "./typeProbing/common";
import TypeProbe from "./typeProbing/TypeProbe";

describe("Typescript transpilation of extensions", () => {
  test("Retrieval of extension menu details", () => {
    const rootDir = path.resolve(__dirname, "..");
    const samplesDir = path.resolve(__dirname, "testing", "samples");

    const compileOptions: ts.CompilerOptions = {
      noEmitOnError: false,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      noEmit: true,
      rootDir
    };
    
    const syncGlob = new glob.GlobSync(`${samplesDir}/*.ts`);
    const program = ts.createProgram(syncGlob.found, compileOptions);
    const menuDetails = retrieveExtensionDetails(program);
    console.log(menuDetails);
  })
})