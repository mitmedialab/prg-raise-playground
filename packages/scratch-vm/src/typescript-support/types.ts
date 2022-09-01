import type Runtime from '../engine/runtime';
import BlockUtility = require('./BlockUtility');
import { ArgumentType, BlockType, Branch, Language } from './enums';
import type { Extension } from './Extension';

export type Environment = {
  runtime: Runtime
}

export type BlockOperation = (...args: any) => any;

export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type DynamicMenu<T> = () =>  MenuItem<T>[];

export type DynamicMenuThatAcceptsReporters<T> = {
  getItems: DynamicMenu<T>,
  acceptsReporters: true,
  handler: (reported: any) => T;
};

export type MenuThatAcceptsReporters<T> = {
  items: MenuItem<T>[],
  acceptsReporters: true,
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

export type TypeByArgumentType = {
  [ArgumentType.Color]: RGBObject,
  [ArgumentType.Matrix]: boolean[][],
  [ArgumentType.Number]: number,
  [ArgumentType.Angle]: number,
  [ArgumentType.Note]: number,
  [ArgumentType.String]: string,
  [ArgumentType.Boolean]: boolean,
  [ArgumentType.Image]: string, // TODO
}

export type ScratchArgument<T> =
  T extends RGBObject ? ArgumentType.Color :
  T extends boolean[][] ? ArgumentType.Matrix :
  T extends number ? (ArgumentType.Number | ArgumentType.Angle | ArgumentType.Note) :
  T extends string ? ArgumentType.String  :
  T extends boolean ? (ArgumentType.Boolean) : 
  never;

// Used to be <T extends [...any[]]> ... not sure if it needs to be?
type ToArguments<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtility];

type NonEmptyArray<T> = [T, ...T[]];

export type Block<T extends BlockOperation> = {
  /**
   * @description
   * The kind of block we're defining, from a predefined list 
   * (shown below, roughly in order from most-to-least common).
   * * BlockType.Command - A block that accepts 0 or more arguments and likely does something to the sprite / environment (but does not return a value). 
   *    * A function that represents a BlockType.Command block might look like:
   *      * `example_command: (text: string, value: number) => void`
   *      * Note the `void` return type
   *    * For reference, below are built-in blocks that are 'commands'
   *      * move ___ steps
   *      * say ____
   *      * next backdrop
   * * BlockType.Reporter - Accepts 0 or more arguments and returns a value. E.g.
   *    * x position
   *    * direction
   *    * costume [name or number]
   * * BlockType.Boolean - same as 'Reporter' but specifically returns a Boolean value
   * * BlockType.Hat - Starts a stack if its value changes from falsy to truthy
   * 
   * NOTE: Scratch warns us that the below blocks are still 'in development' and therefore might contain bugs.
   * * BlockType.Conditional - control flow, like "if {}" or "if {} else {}"
   *     * A 'Conditional' block may return the one-based index of a branch to
   *     run, or it may return zero/falsy to run no branch.
   * * BlockType.Loop - control flow, like "repeat {} {}" or "forever {}"
   *     * A LOOP block is like a CONDITIONAL block with two differences:
   *        * the block is assumed to have exactly one child branch, and
   *        * each time a child branch finishes, the loop block is called again.
   * BlockType.Event - Starts a stack in response to an event (full spec TBD)
   */
  type: ReturnType<T> extends void ? BlockType.Command | BlockType.Conditional | BlockType.Loop : 
        ReturnType<T> extends boolean ? (BlockType.Reporter | BlockType.Boolean | BlockType.Hat) :
        ReturnType<T> extends Promise<any> ? never :
        BlockType.Reporter;
  /**
   * 
   */
  operation: (...params: ParamsAndUtility<T>) => ReturnType<T>;
  text: Parameters<T> extends NonEmptyArray<any> ? (...params: Parameters<T>) => string : string;
} & (Parameters<T> extends NonEmptyArray<any> ? { 
  /**
   * @description The args
   */
  args: ToArguments<Parameters<T>> 
} : {
  /**
   * @description The args field should not be defined for blocks that take no arguments
   */
  args?: never
});

export type ExtensionMenuDisplayDetails = {
  name: string;
  description: string;  
  iconURL: string;
  insetIconURL: string;
  nameTranslations?: Partial<Record<Language, string>>;
  descriptionTranslations?: Partial<Record<Language, string>>;
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
}

export type DefineBlock<T extends BlockOperation> = (extension: Extension<any, any>) => Block<T>;

export type ExtensionBlocks = Record<string, BlockOperation>;

export type BlockDefinitions<TBlocks extends ExtensionBlocks> = 
{ 
  [k in keyof TBlocks]: TBlocks[k] extends 
    (...args: infer A) => infer R 
      ? DefineBlock<(...args: A) => R> 
      : never 
};

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

type ExtractTextFromBlock<TOp extends BlockOperation, TBlock extends Block<TOp>> = TBlock["args"] extends never 
  ? string | {
    blockText: TBlock["text"]
  } 
  : TBlock["text"] extends (...args: any) => any 
    ? {
      blockText: TBlock["text"],
      argsText: ToArgumentsText<TBlock["args"]>,
    }
    : never // shouldn't happen

export type AllText<T extends Extension<any, any>> = { 
  [k in keyof T["BlockFunctions"]]: ExtractTextFromBlock<T["BlockFunctions"][k], Block<T["BlockFunctions"][k]>>
};

export type Translations<T extends Extension<any, any>> = Partial<{ [k in Language]: AllText<T> | undefined }>;

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export type KeysWithValuesOfType<T,V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P };

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

// Type definitions for scratch-vm (extension environment) 3.0
// Project: https://github.com/LLK/scratch-vm#readme
// Definitions by: Richie Bendall <https://github.com/Richienb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

export type ValueOf<ObjectType> = ObjectType[keyof ObjectType];

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
  blocks: Array<ExtensionBlockMetadata | string>;

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
  blockType: BlockType;

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
  type: ArgumentType;

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
  items: Array<ExtensionMenuItemSimple | ExtensionMenuItemComplex> | ExtensionDynamicMenu, 
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