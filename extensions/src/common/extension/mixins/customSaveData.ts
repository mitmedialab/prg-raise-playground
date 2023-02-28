import CustomArgumentManager from "$common/customArguments/CustomArgumentManager";
import { ExtensionBaseConstructor, TypedConstructor } from "$common/extension";
import { ExtensionBase } from "../ExtensionBase";
import customArgumentSupport from "$common/extension/mixins/customArguments";

/**
 * WARNING! If you change this key, it will affect already saved projects.
 * Do not rename this without first developing a mechanism for searching for previously used keys.
 */
const saveDataKey = "customSaveDataPerExtension" as const;

/**
 * @summary Utility class to assist in creating a (typesafe) object that, for a given Extension type, handles both:
 * - writing out data on save
 * - doing something with save data on load
 * 
 * @description This class's constructor takes an object with both an `onSave` and an `onLoad` method
 * (and the `onSave`'s return type must match `onLoad`'s argument type)
 * @example
 * new SaveDataHandler({
 *    Extension: MyExtension,
 *    onSave: () => ({x: 0, y: 3}),
 *    onLoad: (data) => {
 *       const sum = data.x + data.y; // do something with saved data
 *    }
 * })
 */
export class SaveDataHandler<T extends ExtensionBase, TData> {
  constructor(public hooks: {
    // @ts-ignore
    Extension: TypedConstructor<T>,
    onSave: (self: T) => TData,
    onLoad: (self: T, data: TData) => void,
  }) { }
}

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