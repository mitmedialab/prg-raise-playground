/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

/**
 * Convert a direction enum into an XY pair.
 *
 * @param dir The direction, or undefined.
 * @returns An object containing x and y values corresponding to the input
 *     direction.
 */
export function getXYFromDirection(dir: Direction | undefined): {
  x: number;
  y: number;
} {
  if (!dir) {
    return {x: 0, y: 0};
  }
  switch (dir) {
    case Direction.Up:
      return {x: 0, y: -1};
    case Direction.Down:
      return {x: 0, y: 1};
    case Direction.Left:
      return {x: -1, y: 0};
    case Direction.Right:
      return {x: 1, y: 0};
  }
}

/**
 * Convert an XY pair into a direction enum.
 *
 * @param xy The input pair.
 * @param xy.x The x direction, or undefined.
 * @param xy.y The y direction, or undefined.
 * @returns A direction corresponding to the XY pair, or null if they are invalid
 *     or undefined.
 */
export function getDirectionFromXY(xy: {
  x: number | undefined;
  y: number | undefined;
}): Direction | null {
  const {x, y} = xy;
  if (x == 0) {
    if (y == -1) {
      return Direction.Up;
    } else if (y == 1) {
      return Direction.Down;
    }
  } else if (y == 0) {
    if (x == -1) {
      return Direction.Left;
    } else if (x == 1) {
      return Direction.Right;
    }
  }
  return null;
}
