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
export class SaveDataHandler<T> {
  constructor(public hooks: {
    onSave: () => T,
    onLoad: (data: T) => void,
  }) { }
}