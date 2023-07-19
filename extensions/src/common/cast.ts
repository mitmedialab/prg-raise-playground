import { ArgumentType } from "./types/enums";
import { RGBObject, TypeByArgumentType, ValueOf } from "./types";
import Cast from '$scratch-vm/util/cast';

export const castToType = (argumentType: ValueOf<typeof ArgumentType>, value: any) => {
  switch (argumentType) {
    case ArgumentType.String:
      return `${value}`;
    case ArgumentType.Number:
      return parseFloat(value);
    case ArgumentType.Boolean:
      return JSON.parse(value ?? false);
    case ArgumentType.Note:
      return parseInt(value);
    case ArgumentType.Angle:
      return parseInt(value);
    case ArgumentType.Matrix:
      return toMatrix(value);
    case ArgumentType.Color:
      return Cast.toRgbColorObject(value) as RGBObject;
    case ArgumentType.Custom:
      return value;
    case ArgumentType.Image:
      return "ERROR: This argument represents an inline image and should not be accessed.";
    default:
      throw new Error(`Method not implemented for value of ${value} and type ${argumentType}`);
  }
}

export const tryCastToArgumentType = <T extends ValueOf<typeof ArgumentType>>(
  argumentType: T,
  value: any,
  onFailure: (value: any) => TypeByArgumentType<T>
): TypeByArgumentType<T> => {
  try {
    const casted = castToType(argumentType, value);
    return casted as TypeByArgumentType<T>;
  }
  catch {
    return onFailure(value);
  }
}

const toFlag = (value: string): boolean => parseInt(value) === 1;

const toMatrix = (matrixString: string): boolean[][] => {
  if (matrixString.length !== 25) return new Array(5).fill(new Array(5).fill(false));

  const entries = matrixString.split('');
  const matrix = entries.map(toFlag).reduce((matrix, flag, index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    (column === 0) ? matrix[row] = [flag] : matrix[row].push(flag);
    return matrix;
  }, new Array<boolean[]>(5));

  return matrix;
}