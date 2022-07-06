export const enum BlockType {
  /**
   * Boolean reporter with hexagonal shape
   */
  Boolean = 'Boolean',

  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  Button = 'button',

  /**
   * Command block
   */
  Command = 'command',

  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  Conditional = 'conditional',

  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  Event = 'event',

  /**
   * Hat block which conditionally starts a block stack
   */
  Hat = 'hat',

  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  Loop = 'loop',

  /**
   * General reporter with numeric or string value
   */
  Reporter = 'reporter'
};

export const enum ArgumentType {
  /** Numeric value with angle picker. */
  Angle = "angle",

  /** Boolean value with hexagonal placeholder. */
  Boolean = "Boolean",

  /** Numeric value with color picker. */
  Color = "color",

  /** Numeric value with text field. */
  Number = "number",

  /** String value with text field. */
  String = "string",

  /** String value with matrix field. */
  Matrix = "matrix",

  /** MIDI note number with note picker (piano) field. */
  Note = "note",

  /** Inline image on block (as part of the label). */
  Image = "image"
}