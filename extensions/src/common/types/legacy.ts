import { ArgumentType, BlockType } from "./enums";
import { ValueOf } from "./utils";

// Type definitions for scratch-vm (extension environment) 3.0
// Project: https://github.com/LLK/scratch-vm#readme
// Definitions by: Richie Bendall <https://github.com/Richienb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

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

  color1?: string;
  color2?: string;
  color3?: string;
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

