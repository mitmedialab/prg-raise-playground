import type BlockUtility from "$scratch-vm/engine/block-utility";
import { BaseGenericExtension } from ".";
import { BlockType } from "../enums";
import { NonEmptyArray, ValueOf } from "../utils";
import { ParamsAndUtility, ToArguments } from "./arguments";

export type InternalButtonKey = "__button__";
export type ButtonBlock = () => InternalButtonKey;

export type BlockMetadata<
  Fn extends BlockOperation,
  TParameters extends any[] = Parameters<Fn> extends [...infer R, BlockUtility] ? R : Parameters<Fn>
> = Type<ReturnType<Fn>> & Text<TParameters> & Arguments<TParameters>;

export type Block<TExt extends BaseGenericExtension, TOp extends BlockOperation> = BlockMetadata<TOp> & Operation<TExt, TOp>;

type Type<Return> = {
  /**
   * @example type: BlockType.Command
   * @example type: BlockType.Reporter
   * @example type: "reporter" // using the equivalent string from the value pulled off of BlockType
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
  type: Return extends ReturnType<ButtonBlock>
  ? typeof BlockType.Button
  : Return extends void
  ? typeof BlockType.Command | typeof BlockType.Button | typeof BlockType.Loop
  : Return extends boolean
  ? typeof BlockType.Boolean | typeof BlockType.Hat
  : Return extends number
  ? typeof BlockType.Reporter | typeof BlockType.Conditional
  : Return extends Promise<infer Awaited>
  ? Type<Awaited>["type"]
  : typeof BlockType.Reporter | typeof BlockType.Event;
}

type Text<TParameters extends any[]> = {
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
  text: TParameters extends NonEmptyArray<any> ? (...params: TParameters) => string : string;
}

type Arguments<TParameters extends any[]> =
  TParameters extends [] | [BlockUtility] ? {
    /**
     * @description The args field should not be defined for blocks that take no arguments
     */
    args?: never;
    /**
     * @description The args field should not be defined for blocks that take no arguments
     */
    arg?: never;
  }
  : TParameters extends [any] ? {
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
    arg: ToArguments<TParameters>[0];
  }
  : {
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
     *    options: [{ text: 'right', value: 90 }, { text: 'left', value: -90 }]
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
    args: ToArguments<TParameters>;
  };


type Operation<TExt extends BaseGenericExtension, TOp extends BlockOperation> = {
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
}

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

/**
 * These are most common types of values returned by block methods. 
 * The Block Programming environment has built-in support for display these kinds of returned values to the user.
 * 
 * If you wanted to return something more complex (like an object), speak with one of this project's maintainers. 
 */
export type CommonReturnTypes = boolean | string | number;

export type BlockOperation = (...args: any) => any;

export type DefineBlock<TExt extends BaseGenericExtension, TOp extends BlockOperation> = ((extension: TExt) => Block<TExt, TOp>) | Block<TExt, TOp>;

export type ExtensionBlocks = Record<string, BlockOperation>;

export type BlockDefinitions<T extends BaseGenericExtension> =
  {
    [k in keyof T["BlockFunctions"]]: T["BlockFunctions"][k] extends
    (...args: infer A) => infer R
    ? DefineBlock<T, (...args: A | [...A, BlockUtility]) => R>
    : never
  };

export type BlocksInfo<T extends BaseGenericExtension> = {
  [k in keyof T["BlockFunctions"]]: T["BlockFunctions"][k] extends
  (...args: infer A) => infer R
  ? Block<T, (...args: A) => R>
  : never
};

export type BlockInfo<TExtension extends BaseGenericExtension, TKey extends keyof BlocksInfo<TExtension>> = BlocksInfo<TExtension>[TKey];

export type NoArgsBlock = BlockMetadata<() => any>;
export type OneArgBlock = BlockMetadata<(arg: unknown, utility: BlockUtility) => any>;
export type MultipleArgsBlock = BlockMetadata<(arg1: unknown, arg2: unknown, utility: BlockUtility) => any>;
export type WithArgsBlock = BlockMetadata<(...args: any[]) => any>;
export type AnyBlock = NoArgsBlock | OneArgBlock | MultipleArgsBlock;
