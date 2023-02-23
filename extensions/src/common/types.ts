import type Runtime from '$scratch-vm/engine/runtime';
import BlockUtility from '$scratch-vm/engine/block-utility';
import { ArgumentType, BlockType, Branch, Language } from './enums';
import type { Extension, ExtensionCommon } from './extension/Extension';

export type InternalButtonKey = "__button__";
export type ButtonBlock = () => InternalButtonKey;

export type BaseExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;

/**
 * @summary An object passed to extensions on initialization. 
 * @description The Environment object should contain anything necessary for an extension to interact with the Scratch/Blockly environment
 * (and can therefore grow and evolve overtime).
 * 
 * A good rule of thumb is: If you have to access a nested object on the Runtime more than once, consider adding it to the 'Environment'
 */
export type Environment = {
  /**
   * The scratch runtime 
   */
  runtime: Runtime,
  /**
   * An example of a convenient property to have on the Environment.
   * Prior to the Extension Framework, video (and other io) was available via the runtime and thus required overly intimate knowledge of that class. 
   * NOTE: This will have type-safety soon, but currently has none.
   * @todo #161 
   */
  videoFeed: undefined | any
}

export type BlockOperation = (...args: any) => any;

type Opocde<TExtension extends ExtensionCommon> = TExtension extends Extension<any, any>
  ? keyof TExtension["BlockFunctions"]
  : MethodNames<TExtension>;

export type ParameterOf<
  TExtension extends ExtensionCommon,
  TBlockKey extends Opocde<TExtension>,
  TIndex extends number,
> = Parameters<TExtension extends Extension<any, any> ? TExtension["BlockFunctions"][TBlockKey] : TExtension[TBlockKey]>[TIndex];

export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type DynamicMenu<T> = () => MenuItem<T>[];

export type DynamicMenuThatAcceptsReporters<T> = {
  /**
   * A function that dynamically retrieves the options for this argument 
   * whenever the associated block is interacted with.
   */
  getItems: DynamicMenu<T>,
  /**
   * Indicates that this argument is allowed to accept a reporter block for input. 
   */
  acceptsReporters: true,
  /**
   * A function responsible for taking in arbitrary input 
   * and converting it to a form that it will not break your block when passed to it as an argument.
   * 
   * This function is required because this argument acceptsReporters (i.e.` acceptReporters = true`) and therefore it might receive a value it is not prepared to handle. 
   */
  handler: (reported: any) => T;
};

export type MenuThatAcceptsReporters<T> = {
  items: MenuItem<T>[],
  /**
   * Indicates that this argument is allowed to accept a reporter block for input. 
   */
  acceptsReporters: true,
  /**
   * A function responsible for taking in arbitrary input 
   * and converting it to a form that it will not break your block when passed to it as an argument.
   * 
   * This function is required because this argument acceptsReporters (i.e. `acceptReporters = true`) and therefore the argument might take on a value your block is not prepared to handle. 
   */
  handler: (reported: any) => T;
};

export type Menu<T> = MenuItem<T>[] | MenuThatAcceptsReporters<T> | DynamicMenu<T> | DynamicMenuThatAcceptsReporters<T>;

export type VerboseArgument<T> = {
  type: ScratchArgument<T>;
  defaultValue?: T | undefined;
  options?: Menu<T>;
};

export type Argument<T> = VerboseArgument<T> | ScratchArgument<T>;

export type RGBObject = { r: number, g: number, b: number };
export type Matrix = boolean[][];

export type ReturnTypeByBlockType<T extends ValueOf<typeof BlockType>> =
  T extends typeof BlockType.Boolean
  ? boolean
  : T extends typeof BlockType.Button
  ? void
  : T extends typeof BlockType.Command
  ? void
  : T extends typeof BlockType.Conditional
  ? boolean
  : T extends typeof BlockType.Event
  ? unknown // not sure yet
  : T extends typeof BlockType.Hat
  ? boolean
  : T extends typeof BlockType.Loop
  ? void
  : T extends typeof BlockType.Reporter
  ? object | string | boolean | number
  : never;

export type TypeByArgumentType<T extends ValueOf<typeof ArgumentType>> =
  T extends typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note ? number
  : T extends typeof ArgumentType.Boolean ? boolean
  : T extends typeof ArgumentType.String ? string
  : T extends typeof ArgumentType.Color ? RGBObject
  : T extends typeof ArgumentType.Matrix ? boolean[][]
  : T extends typeof ArgumentType.Image ? string // TODO
  : T extends typeof ArgumentType.Custom ? any
  : never;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ScratchArgument<T> =
  T extends RGBObject ? typeof ArgumentType.Color :
  T extends boolean[][] ? typeof ArgumentType.Matrix :
  T extends number ? (typeof ArgumentType.Number | typeof ArgumentType.Angle | typeof ArgumentType.Note | typeof ArgumentType.Custom) :
  T extends string ? (typeof ArgumentType.String | typeof ArgumentType.Custom) :
  T extends boolean ? (typeof ArgumentType.Boolean | typeof ArgumentType.Custom) :
  T extends { dataURI: string, alt: string, flipRTL: boolean } ? typeof ArgumentType.Image :
  (typeof ArgumentType.Custom);

// Used to be <T extends [...any[]]> ... not sure if it needs to be?
type ToArguments<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtility];

export type NonEmptyArray<T> = [T, ...T[]];

export type MethodNames<T> = { [k in keyof T]: T[k] extends (...args: any) => any ? k : never }[keyof T];
export type Methods<T> = { [k in MethodNames<T>]: T[k] };
export type ValidKey<T> = { [k in keyof T]: T[k] extends never ? never : k }[keyof T];
export type Primitive<IncludeSymbol extends boolean = false> = IncludeSymbol extends true
  ? bigint | boolean | null | number | string | undefined | symbol
  : bigint | boolean | null | number | string | undefined;

const enum ArgField {
  Arg = 'arg',
  Args = 'args'
}

export type Block<TExt extends BaseExtension, TOp extends BlockOperation> = {
  /**
   * @type {BlockType}
   * @example type: BlockType.Command
   * @example type: BlockType.Reporter
   * @description
   * The kind of block we're defining, from a predefined list 
   * (shown below, roughly in order from most-to-least common).
   * * `BlockType.Command` - A block that accepts 0 or more arguments and likely does something to the sprite / environment (but does not return a value). 
   *    * A function that represents a BlockType.Command block might look like:
   *      * `example_command: (text: string, value: number) => void`
   *      * Note the `void` return type
   *    * For reference, below are built-in blocks that are 'commands'
   *      * move ___ steps
   *      * say ____
   *      * next backdrop
   * * `BlockType.Reporter` - Accepts 0 or more arguments and returns a value. E.g.
   *    * A function that represents a BlockType.Command block might look like:
   *      * `example_reporter: (value: number) => number`
   *      * Note the non-`void` return type
   *    * For reference, below are built-in blocks that are 'reporters'
   *      * x position
   *      * direction
   *      * costume [name or number]
   * * `BlockType.Boolean` - same as 'Reporter' but specifically returns a Boolean value
   * * `BlockType.Hat` - Starts a stack if its value changes from falsy to truthy
   * 
   * NOTE: Scratch warns us that the below blocks are still 'in development' and therefore might not work (or at least not work as expected).
   * * `BlockType.Conditional` - control flow, like "if {}" or "if {} else {}"
   *     * A 'Conditional' block may return the one-based index of a branch to
   *     run, or it may return zero/falsy to run no branch.
   * * `BlockType.Loop` - control flow, like "repeat {} {}" or "forever {}"
   *     * A LOOP block is like a CONDITIONAL block with two differences:
   *        * the block is assumed to have exactly one child branch, and
   *        * each time a child branch finishes, the loop block is called again.
   * * `BlockType.Event` - Starts a stack in response to an event (full spec TBD)
   */
  type: ReturnType<TOp> extends ReturnType<ButtonBlock>
  ? typeof BlockType.Button
  : ReturnType<TOp> extends void
  ? typeof BlockType.Command | typeof BlockType.Button | typeof BlockType.Loop
  : ReturnType<TOp> extends boolean
  ? typeof BlockType.Reporter | typeof BlockType.Boolean | typeof BlockType.Hat
  : ReturnType<TOp> extends number
  ? (typeof BlockType.Reporter | typeof BlockType.Conditional)
  : ReturnType<TOp> extends Promise<any>
  ? never
  : typeof BlockType.Reporter | typeof BlockType.Event;

  /**
   * @summary A function that encapsulates the code that runs when a block is executed
   * @description This is where you implement what your block actually does.
   * 
   * It can/should act on the arguments you specified for this block.
   * 
   * @example
   * // An operation that could satisfy a one-liner reporter boock
   * // (specified with arrow syntax)
   * operation: (text: string, index: number) => text[index];
   * 
   * @example
   * // An operation that could satisfy a  reporter boock
   * // (specified with arrow syntax)
   * operation: (dividend: number, divisor: number) => {
   *  return dividend / divisor;
   * }
   * 
   * @example
   * // An operation that could satisfy a command block
   * // (specified with method syntax, and leveraging optional final BlockUtility parameter)
   * operation: function(msg: string, util: BlockUtility) {
   *  alert(`${msg} ${util.stackFrame.isLoop}`);
   * }
   * 
   * @param {BlockUtility} util Unless this block is a `Button`, the final argument passed to this function will always be a BlockUtility object, 
   * which can help you accomplish more advanced block behavior. If you don't need to use it, feel free to omit it.
   * @see {BlockUtility} type for more information on the final argument passed to this function.
   */
  operation: (this: TExt, ...params: TOp extends ButtonBlock ? Parameters<TOp> : ParamsAndUtility<TOp>) => TOp extends ButtonBlock ? void : ReturnType<TOp>;
  /**
   * @summary The display text of your block.
   * @description This is where you describe what your block should say. 
   * 
   * The value that this field takes on depends on if your block takes any arguments or not.
   * - If your block takes NO arguments, then this field should be a simple string. 
   * - If your block takes one or more arguments, then this field should be a function that takes the same arguments as your block, 
   * and returns a templated string (see below examples for more details). 
   * @example
   * // Text for a block that takes NO arguments
   * text: "Click me! I'm a button!"
   * @example
   * // Text for a block that takes 2 arguments 
   * text: (name: string, age: number) => `My name is ${name} and I'm ${age} years old`
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals for more info on Template Strings (aka Template Literals)
   */
  text: Parameters<TOp> extends NonEmptyArray<any> ? (...params: Parameters<TOp>) => string : string;
} & (Parameters<TOp> extends NonEmptyArray<any>
  ? Parameters<TOp> extends [any]
  // NOTE: The above check shouldn't be necessary, and instead a mapped type should be used, but JS Doc comments currently don't work with mapped types:
  // For example: [K in Parameters<T> extends [any] ? "arg" : "args"]: Parameters<T> extends [any] ? ToArguments<Parameters<T>>[0] : ToArguments<Parameters<T>>
  ? {
    /**
    * @description The args field should not be defined for blocks that take only one argument
    */
    args?: never
    /**
     * @summary The Argument your block takes.
     * 
     * Because there's a couple different pieces to a Scratch Argument 
     * (including it's acceptable values, its UI representation, if it uses a menu, if it can take reporters, etc.),
     * this field can be more involved than just simply defining the plain argument type for a function, say. 
     * @example 
     * // Only (implicitly) specifying type
     * arg: ArgumentType.Angle
     * @example
     * // Only (explicitly) specifying type
     * arg: { type: ArgumentType. Angle }
     * @example 
     * // More verbose specification, with type and default value
     * arg: { type: ArgumentType.String, defaultValue: 'hello world'}
     * @example
     * // More verbose specification with type and options (values only)
     * arg: { type: ArgumentType.Number, options: [1, 2, 3, 5, 7, 11, 13]}
     * // Note: we could've also included a defaultValue
     * @example
     * // Specifying options more verbosely with text and value
     * arg: { 
     *  type: ArgumentType.Angle, 
     *  options: [{ text: 'right', value: 90 }, { text: 'left', value: -90 }]
     * }
     * 
     * // Advanced examples available below description (including dynamic options aka menus, accepting reporters...)
     * @description This is where you define the arguments that your block should take. 
     * 
     * Because this field can take on a few different values depending on how you want your block arguments to behave, 
     * it is like best to learn from the examples above (and below).
     * @example 
     * // ADVANCED
     * // With options that accepts reporters
     * arg: { 
     *  type: ArgumentType.Number, 
     *  options: {
     *    acceptsReporter: true,
     *    items: [1, 2, 3],
     *    handler: (x: any) => {
     *       const parsed = parseInt(x);
     *       return isNan(parsed) ? 1 : Math.min(Math.max(parsed, 1), 3)
     *  }
     * }
     * @example 
     * // ADVANCED
     * // Dynamic options
     * args: {
     *  type: ArgumentType.Number,
     *  options: () => [Math.random(), Math.random()]
     * }
     * @example 
     * // ADVANCED
     * // With dynamic options that accepts reporters
     * args: {
     *  type: ArgumentType.Number,
     *  options: {
     *    acceptsReporter: true,
     *    getItems: () => [Math.random(), Math.random()],
     *    handler: (x: any) => {
     *       const parsed = parseInt(x);
     *       return isNan(parsed) ? -1 : parsed;
     *    }
     *  }
     * }
     */
    arg: ToArguments<Parameters<TOp>>[0]
  }
  : {
    /**
    * @description The arg field should not be defined for blocks that take more than one argument
    */
    arg?: never
    /**
     * @summary The Arguments that your block takes.
     * 
     * Because there's a couple different pieces to a Scratch Argument 
     * (including it's acceptable values, its UI representation, if it uses a menu, if it can take reporters, etc.),
     * this field can be more involved than just simply defining the plain argument types for a function, say. 
     * @example 
     * // Below is an args array that shows the different ways to specify arguments.
     * args: [
     *  ArgumentType.String, // Only (implicitly) specifying type
     *  { // Only (explicitly) specifying type
     *    type: ArgumentType.Angle 
     *  },  
     *  { // Specifying type and default value
     *    type: ArgumentType.String, 
     *    defaultValue: 'hello world'
     *  }, 
     *  { // Specifying type and options (with values only)
     *    type: ArgumentType.Number, 
     *    options: [1, 2, 3, 5, 7, 11, 13]
     *  }, 
     *  { // Specifying type, default value, and options (with values and text)
     *    type: ArgumentType.Angle, 
     *    defaultValue: -90, 
     *    options: [{ text: 'right', value: 90 }, { text: 'two', value: -90 }]
     *  } 
     * ]
     * 
     * // Advanced examples are available below description (include dynamic options aka menus, accepting reporters...)
     * 
     * @description This is where you define the arguments that your block should take. 
     * 
     * Because this field can take on a few different values depending on how you want your block arguments to behave, 
     * it is likely best to learn from the examples above (and below).
     * @example 
     * // ADVANCED
     * args: [
     *  { // Dynamic options
     *    type: ArgumentType.Number,
     *    options: () => [Math.random(), Math.random()]
     *  }, 
     *  { // With options that accepts reporters
     *    type: ArgumentType.Number, 
     *    options: {
     *      acceptsReporter: true,
     *      items: [1, 2, 3],
     *      handler: (x: any) => {
     *        const parsed = parseInt(x);
     *        return isNan(parsed) ? 1 : Math.min(Math.max(parsed, 1), 3)
     *      } 
     *    }
     *  }, 
     *  { // With dynamic options that accepts reporters
     *    type: ArgumentType.Number,
     *    options: {
     *      acceptsReporter: true,
     *      getItems: () => [Math.random(), Math.random()],
     *      handler: (x: any) => {
     *        const parsed = parseInt(x);
     *        return isNan(parsed) ? -1 : parsed;
     *      }
     *    }
     *  } 
     * ]
     */
    args: ToArguments<Parameters<TOp>>
  }
  : {
    /**
     * @description The args field should not be defined for blocks that take no arguments
     */
    args?: never
    arg?: never
  });

/**
 * How an extension should display in the extensions menu.
 * 
 * IMPORTANT! You can NOT use template literal types. 
 * @link https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html (Not allowed!)
 */
export type ExtensionMenuDisplayDetails = {
  name: string;
  description: string;
  iconURL: string;
  insetIconURL: string;
  internetConnectionRequired?: boolean;
  collaborator?: string;
  bluetoothRequired?: boolean;
  launchPeripheralConnectionFlow?: boolean;
  useAutoScan?: boolean;
  connectionIconURL?: string;
  connectionSmallIconURL?: string;
  connectionTipIconURL?: string;
  connectingMessage?: string;
  helpLink?: string;
  featured?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  implementationLanguage?: ValueOf<typeof Language>;
} & Partial<Record<ValueOf<typeof Language>, { name: string, description: string }>>

export type DefineBlock<TExt extends BaseExtension, TOp extends BlockOperation> = ((extension: TExt) => Block<TExt, TOp>) | Block<TExt, TOp>;

export type ExtensionBlocks = Record<string, BlockOperation>;

export type BlockDefinitions<T extends BaseExtension> =
  {
    [k in keyof T["BlockFunctions"]]: T["BlockFunctions"][k] extends
    (...args: infer A) => infer R
    ? DefineBlock<T, (...args: A) => R>
    : never
  };

export type BlocksInfo<T extends BaseExtension> = {
  [k in keyof T["BlockFunctions"]]: T["BlockFunctions"][k] extends
  (...args: infer A) => infer R
  ? Block<T, (...args: A) => R>
  : never
};

export type BlockInfo<TExtension extends BaseExtension, TKey extends keyof BlocksInfo<TExtension>> = BlocksInfo<TExtension>[TKey];

type ArgsTextCommon = {
  options?: (string)[]
}

type ArgsText<T> = T extends ScratchArgument<string> | VerboseArgument<string>
  ? ({
    defaultValue?: string,
  } & ArgsTextCommon)
  : ArgsTextCommon;

type ToArgumentsText<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [ArgsText<Head>, ...ToArgumentsText<Tail>]
  : [];


type ExtractTextFromBlock<TOp extends BlockOperation, TBlock extends Block<BaseExtension, TOp>> =
  TBlock["args"] extends never
  ? TBlock["arg"] extends never
  ? string | { blockText: TBlock["text"] }
  : {
    blockText: TBlock["text"],
    argsText?: ArgsText<TBlock["arg"]>,
  }
  : TBlock["text"] extends (...args: [any]) => any
  ? {
    blockText: TBlock["text"],
    argsText?: ToArgumentsText<TBlock["args"]>,
  }
  : never // shouldn't happen

export type AllText<T extends Extension<any, any>> = {
  [k in keyof T["BlockFunctions"]]: ExtractTextFromBlock<T["BlockFunctions"][k], Block<BaseExtension, T["BlockFunctions"][k]>>
};

export type Translations<T extends Extension<any, any>> = Partial<{ [k in ValueOf<typeof Language>]: AllText<T> | undefined }>;

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? readonly [...UnionToTuple<Exclude<T, W>>, W]
  : readonly [];

export type KeysWithValuesOfType<T, V> = keyof { [P in keyof T as T[P] extends V ? P : never]: P };

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

// Type definitions for scratch-vm (extension environment) 3.0
// Project: https://github.com/LLK/scratch-vm#readme
// Definitions by: Richie Bendall <https://github.com/Richienb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

export type ValueOf<ObjectType> = ObjectType[keyof ObjectType];

/**
 * Raw extension block data paired with processed data ready for scratch-blocks
 */
export type ConvertedBlockInfo = {
  /**
   * the raw block info
   */
  info: ExtensionBlockMetadata;
  /**
   * the scratch-blocks JSON definition for this block
   */
  json: Object;
  /**
   * the scratch-blocks XML definition for this block
   */
  xml: string;
}

/**
 * Information about a block category
 */
export type CategoryInfo = {
  /**
   * the unique ID of this category
   */
  id: string;
  /**
   * the human-readable name of this category
   */
  name: string;
  /**
   * optional URI for the block icon image
   */
  blockIconURI?: string;
  /**
   * the primary color for this category, in '#rrggbb' format
   */
  color1: string;
  /**
   * the secondary color for this category, in '#rrggbb' format
   */
  color2: string;
  /**
   * the tertiary color for this category, in '#rrggbb' format
   */
  color3: string;
  /**
   * the blocks, separators, etc. in this category
   */
  blocks: ConvertedBlockInfo[];
  /**
   * the menus provided by this category
   */
  menus: Object[];
  customFieldTypes?: any;
  showStatusButton?: boolean;
  menuIconURI?: string;
}

/** All the metadata needed to register an extension. */
export interface ExtensionMetadata {
  /** A unique alphanumeric identifier for this extension. No special characters allowed. */
  id: string;

  /** The human-readable name of this extension. */
  name?: string | undefined;

  /** URI for an image to be placed on each block in this extension. Data URI ok. */
  blockIconURI?: string | undefined;

  /** URI for an image to be placed on this extension's category menu item. Data URI ok. */
  menuIconURI?: string | undefined;

  /** Link to documentation content for this extension. */
  docsURI?: string | undefined;

  /** The blocks provided by this extension and the separators. */
  blocks: readonly ExtensionBlockMetadata[] | readonly string[];

  /** Map of menu name to metadata for each of this extension's menus. */
  menus?: Record<string, ExtensionMenuMetadata> | undefined;
}

/** All the metadata needed to register an extension block. */
export interface ExtensionBlockMetadata {
  /** A unique alphanumeric identifier for this block. No special characters allowed. */
  opcode: string;

  /** The name of the function implementing this block. Can be shared by other blocks/opcodes. */
  func?: string | undefined;

  /** The type of block (command, reporter, etc.) being described. */
  blockType: ValueOf<typeof BlockType>;

  /** The text on the block, with [PLACEHOLDERS] for arguments. */
  text: string;

  /** Whether this block should not appear in the block palette. */
  hideFromPalette?: boolean | undefined;

  /** Whether the block ends a stack - no blocks can be connected after it. */
  isTerminal?: boolean | undefined;

  /** Whether this block is a reporter but should not allow a monitor. */
  disableMonitor?: boolean | undefined;

  /** If this block is a reporter, this is the scope/context for its value. */
  reporterScope?: ReporterScope | undefined;

  /** Whether a hat block is edge-activated. */
  isEdgeActivated?: boolean | undefined;

  /** Whether a hat/event block should restart existing threads. */
  shouldRestartExistingThreads?: boolean | undefined;

  /** For flow control blocks, the number of branches/substacks for this block. */
  branchCount?: number | undefined;

  /** Map of argument placeholder to metadata about each arg. */
  arguments?: Record<string, ExtensionArgumentMetadata> | undefined;
}

/** All the metadata needed to register an argument for an extension block. */
export interface ExtensionArgumentMetadata {
  /** The type of the argument (number, string, etc.) */
  type: ValueOf<typeof ArgumentType>;

  /** The default value of this argument. */
  defaultValue?: any;

  /** The name of the menu to use for this argument, if any. */
  menu?: string | undefined;
}

/** All the metadata needed to register an extension drop-down menu. */
export type ExtensionMenuMetadata = ExtensionDynamicMenu | ExtensionMenuItems;

/** The string name of a function which returns menu items. */
export type ExtensionDynamicMenu = string;

/** Items in an extension menu. */
export type ExtensionMenuItems = {
  items: readonly ExtensionMenuItemSimple[] | readonly ExtensionMenuItemComplex[] | ExtensionDynamicMenu,
  acceptReporters: boolean
};

/** A menu item for which the label and value are identical strings. */
export type ExtensionMenuItemSimple = string;

/** A menu item for which the label and value can differ. */
export interface ExtensionMenuItemComplex {
  /** The value of the block argument when this menu item is selected. */
  value: any;

  /** The human-readable label of this menu item in the menu. */
  text: string;
}

export type ScratchExtension = {
  /** Returns data about the extension. */
  getInfo(): ExtensionMetadata;
}

/** Indicate the scope for a reporter's value. */
declare enum ReporterScope {
  /** This reporter's value is global and does not depend on context. */
  GLOBAL = "global",

  /**
   * This reporter's value is specific to a particular target/sprite.
   * Another target may have a different value or may not even have a value.
   */
  TARGET = "target"
}

