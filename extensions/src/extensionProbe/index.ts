import { ArgumentType, DecoratedExtension, Environment, ExtensionCommon, ExtensionMetadata, RuntimeEvent, block, extension, isString, legacy } from "$common";
import type ExtensionManager from "$scratch-vm/extension-support/extension-manager";
import { filename, fullSuppportName, incrementalSupportName } from "./legacyDocs";

@extension({
  name: "Extension Probe",
  description: "(INTERNAL)Use this extension to probe the info of other estensions",
  insetIconURL: "",
  iconURL: ""
})
export default class ExtensionProbe extends DecoratedExtension {
  extensionManager: ExtensionManager;
  addedExtensions: { text: string, value: string }[] = [];
  private readonly defaultOption = "Add an extension to probe it";

  init({ runtime, extensionManager }: Environment): void {
    this.extensionManager = extensionManager;

    runtime.addListener(RuntimeEvent.ExtensionAdded, ({ name, id }: { name: string, id: string }) => {
      if (id === this.id) return;
      this.addedExtensions.push({ text: name, value: id })
    })
  }

  @block((self) => ({
    type: "command",
    text: (id) => `Get legacy support for ${id}`,
    arg: { type: ArgumentType.String, options: self.getIDs }
  }))
  probe(extensionID: string) {
    if (extensionID === this.defaultOption) {
      alert("You must load an extension and then select it's ID in order to get legacy support.")
      return;
    }
    const instance = this.extensionManager.getExtensionInstance(extensionID) as LoadedExtension;
    const info = getCleanedInfo(instance);
    download(filename, getLegacyFileContent(info));
    this.openUI("Instructions", "How to use legacy.ts");
  }

  getIDs() {
    return this.addedExtensions.length > 0 ? this.addedExtensions : [this.defaultOption];
  }

}

type LoadedExtension = { getInfo: ExtensionCommon["getInfo"] }

const getCleanedInfo = (extension: LoadedExtension) => {
  const info = extension.getInfo();

  const purgeKeys: (keyof ExtensionMetadata)[] = ["blockIconURI", "menuIconURI"];
  purgeKeys.filter(key => key in info).forEach(key => delete info[key]);

  info.blocks = info.blocks
    .map(block => isString(block)
      ? undefined
      : "blockType" in block ? block : { ...block, blockType: "command" })
    .filter(Boolean);

  return info;
}

const getLegacyFileContent = (info: ExtensionMetadata) => {
  type Legacy = typeof legacy;
  type LegacyMethod = keyof ReturnType<Legacy>
  type LegacyFlag = Parameters<Legacy>[1];

  const method: LegacyMethod = "for";

  const importName = "legacy";
  const variableName = "info"
  const imports = `import { ${importName} } from "$common";`
  const declaration = `const ${variableName} = ${JSON.stringify(info, null, 2)} as const;`;
  const flags = JSON.stringify({ incrementalDevelopment: true } satisfies LegacyFlag);

  const exports = [
    `export const ${fullSuppportName} = ${importName}(${variableName}).${method};`,
    `export const ${incrementalSupportName} = ${importName}(${variableName}, ${flags}).${method};`
  ].join("\n");

  return [imports, declaration, exports].join("\n");
}

const download = (filename, text) => {
  const element = document.createElement('a');

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}