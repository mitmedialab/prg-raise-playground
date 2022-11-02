import glob = require("glob");
import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import { ExtensionCodeGenerator } from ".";
import { guiSrc } from "../../../../scripts/paths";
import { encode } from "../../src/extension-support/extension-id-factory";

// TODO
// [] Watch for additons / renames of svelte files (currently, if you add a ui, you'll need to re-run `dev` script)
// [] Interact with cache?

const getCodeGenGuards = (name: string) => ({ begin: `CODE GEN GUARDS: Begin ${name}`, end: `CODE GEN GUARDS: End ${name}` });
const getGuardsStartEnd = (content: string[], { begin, end }: { begin: string, end: string }): [start: number, end: number] => [content.findIndex(l => l.includes(begin)) + 1, content.findIndex(l => l.includes(end))];
const importGuards = getCodeGenGuards("Component Import Statements");
const constructpGuards = getCodeGenGuards("Component Construction");

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);
const valueImport = (location: string, name: string) => `\timport ${name} from "${location}";`;
const svelteCode = (variable: string, id: string, component: string) => `\t\tif (id === "${id}" && component === "${component}") new ${variable}(options);`;

const svelteParentComponent = path.join(guiSrc, "svelte", "Modal.svelte");

export const collectSvelteComponentsForExtensions: ExtensionCodeGenerator = (extensions) => {
  let components: Array<string> = [];
  let imports: Array<string> = [];
  let constructs: Array<string> = [];

  for (const id in extensions) {
    const { implementationDirectory, cacheUpdates: updates, cached } = extensions[id];
    const matches = glob.sync(path.join(implementationDirectory, "*.svelte"));

    if (!matches || matches.length === 0) continue;

    const encoded = encode(id);
    for (const match of matches) {
      components.push(match);
      const fileName = path.basename(match).replace(path.extname(match), "");
      const variableName = `${capitalize(encoded)}_${fileName}`;
      imports.push(valueImport(match, variableName));
      constructs.push(svelteCode(variableName, encoded, fileName));
    }

    // TODO use below example for cache interaction?
    //if (blockIconURI !== cached?.blockIconURI) extensions[id].cacheUpdates = { ...updates, blockIconURI };
  }

  const content = readFileSync(svelteParentComponent, 'utf8').split("\n");

  if (constructs.length > 0) {
    const [constructStart, constructEnd] = getGuardsStartEnd(content, constructpGuards);
    content.splice(constructStart, constructEnd - constructStart, ...constructs);
  }

  if (imports.length > 0) {
    const [importStart, importEnd] = getGuardsStartEnd(content, importGuards);
    content.splice(importStart, importEnd - importStart, ...imports);
  }

  writeFileSync(svelteParentComponent, content.join("\n"), 'utf8');
};