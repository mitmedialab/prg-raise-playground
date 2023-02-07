import { BaseExtension, ExtensionConstructor } from "./types";
import { ExtensionBase } from "./ExtensionV2";
import { ExtensionConstructor as ExtensionConstructorV2 } from "./ExtensionMixins";


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
export class SaveDataHandler<T extends BaseExtension | ExtensionBase, TData> {
  constructor(public hooks: {
    // @ts-ignore
    Extension: ExtensionConstructor<T> | ExtensionConstructorV2,
    onSave: (self: T) => TData,
    onLoad: (self: T, data: TData) => void,
  }) { }
}