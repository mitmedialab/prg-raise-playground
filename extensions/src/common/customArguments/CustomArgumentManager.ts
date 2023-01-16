export type ArgumentEntry<T> = { text: string, value: T };
export type ArgumentEntrySetter<T> = (entry: ArgumentEntry<T>) => void;

export default class CustomArgumentManager {
  map: Record<string, ArgumentEntry<any>> = {};
  pending = { id: null as string, entry: null as ArgumentEntry<any> };

  clearPending() {
    this.pending.entry = null;
    this.pending.id = null;
  }

  add<T>(entry: ArgumentEntry<T>): string {
    const id = CustomArgumentManager.GetIdentifier();
    this.map[id] = entry;
    this.clearPending();
    return id;
  }

  request<T>(): [string, ArgumentEntrySetter<T>] {
    this.clearPending();
    const self = this;
    const id = CustomArgumentManager.GetIdentifier();
    self.pending.id = id;
    return [id, (entry) => self.pending.entry = entry];
  }

  tryResolve() {
    const { pending: { entry, id } } = this;
    if (!entry) return undefined;
    this.map[id] = entry;
    this.clearPending();
    return { entry, id };
  }

  getCurrentEntries() {
    return Object.entries(this.map)
      .filter(([_, entry]) => entry !== null)
      .map(([id, { text }]) => [text, id] as const);
  }

  getEntry(id: string) { return this.map[id] }

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