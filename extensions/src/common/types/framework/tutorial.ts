/**
 * Part of the Scratch editor that a tutorial step can point at.
 * - `category`: this extension's entry in the category list (left of the palette)
 * - `palette`: the list of this extension's blocks
 * - `stage`: the stage
 * - `green-flag`: the green flag button
 * - `workspace`: the coding area
 */
export type TutorialUITarget = "category" | "palette" | "stage" | "green-flag" | "workspace";

/**
 * What a tutorial step spotlights. Omit to show the step centered, with nothing highlighted.
 * - `block`: a block in this extension's palette, identified by its opcode (the method name for most extensions)
 * - `button`: a button in this extension's palette, identified by its label
 * - `ui`: a part of the editor
 */
export type TutorialTarget = { block: string } | { button: string } | { ui: TutorialUITarget };

/**
 * Something a step waits for the user to do. Each has a `label`, which is shown to the user in a checklist.
 * - `blockPlaced`: one of this extension's blocks (identified by opcode) has been dragged into the code area.
 *   It can also be required to be in the right place: `inside` a block of some type (for example, in a
 *   `control_forever` loop, or in the condition of a `control_if`), or `onTopOf` a block of some type
 *   (a hat block placed above, say, `looks_say`)
 * - `scriptRun`: a script that contains one of this extension's blocks (identified by opcode) has started running:
 *   its hat block fired, or the user clicked the green flag or the script. (This is deliberately about a script running,
 *   not the project: with an edge-activated hat in it, such as "when smile detected", the editor treats the project as
 *   running all the time.)
 */
export type TutorialCondition = { label: string } & (
  | { type: "blockPlaced", block: string, inside?: string, onTopOf?: string }
  | { type: "scriptRun", block: string }
);

/**
 * Where to pin a step's popover.
 * - `stage-bottom-left` / `stage-bottom-right`: just below the stage, lined up with its left or right edge
 * - `workspace-bottom-left` / `workspace-bottom-right`: a bottom corner of the code area
 *   (the part of the editor between the palette and the stage)
 */
export type TutorialPosition =
  | "stage-bottom-left" | "stage-bottom-right"
  | "workspace-bottom-left" | "workspace-bottom-right";

export type TutorialStep = {
  title: string;
  /** Explanation shown in the popover */
  text: string;
  target?: TutorialTarget;
  /**
   * Pins the step's popover somewhere, instead of placing it next to the `target` (which is still spotlit, and
   * which the popover's arrow points at when it isn't pinned). Useful when the popover would otherwise cover
   * something the user needs to see. Steps with `waitFor` default to `"workspace-bottom-right"`.
   */
  position?: TutorialPosition;
  /**
   * Standard Scratch blocks (by opcode, like `event_whenflagclicked`) to add to the code area when this step is shown,
   * connected one under the other from top to bottom. Use it to set up the parts of an activity that aren't about
   * your extension, so users can focus on your blocks. Say in the step's text that they've been added.
   * They are copied from the palette, so they can only be blocks that the palette offers.
   * If the sprite already has scripts, the user is asked before reaching this step whether to delete them (the step
   * needs the room). If they decline, the tour stays on the step before this one.
   */
  addBlocks?: string[];
  /**
   * Turns the step into an activity: it shows a checklist of these conditions, which tick off as the user does them.
   * Conditions are checked in order, so one only counts after the ones before it have been met.
   * Until they're all met, the Next button reads "Skip", so users are never stuck.
   *
   * Because the user has to be able to use the editor, these steps don't dim or spotlight anything, and their popover
   * sits in the corner of the code area (see `position`) where it's out of the way.
   */
  waitFor?: TutorialCondition[];
};

/** The shape of an extension's `tutorial.json` */
export type ExtensionTutorial = {
  steps: TutorialStep[];
};
