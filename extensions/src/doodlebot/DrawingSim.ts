// Drawing simulator: what Doodlebot has drawn so far, and what the child's
// current code would add — shown on the Scratch stage (toggleable; the study
// may keep it hidden so kids reason spatially) and summarized as text for the
// robot's brain so it can "see" the drawing whether or not the kid can.
//
// Units: centimeters on the paper. x right, y up (stage convention); heading
// in degrees, 0 = up, clockwise positive (Scratch's convention), so the spin
// block's "spin +d = turn right" is heading += d. The pen is assumed to sit
// on the turning center.
//
// Two sources:
//   drawn   — moves the robot actually executed (fed by the motion blocks
//             and the social turns as they happen)
//   planned — a dry run of every top-level script that contains Doodlebot
//             motion blocks, each from the robot's current pose
// Future: suggestion overlays (the robot's own proposed additions) can be
// pushed as another layer of segments with their own style.

export type Pose = { x: number; y: number; heading: number };
export type Segment = { x1: number; y1: number; x2: number; y2: number; pen: boolean };

const rad = (deg: number) => (deg * Math.PI) / 180;
const ARC_STEP_DEG = 8;
const REPEAT_CAP = 12; // loops are unrolled at most this many times
const FOREVER_TIMES = 4; // "forever" previews a few laps

/** A turtle that records the segments it traces. */
export class Turtle {
  pose: Pose;
  pen = false;
  segments: Segment[] = [];

  constructor(start: Pose = { x: 0, y: 0, heading: 0 }, pen = false) {
    this.pose = { ...start };
    this.pen = pen;
  }

  private moveTo(x: number, y: number) {
    this.segments.push({ x1: this.pose.x, y1: this.pose.y, x2: x, y2: y, pen: this.pen });
    this.pose.x = x;
    this.pose.y = y;
  }

  drive(cm: number) {
    const h = rad(this.pose.heading);
    this.moveTo(this.pose.x + cm * Math.sin(h), this.pose.y + cm * Math.cos(h));
  }

  /** In-place turn; + = right (clockwise). */
  spin(degrees: number) {
    this.pose.heading = ((this.pose.heading + degrees) % 360 + 360) % 360;
  }

  /** Drive along a circle of `radius` cm, turning `degrees` (+ = right). */
  arc(radius: number, degrees: number) {
    if (radius <= 0) return this.spin(degrees);
    const steps = Math.max(1, Math.ceil(Math.abs(degrees) / ARC_STEP_DEG));
    const turn = degrees / steps;
    const chord = 2 * radius * Math.sin(rad(Math.abs(turn)) / 2);
    for (let i = 0; i < steps; i++) {
      this.spin(turn / 2);
      this.drive(chord);
      this.spin(turn / 2);
    }
  }

  setPen(down: boolean) {
    this.pen = down;
  }
}

// ---- reading the child's scripts out of the Scratch VM ----

type VMBlock = {
  id: string; opcode: string; next: string | null; parent: string | null; topLevel: boolean;
  inputs: Record<string, { block: string | null; shadow: string | null }>;
  fields: Record<string, { value: unknown }>;
};
type VMBlocks = { _blocks: Record<string, VMBlock>; _scripts: string[] };

const kind = (opcode: string) => {
  if (!opcode.startsWith("doodlebot")) return null;
  const method = opcode.slice(opcode.indexOf("_") + 1);
  return ["drive", "arc", "spin", "movePen"].includes(method) ? method : null;
};

/** Literal value of input "0", "1", ... (null when it's a variable/reporter). */
function inputValue(blocks: VMBlocks, block: VMBlock, name: string): string | null {
  const input = block.inputs[name];
  if (!input?.block) return null;
  const inner = blocks._blocks[input.block];
  if (!inner || input.block !== input.shadow) return null; // a reporter plugged in: unknown until run
  const field = Object.values(inner.fields)[0];
  return field ? String(field.value) : null;
}

const num = (value: string | null, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && value !== null && value !== "" ? n : fallback;
};

/** Run one block's motion on a turtle. Returns a human-readable line. */
function applyBlock(blocks: VMBlocks, block: VMBlock, turtle: Turtle): string | null {
  switch (kind(block.opcode)) {
    case "drive": {
      const direction = inputValue(blocks, block, "0") ?? "forward";
      const cm = num(inputValue(blocks, block, "1"), 10);
      turtle.drive(direction === "backward" ? -cm : cm);
      return `drive ${direction} ${cm} cm`;
    }
    case "arc": {
      const direction = inputValue(blocks, block, "0") ?? "left";
      const radius = num(inputValue(blocks, block, "1"), 2);
      const degrees = num(inputValue(blocks, block, "2"), 90);
      turtle.arc(radius, direction === "right" ? degrees : -degrees);
      return `arc ${direction} radius ${radius} cm for ${degrees}°`;
    }
    case "spin": {
      const degrees = num(inputValue(blocks, block, "0"), 90);
      turtle.spin(degrees);
      return `spin ${degrees}°`;
    }
    case "movePen": {
      const direction = inputValue(blocks, block, "0") ?? "up";
      turtle.setPen(direction === "down");
      return `pen ${direction}`;
    }
  }
  return null;
}

/** Dry-run a stack (following `next`, unrolling repeat/forever). */
function runStack(blocks: VMBlocks, firstId: string | null, turtle: Turtle, lines: string[], depth = 0) {
  const pad = "  ".repeat(depth);
  for (let id = firstId; id; id = blocks._blocks[id]?.next ?? null) {
    const block = blocks._blocks[id];
    if (!block) break;
    if (block.opcode === "control_repeat" || block.opcode === "control_forever") {
      const forever = block.opcode === "control_forever";
      const times = forever ? FOREVER_TIMES : Math.min(REPEAT_CAP, Math.max(0, Math.round(num(inputValue(blocks, block, "TIMES"), 1))));
      lines.push(`${pad}${forever ? "forever" : `repeat ${times}`}:`);
      const body = block.inputs.SUBSTACK?.block ?? null;
      const bodyLines: string[] = [];
      for (let i = 0; i < times; i++) runStack(blocks, body, turtle, i === 0 ? bodyLines : [], depth + 1);
      lines.push(...bodyLines);
      continue;
    }
    const line = applyBlock(blocks, block, turtle);
    if (line) lines.push(pad + line);
    else if (!block.opcode.startsWith("event_") && !block.opcode.startsWith("doodlebot")) {
      // other blocks don't move the robot; note them briefly for context
      if (depth === 0 && !block.topLevel) lines.push(`${pad}(${block.opcode})`);
    }
  }
}

export type PlannedScript = { lines: string[]; segments: Segment[]; end: Pose };

/** Dry-run every top-level script containing Doodlebot motion, from `start`. */
export function planScripts(blocks: VMBlocks | undefined, start: Pose, pen: boolean): PlannedScript[] {
  if (!blocks) return [];
  const plans: PlannedScript[] = [];
  for (const topId of blocks._scripts) {
    const turtle = new Turtle(start, pen);
    const lines: string[] = [];
    runStack(blocks, topId, turtle, lines);
    if (!lines.some((line) => /drive|arc|spin|pen/.test(line))) continue;
    plans.push({ lines, segments: turtle.segments, end: { ...turtle.pose } });
  }
  return plans;
}

// ---- rendering ----

export const STAGE_W = 480;
export const STAGE_H = 360;

export function render(
  canvas: HTMLCanvasElement,
  drawn: Turtle,
  plans: PlannedScript[],
  suggestions: Segment[] = [],
) {
  const ctx = canvas.getContext("2d")!;
  // fit everything (plus a margin) into the stage; at least 3 px per cm
  const all = [...drawn.segments, ...plans.flatMap((p) => p.segments), ...suggestions];
  const xs = [0, drawn.pose.x, ...all.flatMap((s) => [s.x1, s.x2])];
  const ys = [0, drawn.pose.y, ...all.flatMap((s) => [s.y1, s.y2])];
  const pad = 12;
  const spanX = Math.max(40, Math.max(...xs) - Math.min(...xs) + 2 * pad);
  const spanY = Math.max(30, Math.max(...ys) - Math.min(...ys) + 2 * pad);
  const scale = Math.min(STAGE_W / spanX, STAGE_H / spanY, 6);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const px = (x: number) => STAGE_W / 2 + (x - cx) * scale;
  const py = (y: number) => STAGE_H / 2 - (y - cy) * scale;

  // paper + 10 cm grid
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.strokeStyle = "#e3ddcf";
  ctx.lineWidth = 1;
  const gridStart = (v: number) => Math.floor(v / 10) * 10;
  for (let x = gridStart(cx - STAGE_W / 2 / scale); px(x) <= STAGE_W; x += 10) {
    ctx.beginPath(); ctx.moveTo(px(x), 0); ctx.lineTo(px(x), STAGE_H); ctx.stroke();
  }
  for (let y = gridStart(cy - STAGE_H / 2 / scale); py(y) >= 0; y += 10) {
    ctx.beginPath(); ctx.moveTo(0, py(y)); ctx.lineTo(STAGE_W, py(y)); ctx.stroke();
  }

  const stroke = (segments: Segment[], style: string, width: number, dash: number[], penOnly: boolean) => {
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineCap = "round";
    // join consecutive segments into one path so dashes flow along curves
    // (arcs are many short segments; stroking each restarts the dash pattern)
    let open = false;
    let last: Segment | null = null;
    for (const s of segments) {
      if (penOnly && !s.pen) { last = null; continue; }
      const joined = last && Math.abs(last.x2 - s.x1) < 1e-6 && Math.abs(last.y2 - s.y1) < 1e-6;
      if (!joined) {
        if (open) ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px(s.x1), py(s.y1));
        open = true;
      }
      ctx.lineTo(px(s.x2), py(s.y2));
      last = s;
    }
    if (open) ctx.stroke();
    ctx.setLineDash([]);
  };

  // travel with the pen up: dotted, lighter than ink but clearly visible
  stroke(drawn.segments.filter((s) => !s.pen), "#8f897b", 2, [2, 5], false);
  stroke(plans.flatMap((p) => p.segments.filter((s) => !s.pen)), "#6f9fdc", 2, [2, 5], false);
  // planned ink (what the code would add): bold dashed blue
  stroke(plans.flatMap((p) => p.segments), "#1e63c8", 4.5, [10, 6], true);
  // the robot's own suggestions (future): bold dashed orange
  stroke(suggestions, "#e07a1f", 4.5, [6, 5], true);
  // what's actually on the paper: solid ink
  stroke(drawn.segments, "#1f1f1f", 5, [], true);

  // the robot: a dot where he is (no direction arrow — he glances and
  // fidgets, and a twitching arrow is noise); red while the pen is down
  const { x, y } = drawn.pose;
  ctx.fillStyle = drawn.pen ? "#d6453d" : "#7d776a";
  ctx.strokeStyle = "#fbfaf6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px(x), py(y), 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // legend
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "#4a463c";
  ctx.fillText(`drawn ▬   code preview ╌   pen ${drawn.pen ? "down" : "up"}   (1 square = 10 cm)`, 8, STAGE_H - 9);
}

// ---- text for the robot's brain ----

const fmt = (n: number) => Math.round(n * 10) / 10;

export function describe(drawn: Turtle, plans: PlannedScript[]): string {
  const ink = drawn.segments.filter((s) => s.pen);
  const parts: string[] = [];
  if (ink.length === 0) {
    parts.push("Nothing has been drawn on the paper yet.");
  } else {
    const xs = ink.flatMap((s) => [s.x1, s.x2]);
    const ys = ink.flatMap((s) => [s.y1, s.y2]);
    const length = ink.reduce((sum, s) => sum + Math.hypot(s.x2 - s.x1, s.y2 - s.y1), 0);
    parts.push(`Drawn so far: ${fmt(length)} cm of lines covering about ${fmt(Math.max(...xs) - Math.min(...xs))} × ${fmt(Math.max(...ys) - Math.min(...ys))} cm.`);
  }
  parts.push(`You are at (${fmt(drawn.pose.x)}, ${fmt(drawn.pose.y)}) cm facing ${fmt(drawn.pose.heading)}° (0 = up, clockwise), pen ${drawn.pen ? "down" : "up"}.`);
  if (plans.length === 0) {
    parts.push("The child has no drawing code yet.");
  } else {
    plans.forEach((plan, i) => {
      const ink = plan.segments.filter((s) => s.pen);
      const length = ink.reduce((sum, s) => sum + Math.hypot(s.x2 - s.x1, s.y2 - s.y1), 0);
      parts.push(`Code script ${i + 1} (not run yet; would draw ${fmt(length)} cm of lines):\n${plan.lines.map((l) => "  " + l).join("\n")}`);
    });
  }
  return parts.join("\n");
}
