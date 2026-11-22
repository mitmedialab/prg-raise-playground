import init, { vectorize as vectorizeRGBA } from "arcline-vectorize-web";
import type { Strokes } from "./drawing";
// The bundler inlines .wasm imports as a Uint8Array (see `wasmAsBytes` in extensions/scripts/bundles/index.ts),
// but the package ships its own arcline_vectorize_bg.wasm.d.ts describing the instantiated exports instead.
// @ts-ignore
import wasmBytes from "arcline-vectorize-web/arcline_vectorize_bg.wasm";

/** Distances and radii are in image pixels; positive degrees turn counter-clockwise in image (y-down) coordinates. */
export type VectorCommand =
  | { kind: "line"; distance: number; penDown: boolean }
  | { kind: "spin"; degrees: number }
  | { kind: "arc"; radius: number; degrees: number };

export type VectorizationResult = {
  low_geometry: VectorCommand[];
  high_geometry: VectorCommand[];
  /** side-by-side comparison of low and high geometry */
  svg: string;
  low_geometry_svg: string;
};

let ready: Promise<unknown> | undefined;

/** Instantiates the wasm module once; later calls reuse it. */
export const loadVectorizer = () => ready ??= init({ module_or_path: wasmBytes });

/** Vectorize RGBA8 pixels, e.g. `ctx.getImageData(...)`. Transparent pixels are treated as white. */
export const vectorize = async ({ data, width, height }: ImageData): Promise<VectorizationResult> => {
  await loadVectorizer();
  return vectorizeRGBA(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), width, height, true);
};

const mimeTypes: Record<string, string> = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

/**
 * Draws an image asset (e.g. a costume's `asset.data` + `asset.dataFormat`) onto a white canvas,
 * scaled so its longer side is `longSide` px including `padding` on every side.
 * @param fallbackSize used when the image reports no intrinsic size (e.g. an SVG without width/height)
 */
export const rasterize = async (
  data: Uint8Array, dataFormat: string, fallbackSize: [number, number], longSide = 512, padding = 16
): Promise<ImageData> => {
  const type = mimeTypes[dataFormat];
  if (!type) throw new Error(`Unsupported image format: ${dataFormat}`);
  const url = URL.createObjectURL(new Blob([data as BlobPart], { type }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const width = image.naturalWidth || fallbackSize[0];
    const height = image.naturalHeight || fallbackSize[1];
    const scale = (longSide - 2 * padding) / Math.max(width, height, 1);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale) + 2 * padding;
    canvas.height = Math.round(height * scale) + 2 * padding;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, padding, padding, width * scale, height * scale);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Draws hand-drawn strokes as dark, uniformly thick lines on a white canvas, scaled so the drawing
 * fills `longSide` px (including `padding`). Uniform line art is what the vectorizer handles best.
 */
export const renderStrokes = (strokes: Strokes, longSide = 512, padding = 16, lineWidth = 8): ImageData => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of strokes) for (let i = 0; i + 1 < stroke.length; i += 2) {
    minX = Math.min(minX, stroke[i]); maxX = Math.max(maxX, stroke[i]);
    minY = Math.min(minY, stroke[i + 1]); maxY = Math.max(maxY, stroke[i + 1]);
  }
  if (maxX < minX) throw new Error("The drawing is empty");

  const inner = longSide - 2 * padding - lineWidth;
  const scale = inner / Math.max(maxX - minX, maxY - minY, 1);
  const offset = padding + lineWidth / 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((maxX - minX) * scale + 2 * offset);
  canvas.height = Math.round((maxY - minY) * scale + 2 * offset);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = ctx.fillStyle = "black";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = ctx.lineJoin = "round";

  const x = (value: number) => (value - minX) * scale + offset;
  const y = (value: number) => (value - minY) * scale + offset;
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    if (stroke.length === 2) {
      ctx.beginPath();
      ctx.arc(x(stroke[0]), y(stroke[1]), lineWidth / 2, 0, 2 * Math.PI);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(x(stroke[0]), y(stroke[1]));
    for (let i = 2; i + 1 < stroke.length; i += 2) ctx.lineTo(x(stroke[i]), y(stroke[i + 1]));
    ctx.stroke();
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

/** e.g. "6 commands (2 lines, 1 arc, 3 spins), 1 pen-up move" */
export const summarize = (commands: VectorCommand[]) => {
  const count = (kind: VectorCommand["kind"]) => commands.filter(c => c.kind === kind).length;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const travel = commands.filter(c => c.kind === "line" && !c.penDown).length;
  return `${plural(commands.length, "command")} (${plural(count("line"), "line")}, ${plural(count("arc"), "arc")}, ${plural(count("spin"), "spin")}), ${plural(travel, "pen-up move")}`;
};
