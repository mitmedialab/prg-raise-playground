import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const tab = "\t";
const newline = "\n";
const featured: keyof ExtensionMenuDisplayDetails = 'featured';

export default class MenuItem {
  private entries: Record<string, string>;
  private name: string;
  private extensionId: string;

  constructor(details: ExtensionMenuDisplayDetails, id: string) {
    this.entries = {};
    this.name = details.name;
    this.extensionId = id;

    for (const key in details) {
      this.push(key, details[key]);
    }
    if (featured in details) return;
    this.push(featured, true);
  }

  push<T>(key: string, value: T, isCode: boolean = false, dontFormat: boolean = false) {
    if (isCode) return this.entries[key] = `${value}`;
    if (typeof value === 'string') return this.entries[key] = dontFormat ? `'${value}'` : `${MenuItem.FormatMessage(this, key, value)}`;
    this.entries[key] = JSON.stringify(value);
  }

  serialize(indent: number) {
    const spacing = tab.repeat(indent);
    const entries = Object.entries(this.entries).map(([key, value]) => `${spacing}${tab}${key}: ${value},`).join(newline);
    return `${spacing}{
${entries}
${spacing}}`
  }

  static ConvertToArrayExport(...items: MenuItem[]): string {
    return `
export default [
${items.map(item => item.serialize(1)).join("," + newline)}
];`
  }
  
  static ConvertToSingleExport(item: MenuItem): string {
    return `export default ${item.serialize(0)}`
  }

  private static FormatMessage = (item: MenuItem, key: string, value: string) => {
    return `
  (
    <FormattedMessage
        defaultMessage="${value}"
        description="${key} for the ${item.name} extension"
        id="gui.extension.${item.extensionId}.${key}"
    />
  )`
  }
}