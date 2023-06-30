import { ArgumentType, Environment, ExtensionInstance, ExtensionMenuItems, ExtensionMetadata, RuntimeEvent, block, extension, isString, legacy } from "$common";
import type ExtensionManager from "$scratch-vm/extension-support/extension-manager";
import { filename, fullSuppportName, incrementalSupportName } from "./legacyDocs";

export default class ExtensionProbe extends extension(
  {
    name: "Extension Probe",
    description: "(INTERNAL) Use this extension to probe the info of other estensions",
  },
  "ui"
) {
  extensionManager: ExtensionManager;
  addedExtensions: { text: string, value: string }[] = [];
  private readonly defaultOption = "Add an extension to probe it";

  currentInfo: ExtensionMetadata;

  init({ runtime, extensionManager }: Environment): void {
    this.extensionManager = extensionManager;

    runtime.addListener(RuntimeEvent.ExtensionAdded, ({ name, id }: { name: string, id: string }) => {
      if (id === this.id) return;
      this.addedExtensions.push({ text: name, value: id })
    })
  }

  @block((self) => ({
    type: "command",
    text: (id) => `Show info for ${id}`,
    arg: { type: ArgumentType.String, options: self.getIDs }
  }))
  displayInfo(extensionID: string) {
    const info = this.getExtensionInfo(extensionID);
    if (!info) return;
    this.currentInfo = info;
    this.openUI("Info", `Info for ${info.name}`);
  }

  @block((self) => ({
    type: "command",
    text: (id) => `Get legacy support for ${id}`,
    arg: { type: ArgumentType.String, options: self.getIDs }
  }))
  legacyProbe(extensionID: string) {
    const info = this.getExtensionInfo(extensionID);
    if (!info) return;
    download(filename, getLegacyFileContent(info));
    this.openUI("Instructions", "How to use legacy.ts");
  }

  getExtension(id: string) {
    if (id !== this.defaultOption)
      return this.extensionManager.getExtensionInstance(id) as LoadedExtension;

    alert("You must load an extension and then select it's ID in order to probe it.");
    return undefined;
  }

  getExtensionInfo(id: string) {
    const instance = this.getExtension(id);
    return instance ? getCleanedInfo(instance) : undefined;
  }

  getIDs() {
    return this.addedExtensions.length > 0 ? this.addedExtensions : [this.defaultOption];
  }

}

type LoadedExtension = { getInfo: ExtensionInstance["getInfo"] }

const getCleanedInfo = (extension: LoadedExtension) => {
  const info = extension.getInfo();

  const purgeKeys: (keyof ExtensionMetadata)[] = ["blockIconURI", "menuIconURI"];
  purgeKeys.filter(key => key in info).forEach(key => delete info[key]);

  info.blocks = info.blocks
    .map(block => isString(block)
      ? undefined
      : "blockType" in block ? block : { ...block, blockType: "command" })
    .filter(Boolean);

  if (info.menus) {
    info.menus = Object.entries(info.menus).reduce((acc, [key, value]) => {

      if (!isString(value)) {
        const acceptReporters: keyof typeof value = "acceptReporters";
        if (!(acceptReporters in value)) (value as ExtensionMenuItems)[acceptReporters] = false;
      }

      acc[key] = value;
      return acc;
    }, {})
  }

  return info;
}

const getLegacyFileContent = (info: ExtensionMetadata) => {
  type Legacy = typeof legacy;
  type LegacyFlag = Parameters<Legacy>[1];

  const importName = "legacy";
  const variableName = "info";
  const declareAndExport = "export const";
  const imports = `import { ${importName} } from "$common";`;
  const declaration = `${declareAndExport} ${variableName} = ${JSON.stringify(info, null, 2)} as const;`;
  const flags = JSON.stringify({ incrementalDevelopment: true } satisfies LegacyFlag);

  const exports = [
    `${declareAndExport} ${fullSuppportName} = ${importName}(${variableName});`,
    `${declareAndExport} ${incrementalSupportName} = ${importName}(${variableName}, ${flags});`
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