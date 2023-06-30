import { codeSnippet } from "../../";
import { filename, fullSuppportName, incrementalSupportName } from "../../../src/extensionProbe/legacyDocs";


export const extract = codeSnippet();

import { legacy } from "$common";

export const info = {
  id: "extensionUnderTest",
  blocks: [
    {
      blockType: "command",
      opcode: "exampleSimpleBlock",
      text: "BlockText",
    },
    {
      blockType: "command",
      opcode: "moreComplexBlockWithArgumentAndDynamicMenu",
      text: "Example text that has argument [ARG_0]",
      arguments: {
        ARG_0: {
          type: "number",
          menu: "dynamicMenuThatReturnsNumber"
        }
      }
    }
  ],
  menus: {
    dynamicMenuThatReturnsNumber: {
      acceptReporters: true,
      items: "methodThatReturnsItems"
    }
  }
} as const;


export const legacyFullSupport = legacy(info);
export const legacyIncrementalSupport = legacy(info, { incrementalDevelopment: true });

extract.end;

type VariableNames = typeof fullSuppportName | typeof incrementalSupportName;
const ensureVariableNamesStayInSync = {
  legacyFullSupport,
  legacyIncrementalSupport
} satisfies Record<VariableNames, ReturnType<typeof legacy<typeof info>>>