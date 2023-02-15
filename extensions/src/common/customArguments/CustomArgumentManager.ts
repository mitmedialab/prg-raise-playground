export type ArgumentEntry<T> = { text: string, value: T };
export type ArgumentEntrySetter<T> = (entry: ArgumentEntry<T>) => void;

export default class CustomArgumentManager {
  map: Map<string, ArgumentEntry<any>> = new Map();
  pending: { id: string, entry: ArgumentEntry<any> } = null;

  clearPending() { this.pending = null }
  setPending(update: typeof this.pending) { this.pending = update }

  add<T>(entry: ArgumentEntry<T>): string {
    const id = CustomArgumentManager.GetIdentifier();
    this.map.set(id, entry);
    this.clearPending();
    return id;
  }

  insert<T>(id: string, entry: ArgumentEntry<T>): string {
    this.map.set(id, entry);
    this.clearPending();
    return id;
  }

  request<T>(): [string, ArgumentEntrySetter<T>] {
    this.clearPending();
    const id = CustomArgumentManager.GetIdentifier();
    return [id, (entry) => this.setPending({ id, entry })];
  }

  tryResolve() {
    if (!this.pending) return;
    const { pending: { entry, id } } = this;
    this.map.set(id, entry);
    this.clearPending();
    return { entry, id };
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
  private static GetIdentifier = () => CustomArgumentManager.IdentifierPrefix + new Date().getTime().toString();
  private static IdentifierPrefix = "__customArg__";
}