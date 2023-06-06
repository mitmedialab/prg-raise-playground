type Documentation = "See documentation below:";

/**
 * An Extension is the [class](https://www.typescriptlang.org/docs/handbook/2/classes.html) that you'll implement that adds new functionality to the Block Programming Environment by constructing new Blocks.
 * 
 * In this way, you can think of the class you implement **_as_** your extension.
 * 
 * When you define an Extension class you'll [extend](https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses) (or 'inherit') from the base class returned by the `extension` function.
 * 
 * Within your Extension file, hover the `extension` function to get a more in-depth explanation of how it returns a base class 
 * (configured to your liking) for your class to `extend` / inherit from.
 */
type Extension = Documentation;

/**
 * A Block can be thought of as a single [_function_](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions).
 * 
 * > **_Functions_** allow you to store a piece of code that does a single task. You can then call that code whenever you (or your user) needs to accomplish whatever that task might be. 
 * 
 * A Block is implemented in the following manner:
 * 1. Define a [method]((https://www.typescriptlang.org/docs/handbook/2/classes.html#methods) on your Extension class -- methods are _functions_ that belong to specific classes. This will be the functionality of your Block. 
 *    - Out of the box, your Block's method can accept any of the following argument types: 
 *      - [string](https://www.typescriptlang.org/docs/handbook/basic-types.html#string), [number](https://www.typescriptlang.org/docs/handbook/basic-types.html#number), [boolean](https://www.typescriptlang.org/docs/handbook/basic-types.html#boolean), [boolean[][]](https://www.typescriptlang.org/docs/handbook/basic-types.html#array), and/or [RGBObject]() (Link coming soon)
 *    - Your method can also return a value, which will likely be of one of the following types:
 *      - [string](https://www.typescriptlang.org/docs/handbook/basic-types.html#string), [number](https://www.typescriptlang.org/docs/handbook/basic-types.html#number), or [boolean](https://www.typescriptlang.org/docs/handbook/basic-types.html#boolean)
 *    - If none of the above types fit your needs, please contact a more experienced developer who can walk you through things like [Custom Arguments](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#adding-custom-arguments)
 * 2. Once you have your method (_what the Block does_), you'll need to add some extra info to it to tell the Block Programming Environment how to present it to the user. 
 *    - This requires you to [decorate](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators) your method with the `block` function, 
 * which we do by putting an '@' symbol in front of `block` and invoking it.
 *    - The `block` function accepts one argument which provides all the information 
 * the Block Programming Environment will need, like:
 *      - `type`: What type of block is it / how should it be used?
 *      - `text`: What text is displayed on the block? 
 *      - `arg` or `args`: How should the method's arguments map to input fields on the block? 
 *        - See [Scratch's documentation](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md#block-arguments) to get a sense of how your method's argument types map to the input fields the Block Programming Environment supports
 * 
 * @example
 * **NOTE:** Ignore the `.` in front of the `@` symbol -- this is just so JSDoc doesn't mess with the formatting.
 * ```ts
 * .@block({ 
 *  type: "command",
 *  text: "This is the text that will display on the block",
 *  args: ["string", "note"]
 * })
 * exampleMethod(someText: string, noteValue: number) {
 *    ...
 * }
 * ```
 */
type Block = Documentation;

/**
 * The Block Programming Environment is what users will use to interact with and execute your Blocks
 * (in addition to the Blocks that are built-in and those from other Extensions).
 * 
 * In this way, the Block Programming Environment is responsible for turning the code you write into
 * Blocks that can be executed at-will by users.
 *  
 * The Personal Robotics Group maintains the [RAISE Playground](https://playground.raise.mit.edu/) Block Programming Environment, 
 * which is a derivative of the [Scratch](https://scratch.mit.edu/) Block Programming Environment 
 * (which itself is based on the [blockly](https://developers.google.com/blockly) Block Programming Environment / library)
 */
type BlockProgrammingEnvironment = Documentation;

/**
 * The below object describes how your extension will display in the extensions menu. 
 * 
 * These details will be passed as the first argument to the `extension` function below
 * (see the class defintion below to see how we [extend]() the value returned by the `extension` function). 
 * 
 * Hover over any of the fields below (e.g. `name`, `description`) to see documentation about what it is/does. 
 */
type ExplanationOfDetails = Documentation;

/**
 * Below is the class that represents your Extension -- hover over the above definition of Extension if you haven't already.
 * 
 * One way to identify Extension classes is that they'll always [extend](https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses) the result of the `extension` function.
 * 
 * Hover over `extension` to get an explanation of what it does and how it's used.
 * 
 */
type ExplanationOfClass = Documentation;

/**
 * A field to demonstrate how [class fields](https://www.typescriptlang.org/docs/handbook/2/classes.html#fields) work
 */
type ExplanationOfField = Documentation;

/**
 * All Extensions must implement an `init` method (which you can see below). This is where 
 * you perform any initialization that your extension requires. 
 * 
 * Extensions are **NOT ALLOWED** to implement their own [constructors](https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors), so instead we provide this `init` method which 
 * should effectively be used in place of a constructor.
 *
 * Hover over `init` to see more comprehensive documentation. 
 * 
 * (The reason why this explanation isn't directly above the `init` method is to not interfere with the documentation already associated with it.)
 */
type ExplanationOfInitMethod = Documentation;

/** 
 * Below is an example of a 'Reporter' Block, which is a Block that takes 0 or more arguments
 * and returns a value (likely a `string` or `number`). 
 * 
 * Hover over `exampleReporter` below to observe it's type signature and that it returns a `number` 
 * (which is _inferred_ by Typescript, but you could also be [explicitly stated](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations)).
 * 
 * As described in the definiton of Block above (hover over it if you need a refresher), we turn the `exampleReporter` method into a method tied to a Block by "decorating" it with the `block` decorator function 
 * (the use of the `@` tell us that it is a [decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators)).
 * 
 * As mentioned above, the `block` function takes a single argument as input, which provides all the necessary information
 * for the Block Programming Environment to create a Block tied to our method.
 * 
 * In this case, all we need is the block type (`type`) and the display text of the block (`text`).
 */
type ExplanationOfReporterBlock = Documentation;

/** 
 * Below, we define a method `exampleCommand` and decorate it with the `@block` function (similiar to above). 
 * This is an example of a "command" block, as the underlying method takes 0 or more arguments, and returns nothing ([void](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)).
 * 
 * Hover over `exampleCommand` below to observe it's type signature and how it returns `void`.
 * 
 * **NOTE:** Here, instead of passing an object to the `@block` decorator function (as above), we pass another function to it.
 * This function must take a single parameter, which will be a reference to our specific Extension (hover over `self` if you don't believe me). 
 * As you can see in the definition of the `defaultValue` of our second argument, 
 * this allows us to pull values off of our extension when defining our block.
 */
type ExplanationOfCommandBlock = Documentation;

/**
 * We can either use the string to define our blockType, like above, 
 * or refernce a specific entry on the `BlockType` object, like below.
 * 
 * Make sure to hover over the `type` field to get more comprehensive documentation.
 */
type ExplanationOfBlockType = Documentation;

/**
 * Because the underlying `exampleCommand` method takes arguments, 
 * our `text` field must implement a function which accepts the same arguments as the method
 * (instead of just providing a `string` as is done above).
 * 
 * In the implementation of this function, we should create a [Template String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that references our arguments,
 * which will auto-magically cause the resulting Blocks to have input fields at the positions of the templated arguments.
 * 
 * Make sure to hover over the `text` field to get more comprehensive documentation.
 */
type ExplanationOfBlockTextFunction = Documentation;

/**
 * Because our method accepts 2 arguments, we must define an `args` field 
 * (necessary whenever your Block's method accepts 2 or more arguments).
 * 
 * This will accept an array of _Arguments_ that correspond to the types of the method's arguments. 
 * 
 * As you can see below, how you define _Arguments_ can vary, so make sure to hover over the `args` field to get more comprehensive documentation 
 * and leverage the examples to understand the different forms in which you can define _Arguments_.
 */
type ExplanationOfBlockArgs = Documentation;

/**
 * Below is an example of yet another type of Block, in this case a "Hat", which is used to determine if a stack of connected Blocks should execute or not. 
 * 
 * Accordingly, this block must return a [boolean](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean) (a true / false value).
 * 
 * The best way to understand what a Hat Block does (and really all blocks) is to [start a development](https://github.com/mitmedialab/prg-extension-boilerplate#-running-an-extension) and server and play with them yourself.
 */
type ExplanationOfHatBlock = Documentation;

/**
 * Because our block method only takes one argument (besides the BlockUtility, explained below), 
 * we provide an `arg` field instead of `args` like we did above. 
 * 
 * The `arg` field accepts only a single _Argument_ value corresponding to the specific type of our method's argument. 
 * 
 * As was the case for the `args` field above, 
 * it is necessary to hover over the `arg` field to understand the different forms in which you can define an _Argument_.
 */
type ExplanationOfBlockArg = Documentation;

/**
 * You should notice that the final argument of our method is of type `BlockUtility`. 
 * 
 * For every Block method, you can optionally add a final parameter of type `BlockUtility`
 * which can be used to accomplish more [advanced behaviours](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#making-use-of-the-block-utility). 
 * No need to worry too much about when you're first starting out, though!
 * 
 * As is the case here, note that the inclusion of a `BlockUtility` argument does not "count" 
 * as an Argument for your Block. 
 * 
 * Thus, if your method **_only_** accepts a `BlockUtility` argument, then the `block` function will **not**
 * require (or allow) you to define an `arg` nor `args` field -- similiar to the `exampleReporter` method / Block above.
 */
type ExplanationOfBlockUtility = Documentation;