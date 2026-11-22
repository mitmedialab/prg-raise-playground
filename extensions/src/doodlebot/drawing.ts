import type { VectorCommand } from "./vectorize";

/**
 * The vectorizer measures angles in image coordinates (y points down), where positive degrees
 * look clockwise on screen. The robot's arc/spin command turns left (counter-clockwise from above)
 * for positive degrees. Negating keeps the drawing un-mirrored; flip to 1 if drawings come out mirrored.
 */
export const TURN_DIRECTION = -1;

/** A hand drawing: one entry per stroke, each a flat list of pad coordinates [x0, y0, x1, y1, ...] */
export type Strokes = number[][];

/** A single robot action, in physical units */
export type RobotStep =
  | { kind: "pen"; down: boolean }
  | { kind: "drive"; cm: number }
  | { kind: "turn"; radiusCm: number; degrees: number };

const isDrawn = (command: VectorCommand) => command.kind === "arc" || (command.kind === "line" && command.penDown);

/**
 * The vectorizer's route starts at the image's top-left corner, so it begins by traveling (pen up) to the first stroke.
 * Dropping everything before the first drawn command makes the robot start drawing wherever it sits,
 * using its current heading as the first stroke's starting direction.
 */
export const trimLeadingTravel = (commands: VectorCommand[]) => {
  const first = commands.findIndex(isDrawn);
  return first < 0 ? [] : commands.slice(first);
};

/** Width and height (in the commands' units) of the box around everything drawn with the pen down */
export const drawnBounds = (commands: VectorCommand[]) => {
  let x = 0, y = 0, heading = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const include = (px: number, py: number) => {
    minX = Math.min(minX, px); maxX = Math.max(maxX, px);
    minY = Math.min(minY, py); maxY = Math.max(maxY, py);
  };

  for (const command of commands) {
    switch (command.kind) {
      case "spin":
        heading += command.degrees * Math.PI / 180;
        break;
      case "line": {
        const nx = x + command.distance * Math.cos(heading);
        const ny = y + command.distance * Math.sin(heading);
        if (command.penDown) { include(x, y); include(nx, ny); }
        x = nx; y = ny;
        break;
      }
      case "arc": {
        // same geometry as the vectorizer's step_command (optimize.rs)
        const sweep = command.degrees * Math.PI / 180;
        const normal = heading + (sweep > 0 ? Math.PI / 2 : -Math.PI / 2);
        const cx = x + command.radius * Math.cos(normal);
        const cy = y + command.radius * Math.sin(normal);
        const start = Math.atan2(y - cy, x - cx);
        const samples = Math.max(2, Math.ceil(Math.abs(command.degrees) / 5));
        for (let i = 0; i <= samples; i++) {
          const angle = start + sweep * i / samples;
          include(cx + command.radius * Math.cos(angle), cy + command.radius * Math.sin(angle));
        }
        x = cx + command.radius * Math.cos(start + sweep);
        y = cy + command.radius * Math.sin(start + sweep);
        heading += sweep;
        break;
      }
    }
  }

  return maxX < minX ? { width: 0, height: 0 } : { width: maxX - minX, height: maxY - minY };
};

/**
 * Converts vectorizer commands (in image pixels) into robot steps, scaled so the drawing's
 * longer side is `sizeCm`. The pen is lifted at the end.
 */
export const planDrawing = (commands: VectorCommand[], sizeCm: number, turnDirection = TURN_DIRECTION): RobotStep[] => {
  const drawn = trimLeadingTravel(commands);
  const { width, height } = drawnBounds(drawn);
  const longest = Math.max(width, height);
  if (!(longest > 0) || !(sizeCm > 0)) return [];
  const cmPerPixel = sizeCm / longest;

  const steps: RobotStep[] = [];
  let penDown: boolean | undefined;
  const setPen = (down: boolean) => {
    if (penDown === down) return;
    steps.push({ kind: "pen", down });
    penDown = down;
  };

  for (const command of drawn) {
    switch (command.kind) {
      case "line":
        setPen(command.penDown);
        steps.push({ kind: "drive", cm: command.distance * cmPerPixel });
        break;
      case "arc":
        setPen(true);
        steps.push({ kind: "turn", radiusCm: command.radius * cmPerPixel, degrees: command.degrees * turnDirection });
        break;
      case "spin":
        steps.push({ kind: "turn", radiusCm: 0, degrees: command.degrees * turnDirection });
        break;
    }
  }
  setPen(false);
  return steps;
};

/** Total pen-down distance in cm (useful for a rough sanity check of the scale) */
export const drawnLengthCm = (steps: RobotStep[]) => {
  let penDown = false, total = 0;
  for (const step of steps) {
    if (step.kind === "pen") penDown = step.down;
    else if (penDown) total += step.kind === "drive"
      ? Math.abs(step.cm)
      : Math.abs(step.radiusCm * step.degrees * Math.PI / 180);
  }
  return total;
};
