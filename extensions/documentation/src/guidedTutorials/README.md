[](order=11)
## Guided Tutorials

An extension can come with a **guided tutorial**: a step-by-step tour that dims the editor, spotlights one thing at a time, and explains it in a popover.

To add one, create a file called `tutorial.json` next to your extension's `index.ts` (for example, `extensions/src/myExtension/tutorial.json`). That's all there is to it: while you're running `pnpm dev`, the file is picked up and a small **?** button appears next to your extension's title in the palette. Clicking it starts the tour.

You don't write any code. You describe the steps, and the editor does the rest.

### A first tutorial

```json
{
  "$schema": "../../tutorial.schema.json",
  "steps": [
    {
      "title": "Meet My Extension",
      "text": "This extension makes your sprite dance. Let's take a quick tour.",
      "target": { "ui": "category" }
    },
    {
      "title": "Make it dance",
      "text": "This block makes the sprite dance for a few seconds.",
      "target": { "block": "dance" }
    }
  ]
}
```

The `"$schema"` line is optional, but worth keeping: it lets your editor (such as VS Code) offer autocomplete and hover help for everything below, and underline mistakes as you type.

### Steps

Each step has these properties:

| Property | Required | What it does |
|---|---|---|
| `title` | yes | The heading of the popover. |
| `text` | yes | The explanation. Keep it short: a couple of sentences. |
| `target` | no | What to spotlight (and point the popover's arrow at). Leave it out to show the popover on its own, in the middle of the screen. |
| `position` | no | Pins the popover to a spot, instead of placing it next to the target. |
| `addBlocks` | no | Standard Scratch blocks to add to the code area for this step. |
| `waitFor` | no | Things for the user to do, shown as a checklist. |

### Targets

A `target` has exactly one of:

- `{ "block": "dance" }` spotlights one of your extension's blocks in the palette. Use the block's **opcode**: for most extensions, the name of the method that implements the block.
- `{ "button": "Edit Model" }` spotlights a button in the palette, identified by the text on it.
- `{ "ui": "stage" }` spotlights a part of the editor. The parts are `category` (your extension's entry in the category list), `palette` (the list of your blocks), `stage`, `green-flag`, and `workspace` (the coding area).

If a target can't be found (say, because a block was renamed), the step still shows, in the middle of the screen, and a warning is written to the browser's console.

### Position

By default the popover appears next to its target. Set `position` when it would cover something the user needs to see. The options are `stage-bottom-left` and `stage-bottom-right` (just below the stage), and `workspace-bottom-left` and `workspace-bottom-right` (a bottom corner of the coding area). A step with a spotlight keeps it when it has a `position`.

### Activities: asking the user to try it

A step becomes an **activity** when it has `waitFor`: a list of things for the user to do. They appear as a checklist in the popover, and tick off as the user does them. The editor is not dimmed during an activity, so the user can use it.

```json
{
  "title": "Try it yourself!",
  "text": "I've added “when green flag clicked” and “forever” blocks. Drag “dance” into the forever loop, then click the green flag.",
  "addBlocks": ["event_whenflagclicked", "control_forever"],
  "waitFor": [
    {
      "type": "blockPlaced",
      "block": "dance",
      "inside": "control_forever",
      "label": "Drag the “dance” block into the “forever” loop"
    },
    {
      "type": "scriptRun",
      "block": "dance",
      "label": "Click the green flag"
    }
  ]
}
```

There are two kinds of thing to wait for (`type`), and each has a `label` that is shown to the user:

- `blockPlaced`: the user has dragged one of your blocks (`block`) into the coding area. You can also require where it goes: `inside` a block of some type (for example `control_forever`, or `control_if`, whose condition counts too), or `onTopOf` a block of some type (how a hat block is placed above, say, `looks_say`).
- `scriptRun`: a script that contains one of your blocks has started running. That means its hat block fired, or the user clicked the green flag or the script.

Conditions are checked **in order**, so the user can't tick the second one before the first. Until everything is ticked, the Next button reads "Skip", so nobody gets stuck (for example, someone without a camera).

`addBlocks` adds standard Scratch blocks (by opcode, like `event_whenflagclicked`) to the coding area when the user reaches the step, connected one under the other, top to bottom. Use it for the parts of the activity that aren't about your extension. Say in the step's text that they've been added. If the sprite already has scripts, the user is asked, before the step, whether to delete them to make room.

> **Tip:** if a `waitFor` condition refers to a standard block (like `control_forever`), make sure the step's `addBlocks` adds it, or the user has no way to meet the condition.

### Tips for good tutorials

- **Go through your blocks in the order they appear in the palette**, one step each, so no block is skipped.
- Start with a step targeting the `category`, to say what the extension is for, and finish with an activity.
- Describe what the user sees, using the words that are on the blocks and menus (for example "index finger", not `indexFinger`).
- Keep the text short. People read these while they're trying to do something else.

### If something is wrong

The tutorial is checked when your extension is built. If it isn't valid, the build says what is wrong and where, for example:

```
There are problems with the tutorial in extensions/src/myExtension/tutorial.json:
  - Step 2 ("Make it dance"): unknown property "tilte" (did you mean "title"?)
  - Step 3 ("Try it yourself!"), "waitFor" item 1: "label" is required
```

Changes to `tutorial.json` are rebuilt automatically while `pnpm dev` is running.
