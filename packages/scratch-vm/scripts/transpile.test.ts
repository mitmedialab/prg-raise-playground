import glob = require("glob");
import path = require("path");
import ts = require("typescript");
import { ExtensionMenuDisplayDetails, RequiredKeys } from "../src/typescript-support/types";
import { retrieveExtensionDetails } from "./typeProbing";
import { location, typeCount } from "./typeProbing/extensionArchetypes";
import type { DisplayDetails } from "./typeProbing/extensionArchetypes";

import TypeProbe from "./typeProbing/TypeProbe";

export type DisplayDetailsRetrievalPaths = Record<RequiredKeys<ExtensionMenuDisplayDetails>, string[]>;

const titleIdentifier: DisplayDetails['name'] = "test_title";
const descriptionIdentifier: DisplayDetails['description'] = "test_description";
const iconURLIdentifier: DisplayDetails['iconURL'] = "test_iconURL";
const insetIconURLIdentifier: DisplayDetails['insetIconURL'] = "test_insetIconURL";

const identifiers: Record<RequiredKeys<ExtensionMenuDisplayDetails>, string> = {
  name: titleIdentifier,
  description: descriptionIdentifier,
  iconURL: iconURLIdentifier,
  insetIconURL: insetIconURLIdentifier
}

const generateTestProgram = () => {
  const compileOptions: ts.CompilerOptions = {
    noEmitOnError: false,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmit: true,
    rootDir: path.resolve(__dirname, "..")
  };
  
  const { found } = new glob.GlobSync(location());
  return ts.createProgram(found, compileOptions);
}

const retrievePathsToMenuDetails = (program: ts.Program, details: DisplayDetailsRetrievalPaths) => {
  const typeChecker = program.getTypeChecker();
  const sources = program.getSourceFiles();
  const roots = program.getRootFileNames();
  const rootSources = sources.filter(source => roots.includes(source.fileName));
  const getPath = (probe: TypeProbe<string>) => probe.getPath();
  const byCount = (a: [_: string, arr: string[]], b: [_: string, count: string[]]) => b[1].length - a[1].length;
  const byLength = (a: string, b: string) => a.length - b.length || a.localeCompare(b);

  const allPaths: Record<RequiredKeys<DisplayDetailsRetrievalPaths>, Record<string, string[]>> = {
    name: {},
    description: {},
    iconURL: {},
    insetIconURL: {}
  };

  for (const root of rootSources) {
    ts.forEachChild(root, node => {
      const type = typeChecker.getTypeAtLocation(node);
      const baseExtensionType = type.getBaseTypes()?.find(t => t.symbol.name === "Extension");
      
      if (baseExtensionType) {
        for (const key in identifiers) {
          const identifier = identifiers[key];
          const pathsCollection = allPaths[key];
          const paths = TypeProbe.ProbeTypeForValue(baseExtensionType, identifier).map(getPath);
          paths.forEach(path => (pathsCollection[path] !== undefined) ? pathsCollection[path].push(type.symbol.name) : pathsCollection[path] = [type.symbol.name]);
        }
      }
    });
  }

  for (const key in allPaths) {
    const viablePaths = Object.entries(allPaths[key]).filter(([_, types]) => (types as string[]).length == typeCount).map(([path, _]) => path).sort(byLength);
    details[key] = viablePaths;
  }
}

describe("Typescript transpilation of extensions", () => {
  test("Identify test path patterns", () => {
    const program = generateTestProgram();
    const pathsToDetails: DisplayDetailsRetrievalPaths = {
      name: [],
      description: [],
      iconURL: [],
      insetIconURL: []
    }
    retrievePathsToMenuDetails(program, pathsToDetails);
    console.log(pathsToDetails);
  })

  test("Retrieval of extension menu details", () => {
    const program = generateTestProgram();
    const menuDetails = retrieveExtensionDetails(program, true);
    console.log(menuDetails);
  })
})