import type Runtime from '../engine/runtime';
import { ArgumentType, BlockType } from './enums';
import type { Extension } from './Extension';
import type BlockUtility from '../engine/block-utility';

export type Environment = {
  runtime: Runtime
}

export type BlockOperation = (...args: any) => any;

export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type MenuThatAcceptsReporters<T> = {
  items: MenuItem<T>[],
  handler: (reported: any) => T;
};

export type Argument<T> = {
  type: TSToScratchArg<T>;
  defaultValue?: T | undefined;
  options?: MenuItem<T>[] | MenuThatAcceptsReporters<T> | undefined;
}

export type TSToScratchArg<T> =
  T extends number ? (ArgumentType.Number | ArgumentType.Angle | ArgumentType.Note | ArgumentType.Color) :
  T extends string ? (ArgumentType.String | ArgumentType.Matrix | ArgumentType.Color) :
  T extends boolean ? (ArgumentType.Boolean) : never;

// Used to be <T extends [...any[]]> ... not sure if it needs to be?
type ToArguments<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

type ParamsAndUtility<T extends BlockOperation> = [...Parameters<T>, BlockUtility];

export type Block<T extends BlockOperation> = {
  type: ReturnType<T> extends void ? BlockType.Command : 
        ReturnType<T> extends boolean ? (BlockType.Reporter | BlockType.Boolean | BlockType.Hat) :
        BlockType.Reporter;
  operation: (...params: ParamsAndUtility<T>) => ReturnType<T>;
  args: ToArguments<Parameters<T>>;
  text: (...params: Parameters<T>) => string;
}

export type ExtensionMenuDisplayDetails = {
  title: string;
  description: string;
  iconURL: string;
  insetIconURL: string;
}

/**
 * Description of type
 * @property {string} title The ee
 */
export type ExtensionMenuDisplay<TTitle extends string,
  TDescription extends string,
  TIconURL extends string,
  TInsetIconURL extends string> = {
    title: TTitle;
    description: TDescription;
    iconURL: TIconURL;
    insetIconURL: TInsetIconURL;
  }

export type BlockBuilder<T extends BlockOperation> = (extension: Extension<any, any>) => Block<T>;

export type ExtensionBlocks = Record<string, BlockOperation>;

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
  items: Array<ExtensionMenuItemSimple | ExtensionMenuItemComplex>, 
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