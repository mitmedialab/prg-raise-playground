import { ValueOf, legacy } from "$common";

type SupportMembers = keyof ReturnType<ReturnType<typeof legacy>["for"]>;

export const filename = "legacy.ts";
export const fullSuppportName = "legacyFullSupport";
export const incrementalSupportName = "legacyIncrementalSupport";

const genericExampleName = "GenericExample";
const declareGenericExtension = `export default class ${genericExampleName} extends Extension<..., ...> { ... }`

export const extensionDeclarations = [
  "// generic extension\n" + declareGenericExtension,
  "vs",
  "//decorated extension\nexport default class DecoratedExample extends DecoratedExtension { ... }"
].join("\n\n");

const supportMembers: { [k in SupportMembers]: k } = {
  legacyExtension: "legacyExtension",
  legacyDefinition: "legacyDefinition",
  legacyBlock: "legacyBlock",
  ReservedNames: "ReservedNames",
}

const { legacyExtension, legacyDefinition, legacyBlock, ReservedNames } = supportMembers;

const usedByGeneric = { legacyExtension, legacyDefinition, ReservedNames } as const;

export const extractPropertiesForGeneric = (funcName: typeof fullSuppportName | typeof incrementalSupportName) =>
  `const { ${Object.values(usedByGeneric).join(", ")} } = ${funcName}<${genericExampleName}>();`;

export const genericDescriptions: Record<keyof typeof usedByGeneric, { description: string, snippet?: string }> = {
  [legacyExtension]: {
    description: "A decorator to apply to your extension in order to give it legacy support",
    snippet: ["@legacyExtension()", declareGenericExtension].join("\n")
  },
  [legacyDefinition]: {
    description: "A utility function to assist in defining legacy blocks within your extension",
    snippet: `defineBlocks() {
  // Assuming that the legacy extension defined a block with the name 'exampleLegacyBlock'
  return {
    exampleLegacyBlock: legacyBlock.exampleLegacyBlock({
      operation: (x: number) => { ... },
      argumentMethods: {  
        ...
        // See jsdoc documentation
      }
    })
  }
}`
  },
  [ReservedNames]: {
    description: `This member should not be used, but instead you can hover over it to identify names that have been 'reserved' by the legacy extension. 
The names included within the 'blocks' property correspond to blocks your extension will have to define. 
Your class will be prohibited from defining members with the same name as any of these reserved names.`,
  }
}
