import { uuidv4 } from "$common/utils";
import { ArgumentEntry, ArgumentEntrySetter, ArgumentID } from "./utils";

const entries: ArgumentEntry<any>[] = [];

export default class CustomArgumentManager {
  private valueLookup: Map<string, ArgumentEntry<any>> = new Map();
  private idLookup: Map<string, string> = new Map();
  private current: ArgumentID = null;
  private setCurrent(id: ArgumentID) { return (this.current = id) }

  get entries() { return entries }

  add<T>(entry: ArgumentEntry<T>): string {
    const serialized = JSON.stringify(entry);
    const cached = this.idLookup.get(serialized);
    if (cached) return cached;
    const id = CustomArgumentManager.GetIdentifier();
    this.valueLookup.set(id, entry);
    this.idLookup.set(serialized, id);
    entries.push({ text: entry.text, value: id });
    return id;
  }

  setEntry<T>(entry: ArgumentEntry<T>) {
    const serialized = JSON.stringify(entry);
    return this.idLookup.get(serialized) ?? this.add(entry);
  }

  request<T>(id: ArgumentID, update: (id: ArgumentID) => void): ArgumentEntrySetter<T> {
    this.setCurrent(id);
    return (entry) => update(this.setCurrent(this.setEntry(entry)));
  }

  getCurrent() {
    const { current: id } = this;
    return { text: this.getEntry(id).text, value: id };
  }

  getEntry(id: string) { return this.valueLookup.get(id) }

  static SaveKey = "internal_customArgumentsSaveData" as const;

  requiresSave() { this.valueLookup.size > 0 }

  saveTo(obj: object) {
    const entries = Array.from(this.valueLookup.entries())
      .filter(([_, entry]) => entry !== null)
      .map(([id, entry]) => ({ id, entry }));
    if (entries.length === 0) return;
    obj[CustomArgumentManager.SaveKey] = entries;
  }

  loadFrom(obj: Record<typeof CustomArgumentManager["SaveKey"], { id: string, entry: ArgumentEntry<any> }[]>) {
    obj[CustomArgumentManager.SaveKey]?.forEach(({ id, entry }) => {
      this.valueLookup.set(id, entry);
    });
  }

  /**
   * @todo Implement this if it becomes necessary (i.e the every growing size of this.map becomes an issue)
   */
  private purgeStaleIDs() {
    // Somehow, tap into blockly to loop through all current blocks & their field dropdowns.
    // Collect all field dropdowns values. 
    // Then, loop over entries in this.map -- if the values don't appear in the collected in-use values, drop those items.
    // NOTE: The blocks in the 'pallette' do not show up in a target's "blocks" object, which makes this tricky.
  }

  static IsIdentifier = (query: string) => query.startsWith(CustomArgumentManager.IdentifierPrefix);
  private static GetIdentifier = () => CustomArgumentManager.IdentifierPrefix + uuidv4();
  private static IdentifierPrefix = "__customArg__";
  private static DeepEquals
}