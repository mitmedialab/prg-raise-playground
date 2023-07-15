import { uuidv4 } from "$common/utils";
import { ArgumentEntry, ArgumentEntrySetter, ArgumentID } from "./utils";

const entries: ArgumentEntry<any>[] = [];

const serialize = <T>(entry: ArgumentEntry<T>) => JSON.stringify(entry);

type ArgumentEntryWithID<T = any> = { entry: ArgumentEntry<T>, id: string };
type SaveObject = { [k in typeof CustomArgumentManager["SaveKey"]]: ArgumentEntryWithID[] }

export default class CustomArgumentManager {
  private valueLookup: Map<string, ArgumentEntry<any>> = new Map();
  private idLookup: Map<string, string> = new Map();
  private current: ArgumentID = null;

  private setCurrent(id: ArgumentID) { return (this.current = id) }

  private setEntry<T>(entry: ArgumentEntry<T>) { return this.idLookup.get(serialize(entry)) ?? this.add(entry); }

  private insert<T>({ id, entry }: ArgumentEntryWithID<T>, serializedEntry?: string) {
    this.valueLookup.set(id, entry);
    this.idLookup.set(serializedEntry ?? serialize(entry), id);
    entries.push({ text: entry.text, value: id });
  }

  get entries() { return entries }

  add<T>(entry: ArgumentEntry<T>): string {
    const serialized = serialize(entry);
    const cached = this.idLookup.get(serialized);
    if (cached) return cached;
    const id = CustomArgumentManager.GetIdentifier();
    this.insert({ id, entry }, serialized);
    return id;
  }

  request<T>(id: ArgumentID, update: (id: ArgumentID) => void): ArgumentEntrySetter<T> {
    this.setCurrent(id);
    return (entry) => update(this.setCurrent(this.setEntry(entry)));
  }

  getCurrent() { return { text: this.getEntry(this.current).text, value: this.current }; }

  getEntry(id: string) { return this.valueLookup.get(id) }

  requiresSave() { this.valueLookup.size > 0 }

  saveTo(obj: SaveObject) {
    const entries = Array.from(this.valueLookup.entries())
      .filter(([_, entry]) => entry !== null)
      .map(([id, entry]) => ({ id, entry }));
    if (entries.length === 0) return;
    obj[CustomArgumentManager.SaveKey] = entries;
  }

  loadFrom(obj: SaveObject) {
    obj[CustomArgumentManager.SaveKey]?.forEach(saved => this.insert(saved));
  }

  /**
   * @todo Implement this if it becomes necessary (i.e the every growing size of the internal maps become an issue)
   */
  private purgeStaleIDs() {
    // Somehow, tap into blockly to loop through all current blocks & their field dropdowns.
    // Collect all field dropdowns values. 
    // Then, loop over entries in this.map -- if the values don't appear in the collected in-use values, drop those items.
    // NOTE: The blocks in the 'pallette' do not show up in a target's "blocks" object, which makes this trickier.
  }

  static IsIdentifier = (query: string) => query.startsWith(CustomArgumentManager.IdentifierPrefix);
  static SaveKey = "internal_customArgumentsSaveData" as const;
  private static GetIdentifier = () => CustomArgumentManager.IdentifierPrefix + uuidv4();
  private static IdentifierPrefix = "__customArg__";
}