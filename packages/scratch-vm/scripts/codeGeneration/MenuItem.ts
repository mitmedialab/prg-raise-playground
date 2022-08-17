import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const tab = "\t";
const newline = "\n";
const featured: keyof ExtensionMenuDisplayDetails = 'featured';

export default class MenuItem {
  private entries: Record<string, string>;

  constructor(details: ExtensionMenuDisplayDetails) {
    this.entries = {};
    for (const key in details) {
      this.push(key, details[key]);
    }
    if (featured in details) return;
    this.push(featured, true);
  }

  push<T>(key: string, value: T, isCode: boolean = false) {
    if (isCode) return this.entries[key] = `${value}`;
    if (typeof value === 'string') return this.entries[key] =`'${value}'`;
    this.entries[key] = JSON.stringify(value);
  }

  serialize(indent: number) {
    const spacing = tab.repeat(indent);
    const entries = Object.entries(this.entries).map(([key, value]) => `${spacing}${tab}${key}: ${value},`).join(newline);
    return `${spacing}{
${entries}
${spacing}},`
  }

  static ConvertToExport(items: MenuItem[]): string {
    return `
export default [
${items.map(item => item.serialize(1)).join(newline)}
];`
  }

}