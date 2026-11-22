<script lang="ts">
  import type Extension from ".";
  import type { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";
  import { onMount } from "svelte";

  type Value = ParameterOf<Extension, "drawDrawing", 0>;

  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  // svelte-ignore unused-export-let
  export let extension: Extension;

  /** pad size in CSS pixels; strokes are stored in these coordinates */
  const size = 240;
  /** skip points closer than this to the previous one, to keep saved drawings small */
  const minStep = 2;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let strokes: Value = (current?.value ?? []).map((stroke) => [...stroke]);
  let active: number[] | null = null;

  const describe = (strokes: Value) =>
    strokes.length === 0
      ? "empty drawing"
      : `drawing (${strokes.length} stroke${strokes.length === 1 ? "" : "s"})`;

  /** Saves the drawing into the block. Only called when a stroke ends, since every saved value is kept in the project. */
  const commit = () => setter({ value: strokes.map((stroke) => [...stroke]), text: describe(strokes) });

  const redraw = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size, size);
    for (const stroke of active ? [...strokes, active] : strokes) {
      ctx.beginPath();
      if (stroke.length === 2) {
        ctx.arc(stroke[0], stroke[1], ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        continue;
      }
      ctx.moveTo(stroke[0], stroke[1]);
      for (let i = 2; i + 1 < stroke.length; i += 2) ctx.lineTo(stroke[i], stroke[i + 1]);
      ctx.stroke();
    }
  };

  const point = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [
      Math.round(((event.clientX - rect.left) / rect.width) * size),
      Math.round(((event.clientY - rect.top) / rect.height) * size),
    ];
  };

  const start = (event: PointerEvent) => {
    canvas.setPointerCapture(event.pointerId);
    active = point(event);
    redraw();
  };

  const move = (event: PointerEvent) => {
    if (!active) return;
    const [x, y] = point(event);
    const lastX = active[active.length - 2], lastY = active[active.length - 1];
    if (Math.hypot(x - lastX, y - lastY) < minStep) return;
    active.push(x, y);
    redraw();
  };

  const end = () => {
    if (!active) return;
    strokes = [...strokes, active];
    active = null;
    redraw();
    commit();
  };

  const undo = () => {
    strokes = strokes.slice(0, -1);
    redraw();
    commit();
  };

  const clear = () => {
    strokes = [];
    redraw();
    commit();
  };

  onMount(() => {
    const scale = window.devicePixelRatio || 1;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.strokeStyle = ctx.fillStyle = "black";
    ctx.lineWidth = 4;
    ctx.lineCap = ctx.lineJoin = "round";
    redraw();
  });
</script>

<!-- stop pointer events here so Blockly doesn't treat drawing as a click outside or a drag -->
<div
  class="container"
  role="group"
  aria-label="Drawing pad"
  on:pointerdown|stopPropagation
  on:mousedown|stopPropagation
  on:touchstart|stopPropagation
>
  <canvas
    bind:this={canvas}
    style="width: {size}px; height: {size}px;"
    on:pointerdown|preventDefault={start}
    on:pointermove|preventDefault={move}
    on:pointerup={end}
    on:pointercancel={end}
  />
  <div class="buttons">
    <button on:click={undo} disabled={strokes.length === 0}>Undo</button>
    <button on:click={clear} disabled={strokes.length === 0}>Clear</button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  canvas {
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: crosshair;
    touch-action: none;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  button {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  button:disabled {
    cursor: default;
    opacity: 0.5;
  }
</style>
