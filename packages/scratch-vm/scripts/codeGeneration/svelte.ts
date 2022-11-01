import glob = require("glob");
import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import { ExtensionCodeGenerator } from ".";
import { guiSrc } from "../../../../scripts/paths";
import { encode } from "../../src/extension-support/extension-id-factory";


const getCodeGenGuards = (name: string) => ({ begin: `CODE GEN GUARDS: Begin ${name}`, end: `CODE GEN GUARDS: End ${name}` });
const getGuardsStartEnd = (content: string[], { begin, end }: { begin: string, end: string }): [start: number, end: number] => [content.findIndex(l => l.includes(begin)) + 1, content.findIndex(l => l.includes(end))];
const importGuards = getCodeGenGuards("Component Import Statements");
const markupGuards = getCodeGenGuards("Component Markup");

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const typeImport = (location: string, name: string) => `\timport type ${name} from "${location}";`;
const valueImport = (location: string, name: string) => `\timport ${name} from "${location}";`;
const svelteCode = (variable: string, id: string, component: string) =>
  `{#if id === "${id}" && component === "${component}"}
<svelte:component this={${variable}} extension={Extension.GetExtensionByID("${id}")} {close} />
{/if}`;

const svelteParentComponent = path.join(guiSrc, "svelte", "Modal.svelte");

export const collectSvelteComponentsForExtensions: ExtensionCodeGenerator = (extensions) => {
  let components: Array<string> = [];
  let imports: Array<string> = [];
  let markups: Array<string> = [];

  for (const id in extensions) {
    const encoded = encode(id);
    const { implementationDirectory, cacheUpdates: updates, cached } = extensions[id];
    const indexLocation = `${implementationDirectory}${implementationDirectory.endsWith("/") ? "" : "/"}`;
    imports.push(typeImport(indexLocation, encoded));

    const matches = glob.sync(path.join(implementationDirectory, "*.svelte"));
    if (!matches || matches.length === 0) continue;

    for (const match of matches) {
      components.push(match);
      const fileName = path.basename(match).replace(path.extname(match), "");
      const variableName = `${capitalize(encoded)}_${fileName}`;
      imports.push(valueImport(match, variableName));
      markups.push(svelteCode(variableName, encoded, fileName));
    }
    //if (blockIconURI !== cached?.blockIconURI) extensions[id].cacheUpdates = { ...updates, blockIconURI };
  }

  const content = readFileSync(svelteParentComponent, 'utf8').split("\n");

  if (markups.length > 0) {
    const [markupStart, markupEnd] = getGuardsStartEnd(content, markupGuards);
    content.splice(markupStart, markupEnd - markupStart, ...markups);
  }

  if (imports.length > 0) {
    const [importStart, importEnd] = getGuardsStartEnd(content, importGuards);
    content.splice(importStart, importEnd - importStart, ...imports);
  }

  writeFileSync(svelteParentComponent, content.join("\n"), 'utf8');
};