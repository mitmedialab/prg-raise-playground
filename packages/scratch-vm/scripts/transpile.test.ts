import glob = require("glob");
import path = require("path");
import ts = require("typescript");
import { ExtensionMenuDisplayDetails } from "../src/typescript-support/types";
import { DisplayDetailsRetrievalPaths, isExtension, retrieveExtensionDetails } from "./typeProbing/common";
import { cachedPathsToMenuDetails, location } from "./typeProbing/extensionArchetypes";
import type { Description, IconURL, InsetIconURL, Title } from "./typeProbing/extensionArchetypes";

import TypeProbe from "./typeProbing/TypeProbe";

const titleIdentifier: Title = "title";
const descriptionIdentifier: Description = "description";
const iconURLIdentifier: IconURL = "iconURL";
const insetIconURLIdentifier: InsetIconURL = "insetIconURL";

const identifiers: Record<keyof ExtensionMenuDisplayDetails, string> = {
  title: titleIdentifier,
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
  const byLength = (a: string, b: string) => a.length - b.length || a.localeCompare(b);

  const allPaths: Record<keyof DisplayDetailsRetrievalPaths, Record<string, number>> = {
    title: {},
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
          const pathsCollection = allPaths[identifier];
          const paths = TypeProbe.ProbeTypeForValue(baseExtensionType, identifier).map(getPath);
          paths.forEach(path => pathsCollection[path] = pathsCollection[path] ? pathsCollection[path]++ : 1);
        }
      }
    });
  }

  for (const key in allPaths) {
    const viablePaths = Object.entries(allPaths[key]).filter(([path, count]) => count === 8 ).map(([path, _]) => path).sort(byLength);
    details[key] = viablePaths;
  }
}

describe("Typescript transpilation of extensions", () => {
  test("Identify test path patterns", () => {
    const program = generateTestProgram();
    const pathsToDetails: DisplayDetailsRetrievalPaths = {
      title: [],
      description: [],
      iconURL: [],
      insetIconURL: []
    }
    retrievePathsToMenuDetails(program, pathsToDetails);
    const expected = pathsToDetails;
    const actual = cachedPathsToMenuDetails;
    expect(expected).toEqual(actual);
  })

  test("Retrieval of extension menu details", () => {
    const program = generateTestProgram();
    //const menuDetails = retrieveExtensionDetails(program);
    //console.log(menuDetails);
  })
})