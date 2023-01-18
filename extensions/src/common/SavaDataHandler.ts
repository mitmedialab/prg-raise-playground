import { BaseExtension, ExtensionConstructor } from "./types";

/**
 * @summary Utility class to assist in creating a (typesafe) object that handles both:
 * - writing out data on save
 * - doing something with save data on load
 * 
 * @description This class's constructor takes an object with both an `onSave` and an `onLoad` method
 * (and the `onSave`'s return type must match `onLoad`'s argument type)
 * @example
 * new SaveDataHandler({
 *    onSave: () => ({x: 0, y: 3}),
 *    onLoad: (data) => {
 *       const sum = data.x + data.y; // do something with saved data
 *    }
 * })
 */
export class SaveDataHandler<T extends BaseExtension, TData> {
  constructor(public hooks: {
    extension: ExtensionConstructor<T>,
    onSave: (self: T) => TData,
    onLoad: (self: T, data: TData) => void,
  }) { }
}