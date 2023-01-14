export type ArgumentEntry = { text: string, value: any };
export type ArgumentEntrySetter = (entry: ArgumentEntry) => void;

export default class CustomArgumentManager {
  map: Record<string, ArgumentEntry> = {};

  pending: { id: string, entry: ArgumentEntry } = {
    id: null,
    entry: null
  };

  reset() {
    this.pending.entry = null;
    this.pending.id = null;
  }

  request(): readonly [string, ArgumentEntrySetter] {
    this.reset();
    const self = this;
    const id = CustomArgumentManager.GetIdentifier();
    self.pending.id = id;
    return [
      id,
      (entry: ArgumentEntry) => {
        if (self.pending.id !== id) throw new Error("IDs mismatch!"); // might not be necessary
        self.pending.entry = entry;
      }
    ] as const;
  }

  tryResolve() {
    const { pending: { entry, id } } = this;
    if (!entry) return undefined;
    this.map[id] = entry;
    this.reset();
    return { entry, id };
  }

  getCurrentEntries() {
    return Object.entries(this.map).filter(([_, entry]) => entry !== null).map(([id, { text }]) => [text, id] as const);
  }

  getEntry(id: string) { return this.map[id] }

  private static GetIdentifier = () => new Date().getTime().toString()
}