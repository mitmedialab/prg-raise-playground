const x = "See documentation below:";
type Documentation = typeof x;

/**
 * These are the argument types you're block method can accept 'out of the box'. 
 * 
 * If none of these suit your needs (and you're adventureous), you can ask someone about **_Custom Arguments_**...
 */
// string | number | boolean | RGBObject | boolean[][]

/**
 * These are most common types of values returned by block methods. 
 * The Block Programming environment has built-in support for display these kinds of returned values to the user.
 * 
 * If you wanted to return something more complex (like an object), speak with one of this project's maintainers. 
 */
// string | number | boolean

/**
 * The below object describes how your extension will display in the extensions menu. 
 * 
 * These details will be passed as the first argument to the `extension` function below
 * (see the class defintion below to see how we 'extend' the value returned by the `extension` function). 
 * 
 * Hover over any of the fields below (e.g. `name`, `description`) to see documentation about what it is/does. 
 */
type ExplanationOfDetails = Documentation;

/**
 * The below class is responsible for implementing your extension. 
 * 
 * You can (pretty much) think of this class **_as_** your extension.
 * 
 * You'll first notice that this class `extends` (or 'inherits') from the base class returned by the `extension` function.
 * 
 * Mouse over the `extension` function to get a more in-depth explanation of how it returns a base class 
 * (configured to your liking) for your class to extend / inherit from.
 * 
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses 
 * 
 * Next, as you'll see below, your Extension class defines Blocks in the following manner:
 * 
 * 1. Define a method on your class, which will be the functionality of your Block. 
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#methods
 * It can accept arguments of the following types:
 * @see {@link AcceptableArgumentTypes} <-- Mouse over 🐁
 * It can also return a value, if you want, which will most often be one the following types: 
 * @see {@link CommonReturnTypes} <-- Mouse over 🐁
 * 
 * 2. Once you have your method (what the Block does), you'll need to add some extra info to it,
 * so that the Block Programming Environment knows how to present it to the user. 
 * 
 * This requires you to "decorate" your method with the `block` function, 
 * which we do by putting an '@' symbol in front of `block` and invoking it.
 * 
 * The argument that the block function accepts provides all the information 
 * the Block Programming Environment will need, like:
 * - type: What type of block is it / how should it be used?
 * - text: What text appears on the block? 
 * - arg or args: How should the method's arguments map to input fields?
 */
type ExplanationOfClass = Documentation;

/**
 * As you'll see below, your Extension class defines Blocks in the following manner:
 * 
 * 1. Define a [method on your class](https://www.typescriptlang.org/docs/handbook/2/classes.html#methods), which will be the functionality of your Block. 
 * It can accept arguments of the following types:
 * @see {@link AcceptableArgumentTypes} <-- Mouse over 🐁
 * It can also return a value, if you want, which will most often be one the following types: 
 * @see {@link CommonReturnTypes} <-- Mouse over 🐁
 * 
 * 2. Once you have your method (what the Block does), you'll need to add some extra info to it,
 * so that the Block Programming Environment knows how to present it to the user. 
 * 
 * This requires you to "decorate" your method with the `block` function, 
 * which we do by putting an '@' symbol in front of `block` and invoking it.
 * 
 * The argument that the block function accepts provides all the information 
 * the Block Programming Environment will need, like:
 * - type: What type of block is it / how should it be used?
 * - text: What text appears on the block? 
 * - arg or args: How should the method's arguments map to input fields?
 */
type ExplanationOfBlocks = Documentation;

/**
 * @summary A field to demonstrate how Typescript Class fields work
 * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
 */
type ExplanationOfField = Documentation;

/**
 * @summary A field to demonstrate how Typescript Class fields work
 * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
 */
type ExplanationOfInitMethod = Documentation;

/** 
 * Below is an example of a 'Reporter' block, which is a block that takes 0 or more arguments
 * and returns a value (likely a `string` or `number`). 
 * 
 * We turn the `exampleReporter` method into a method tied to a Block by "decorating" the method with the `block` decorator function 
 * (the use of the '@' tell us that it is a decorator).
 * 
 * As mentioned above, the `block` function takes a single argument as input, which provides all the necessary information
 * for the Block Programming Environment to create a Block tied to our method. 
 */
type ExplanationOfReporterBlock = Documentation;

/** 
 * Below, we define a method `exampleCommand` and decorate it with the `@block` function (similiar to above). 
 * This is an example of a "command" block, as the underlying method takes 0 or more arguments, and returns nothing (void).
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
 * Because the underlying `exampleCommand` method takes arguments, our `text` field must implement a function, which accepts the same arguments. 
 * 
 * In the implementation of this function, we should create a [Template String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that references our arguments,
 * which will auto-magically cause the resulting Blocks to have input fields at the positions of the templated arguments.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
 * 
 * Make sure to hover over the `text` field to get more comprehensive documentation.
 */
type ExplanationOfBlockTextFunction = Documentation;

/**
 * Make sure to hover over the `args` field to get more comprehensive documentation.
 */
type ExplanationOfBlockArgs = Documentation;


type ExplanationOfHatBlock = Documentation;

type ExplanationOfBlockArg = Documentation;