import { uuidv4 } from "$common/utils";
import { RuntimeWithCustomArgumentSupport, ArgumentEntry, ArgumentEntrySetter, ArgumentID } from "./common";

export default class CustomArgumentManager {
  map: Map<string, ArgumentEntry<any>> = new Map();
  pending: ArgumentID = null;

  private setPending(id: ArgumentID) { return (this.pending = id) }
  private clearPending() { this.pending = null }

  private setEntry(entry: ArgumentEntry<any>) {
    const id = CustomArgumentManager.GetIdentifier();
    this.map.set(id, entry);
    return id;
  }

  add<T>(entry: ArgumentEntry<T>): string {
    const id = CustomArgumentManager.GetIdentifier();
    this.map.set(id, entry);
    return id;
  }

  request<T>(runtime: RuntimeWithCustomArgumentSupport): ArgumentEntrySetter<T> {
    this.clearPending();
    return (entry) => runtime.manualDropdownUpdate(this.setPending(this.setEntry(entry)));
  }

  peek() {
    const { pending: id } = this;
    const entry = this.getEntry(id);
    return { entry, id };
  }

  tryResolve() {
    if (!this.pending) return null;
    const state = this.peek();
    this.clearPending();
    return state;
  }

  getCurrentEntries() {
    return Array.from(this.map.entries())
      .filter(([_, entry]) => entry !== null)
      .map(([id, { text }]) => [text, id] as const);
  }

  getEntry(id: string) { return this.map.get(id) }

  static SaveKey = "internal_customArgumentsSaveData" as const;

  requiresSave() { this.map.size > 0 }

  saveTo(obj: object) {
    const entries = Array.from(this.map.entries())
      .filter(([_, entry]) => entry !== null)
      .map(([id, entry]) => ({ id, entry }));
    if (entries.length === 0) return;
    obj[CustomArgumentManager.SaveKey] = entries;
  }

  loadFrom(obj: Record<typeof CustomArgumentManager["SaveKey"], { id: string, entry: ArgumentEntry<any> }[]>) {
    obj[CustomArgumentManager.SaveKey]?.forEach(({ id, entry }) => {
      this.map.set(id, entry);
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
}