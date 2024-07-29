
type Documentation = "See documentation below:";

/**
 * Nice job! You hovered over a JSDoc type to see more information about it.
 */
type ExplanationOfSomething = Documentation;

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
 *    - This requires you to [decorate](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators) your method with a `scratch` function, 
 * which we do by putting an '@' symbol in front of `scratch` and invoking either `scratch.command`, `scratch.reporter`, `scratch.button`, or `scratch.hat`.
 *    - Using a template literal, the `scratch` function provides all the information 
 * the Block Programming Environment will need, like:
 *      - type: What type of block is it / how should it be used?
 *      - text: What text is displayed on the block? 
 *      - args: How should the method's arguments map to input fields on the block? 
 *        - See [Scratch's documentation](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md#block-arguments) to get a sense of how your method's argument types map to the input fields the Block Programming Environment supports
 * 
 * @example
 * **NOTE:** Ignore the `.` in front of the `@` symbol -- this is just so JSDoc doesn't mess with the formatting.
 * ```ts
 * .@(scratch.command`This is the text that will display on the block`)
 * exampleMethod() {
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
 * (see the class defintion below to see how we [extend]() the base class returned by the `extension` function). 
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
 * Below, we define a method `exampleCommand` and decorate it with the `@scratch.command` function (similiar to above). 
 * This is an example of a "command" block, as the underlying method takes 0 or more arguments, and returns nothing ([void](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)).
 * 
 * Hover over `exampleCommand` below to observe it's type signature and how it returns `void`.
 * 
 */
type ExplanationOfExampleCommand = Documentation;

/**
 * TODO
 * 
 * **NOTE:** Here, instead of using a tagged template literal (as above), we pass another function to the `scratch` decorator.
 * This function takes two parameters, the first of which is a reference to our specific Extension. 
 * As you can see in the definition of the `defaultValue` of our second argument, 
 * this allows us to pull values off of our extension when defining our block.
 * The second argument references the tagged template literal we use to create the text and arguments of the block.
 */
type ExplanationOfCommandWithExtendDefinition = Documentation;

/**
 * Below is an example of how you define a "Reporter" Block in Scratch, which is a Block that takes 0 or more arguments and returns a value (likely a `string` or `number`).
 * 
 * The definition has two different parts:
 * - **The method (line 48):** The [method]() `exampleReporter` is the function that runs when the associated Scratch Block is executed.
 *      -  * Hover over `exampleReporter` below to observe it's type signature and that it returns a `number` 
 * (which is _inferred_ by Typescript, but you could also be [explicitly stated](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations)).
 * - **The decorator (line 47):** The `@(scratch.reporter...)` bit above the `exampleReporter` definition is a [decorator](https://www.typescriptlang.org/docs/handbook/decorators.html) for that method (specifically, the `@` symbol is what denotes that it is a decorator).
 *      - This "decorator" is what allows you to associate your extension's method with a Scratch Block, as well as configure how that Block will look and behave.
 * 
 * The `scratch.reporter` decorator function is a [Tagged Template Literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
 * which is why you see the "\`" backtick marks around some text after it. This text is actually the text that will be displayed on the associated Scratch Block. 
 * 
 * Tagged template literals will be used in a more interesting way below (see `ExplanationOfReporterWithArguments`), but for now you can just think of them as a function that takes a string argument, which would normally be invoked like this:
 * `myTemplateFunction("some text");`, but is instead invoked like this ```myTemplateFunction`some text`;```.
 */
type ExplanationOfExampleReporter = Documentation;

/**
 * Please read the documentation for `ExplanationOfExampleReporter` if you haven't.
 * 
 * The below method and its `scratch.reporter` decorator are very similar to the `exampleReporter` method above, 
 * however `reporterThatTakesTwoArguments` is a method that takes two arguments.
 * 
 * You can see this in the method signature of `reporterThatTakesTwoArguments` on line 54 -- it takes a `string` and a `number` as arguments.
 * 
 * TODO not finished...
 */
type ExplanationOfReporterWithArguments = Documentation;

/**
 * Below is an example of yet another type of Block, in this case a "Hat", which is used to determine if a stack of connected Blocks should execute or not. 
 * 
 * Accordingly, this block must return a [boolean](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean) (a true / false value).
 * 
 * The best way to understand what a Hat Block does (and really all blocks) is to [start a development](https://github.com/mitmedialab/prg-extension-boilerplate#-running-an-extension) and server and play with them yourself.
 * 
 * You should notice that the final argument of our method is of type `BlockUtilityWithID`. 
 * 
 * For every Block method, you can optionally add a final parameter of type `BlockUtilityWithID`
 * which can be used to accomplish more [advanced behaviours](https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#making-use-of-the-block-utility). 
 * No need to worry too much about this when you're first starting out, though!
 * 
 * As is the case here, note that the inclusion of a `BlockUtilityWithID` argument does not "count" 
 * as an Argument for your Block. 
 * 
 * Thus, if your method **_only_** accepts a `BlockUtilityWithID` argument, then the `block` function will **not**
 * require (or allow) you to add a placeholder in the template literal -- similiar to the `exampleReporter` method / Block above.
 */
type ExplanationOfExampleHatAndBlockUtility = Documentation;