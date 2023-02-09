import { SaveDataHandler } from "$common/SavaDataHandler";
import CustomArgumentManager from "$common/customArguments/CustomArgumentManager";
import { ExtensionBaseConstructor } from ".";
import customArgumentSupport from "./customArguments";

const saveDataKey = "customSaveDataPerExtension" as const;

export default function <T extends ExtensionBaseConstructor & ReturnType<typeof customArgumentSupport>>(Ctor: T) {
  abstract class _ extends Ctor {

    /**
     * Optional field that can be defined if you need to save custom data for an extension 
     * (like some extension specific variable, or an API endpoint).
     * @example
     * class Example extends Extension<..., ...> {
     *    someValue = 5;
     *    ...
     *    saveDataHandler = new SaveDataHandler({
     *      Extension: Example,
     *      // NOTE: The type info for 'instance' could be left off in the line below
     *      onSave: (instance: Example) => ({ valueToSave: instance.someValue }),
     *      onLoad: (instance, data) => instance.someValue = data.valueToSave
     *    })
     * }
     * @see Extension.MakeSaveDataHandler
     */
    protected saveDataHandler: SaveDataHandler<_, any> = undefined;

    /**
     * Save function called 'internally' by the VM when serializing a project.
     * @param toSave 
     * @param extensionIDs 
     * @returns 
     */
    private save(toSave: { [saveDataKey]: Record<string, any> }, extensionIDs: Set<string>) {
      const { saveDataHandler, id, argumentManager } = this;
      const saveData = saveDataHandler?.hooks.onSave(this) ?? {};
      argumentManager?.saveTo(saveData);
      if (Object.keys(saveData).length === 0) return;
      const container = toSave[saveDataKey];
      container ? (container[id] = saveData) : (toSave[saveDataKey] = { [id]: saveData });
      extensionIDs.add(id);
    }

    /**
     * Load function called 'internally' by the VM when loading a project.
     * Will be invoked on an extension immediately after it is constructed.
     * @param saved 
     * @returns 
     */
    private load(saved: { [saveDataKey]: Record<string, any> }) {
      if (!saved) return;
      const { saveDataHandler, id } = this;
      const saveData = saveDataKey in saved ? saved[saveDataKey][id] : null;
      if (!saveData) return;
      saveDataHandler?.hooks.onLoad(this, saveData);
      (this.argumentManager ??= new CustomArgumentManager()).loadFrom(saveData);
    }
  }
  return _;
}