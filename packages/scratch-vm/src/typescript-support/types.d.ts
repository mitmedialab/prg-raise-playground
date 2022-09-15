import type Runtime from '../engine/runtime';
import BlockUtility from '../engine/block-utility';
import { ArgumentType, BlockType, Language } from './enums';
import type { Extension } from './Extension';
/**
 * @summary An object passed to extensions on initialization.
 * @description The Environment object should contain anything necessary for an extension to interact with the Scratch/Blockly environment
 * (and can therefore grow and evolve overtime).
 *
 * A good rule of thumb is: If you have to access a nested object on the Runtime more than once, consider adding it to the 'Environment'
 */
export declare type Environment = {
    /**
     * The scratch runtime
     */
    runtime: Runtime;
    /**
     * An example of a convenient property to have on the Environment.
     * Prior to the Extension Framework, video (and other io) was available via the runtime and thus required overly intimate knowledge of that class.
     * NOTE: This will have type-safety soon, but currently has none.
     * @todo #161
     */
    videoFeed: undefined | any;
};
export declare type BlockOperation = (...args: any) => any;
export declare type MenuItem<T> = T | {
    value: T;
    text: string;
};
export declare type DynamicMenu<T> = () => MenuItem<T>[];
export declare type DynamicMenuThatAcceptsReporters<T> = {
    /**
     * A function that dynamically retrieves the options for this argument
     * whenever the associated block is interacted with.
     */
    getItems: DynamicMenu<T>;
    /**
     * Indicates that this argument is allowed to accept a reporter block for input.
     */
    acceptsReporters: true;
    /**
     * A function responsible for taking in arbitrary input
     * and converting it to a form that it will not break your block when passed to it as an argument.
     *
     * This function is required because this argument acceptsReporters (i.e.` acceptReporters = true`) and therefore it might receive a value it is not prepared to handle.
     */
    handler: (reported: any) => T;
};
export declare type MenuThatAcceptsReporters<T> = {
    items: MenuItem<T>[];
    /**
     * Indicates that this argument is allowed to accept a reporter block for input.
     */
    acceptsReporters: true;
    /**
     * A function responsible for taking in arbitrary input
     * and converting it to a form that it will not break your block when passed to it as an argument.
     *
     * This function is required because this argument acceptsReporters (i.e. `acceptReporters = true`) and therefore the argument might take on a value your block is not prepared to handle.
     */
    handler: (reported: any) => T;
};
export declare type Menu<T> = MenuItem<T>[] | MenuThatAcceptsReporters<T> | DynamicMenu<T> | DynamicMenuThatAcceptsReporters<T>;
export declare type VerboseArgument<T> = {
    type: ScratchArgument<T>;
    defaultValue?: T | undefined;
    options?: Menu<T>;
};
export declare type Argument<T> = VerboseArgument<T> | ScratchArgument<T>;
export declare type RGBObject = {
    r: number;
    g: number;
    b: number;
};
export declare type Matrix = boolean[][];
export declare type TypeByArgumentType = {
    [ArgumentType.Color]: RGBObject;
    [ArgumentType.Matrix]: boolean[][];
    [ArgumentType.Number]: number;
    [ArgumentType.Angle]: number;
    [ArgumentType.Note]: number;
    [ArgumentType.String]: string;
    [ArgumentType.Boolean]: boolean;
    /**
     * TODO
     */
    [ArgumentType.Image]: string;
};
export declare type ScratchArgument<T> = T extends RGBObject ? ArgumentType.Color : T extends boolean[][] ? ArgumentType.Matrix : T extends number ? (ArgumentType.Number | ArgumentType.Angle | ArgumentType.Note) : T extends string ? ArgumentType.String : T extends boolean ? (ArgumentType.Boolean) : never;
declare type ToArguments<T extends any[]> = T extends [infer Head, ...infer Tail] ? [Argument<Head>, ...ToArguments<Tail>] : [];
declare type ParamsAndUtility<T extends BlockOperation> = [...params: Parameters<T>, util: BlockUtility];
declare type NonEmptyArray<T> = [T, ...T[]];
export declare type Block<T extends BlockOperation> = {
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
    type: ReturnType<T> extends void ? BlockType.Command | BlockType.Conditional | BlockType.Loop : ReturnType<T> extends boolean ? (BlockType.Reporter | BlockType.Boolean | BlockType.Hat) : ReturnType<T> extends Promise<any> ? never : BlockType.Reporter;
    /**
     * @summary A function that encapsulates the code that runs when a block is executed
     * @description This is where you implement what your block actually does.
     *
     * It can/should act on the arguments you specified for this block.
     *
     * @param {BlockUtility} util The final argument passed to this function will always be a BlockUtility object,
     * which can help you accomplish more advanced block behavior. If you don't need to use it, feel free to omit it.
     * @see {BlockUtility} type for more information on the final argument passed to this function.
     */
    operation: (...params: ParamsAndUtility<T>) => ReturnType<T>;
    /**
     *
     */
    text: Parameters<T> extends NonEmptyArray<any> ? (...params: Parameters<T>) => string : string;
} & (Parameters<T> extends NonEmptyArray<any> ? Parameters<T> extends [any] ? {
    /**
    * @description The args field should not be defined for blocks that take only one argument
    */
    args?: never;
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
     * // Advanced examples available below description (include dynamic options aka menus, accepting reporters...)
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
    arg: ToArguments<Parameters<T>>[0];
} : {
    /**
    * @description The arg field should not be defined for blocks that take more than one argument
    */
    arg?: never;
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
    args: ToArguments<Parameters<T>>;
} : {
    /**
     * @description The args field should not be defined for blocks that take no arguments
     */
    args?: never;
    arg?: never;
});
/**
 * How an extension should display in the extensions menu.
 *
 * IMPORTANT! You can NOT use template literal types.
 * @link https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html (Not allowed!)
 */
export declare type ExtensionMenuDisplayDetails = {
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
    implementationLanguage?: Language;
} & Partial<Record<Language, {
    name: string;
    description: string;
}>>;
export declare type DefineBlock<T extends BlockOperation> = (extension: Extension<any, any>) => Block<T>;
export declare type ExtensionBlocks = Record<string, BlockOperation>;
export declare type BlockDefinitions<TBlocks extends ExtensionBlocks> = {
    [k in keyof TBlocks]: TBlocks[k] extends (...args: infer A) => infer R ? DefineBlock<(...args: A) => R> : never;
};
declare type ArgsTextCommon = {
    options?: (string)[];
};
declare type ArgsText<T> = T extends ScratchArgument<string> | VerboseArgument<string> ? ({
    defaultValue?: string;
} & ArgsTextCommon) : ArgsTextCommon;
declare type ToArgumentsText<T extends any[]> = T extends [infer Head, ...infer Tail] ? [ArgsText<Head>, ...ToArgumentsText<Tail>] : [];
declare type ExtractTextFromBlock<TOp extends BlockOperation, TBlock extends Block<TOp>> = TBlock["args"] extends never ? TBlock["arg"] extends never ? string | {
    blockText: TBlock["text"];
} : {
    blockText: TBlock["text"];
    argsText: ArgsText<TBlock["arg"]>;
} : TBlock["text"] extends (...args: [any]) => any ? {
    blockText: TBlock["text"];
    argsText: ToArgumentsText<TBlock["args"]>;
} : never;
export declare type AllText<T extends Extension<any, any>> = {
    [k in keyof T["BlockFunctions"]]: ExtractTextFromBlock<T["BlockFunctions"][k], Block<T["BlockFunctions"][k]>>;
};
export declare type Translations<T extends Extension<any, any>> = Partial<{
    [k in Language]: AllText<T> | undefined;
}>;
declare type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;
export declare type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W ? [...UnionToTuple<Exclude<T, W>>, W] : [];
export declare type KeysWithValuesOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: P;
};
export declare type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
export declare type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
export declare type ValueOf<ObjectType> = ObjectType[keyof ObjectType];
/**
 * Raw extension block data paired with processed data ready for scratch-blocks
 */
export declare type ConvertedBlockInfo = {
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
};
/**
 * Information about a block category
 */
export declare type CategoryInfo = {
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
};
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
export declare type ExtensionMenuMetadata = ExtensionDynamicMenu | ExtensionMenuItems;
/** The string name of a function which returns menu items. */
export declare type ExtensionDynamicMenu = string;
/** Items in an extension menu. */
export declare type ExtensionMenuItems = {
    items: Array<ExtensionMenuItemSimple | ExtensionMenuItemComplex> | ExtensionDynamicMenu;
    acceptReporters: boolean;
};
/** A menu item for which the label and value are identical strings. */
export declare type ExtensionMenuItemSimple = string;
/** A menu item for which the label and value can differ. */
export interface ExtensionMenuItemComplex {
    /** The value of the block argument when this menu item is selected. */
    value: any;
    /** The human-readable label of this menu item in the menu. */
    text: string;
}
export declare type ScratchExtension = {
    /** Returns data about the extension. */
    getInfo(): ExtensionMetadata;
};
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
export {};
