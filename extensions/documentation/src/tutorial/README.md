[](order=1)
## Programming Tutorial

**_(Work in progress)_**

Below is our starter piece of code, where we import the following items from the `$common` package:
- `extension`: A factory function that returns a base class that our extension should [extend](https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses). This function allows for you to configure the capability of your Extension (as you'll see [later](#configuring-your-extensions-functionality)).
- `scratch`: An object with two [method decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#:~:text=Method%20Decorators,or%20replace%20a%20method%20definition.) functions -- `scratch.reporter`, `scratch.command`, `scratch.hat`, and `scratch.button` -- that will be [used below](#decorating-our-method-with-block) to mark our class method as something that should be turned into either a Reporter or Command Block. The [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) argument provided to the `scratch` functions contains all the information necessary to create a Block representation of our method in the Block Programming Environment.
- `ExtensionMenuDisplayDetails`: A type imported to add typesafety to how we define the `details` object which we use when configuring our Extension's base class through the `extension` function. As the name suggests, the contents of this object determine how our Extension displays to the user, especially through the [Extensions Menu](https://en.scratch-wiki.info/wiki/Library#Extensions_Library).
- `Environment`: A type imported to add typesafety to the argument of the `init` function (which all Extensions are required to implement -- it is used in place of a [constructor](https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors))

[](./index.ts?export=base)

As you can see, we use the above imports to ultimately define a new [class](https://www.typescriptlang.org/docs/handbook/2/classes.html), which _is_ our Extension.


> **NOTE**: As you become more comfortable with the usage of the `extension` function, you can opt to use it's returned value (an [abstract class](https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members)) directly in the declaration of your extension, like so:
[](./index.ts?export=alternative)

### Populating `details`

As noted above, the `details` object passed to the `extension` function determines how our Extension displays to the user. We can add [key / value pairs](https://www.freecodecamp.org/news/javascript-object-keys-tutorial-how-to-use-a-js-key-value-pair/) to this object to ensure the purpose of our extension is clear and exciting to the user.

[](./index.ts?export=updateDetails)

### Defining a method

Next, let's define a [method](https://www.typescriptlang.org/docs/handbook/2/classes.html#methods), which is how we make our class actually do something.

[](./index.ts?export=method)

### Decorating our method with `scratch`

In order for this method to become a Block in the Block Programming Environment, we need to mark it (or [decorate](https://www.typescriptlang.org/docs/handbook/decorators.html#:~:text=Method%20Decorators,or%20replace%20a%20method%20definition.) it) with the `scratch` functions (for example, `scratch.reporter`). 

[](./index.ts?export=blockify)

> **NOTE:** We preceed in the invocation of `scratch` with an `@` symbol which signifies the `scratch` function is [decorating](https://www.typescriptlang.org/docs/handbook/decorators.html#introduction) our method.

The template literal that the `scratch` decorator takes provides all the information the Block Programming Environment needs in order to create a Block tied to your method (i.g. the block's type, text, and args). 

#### Need to access properties of your Extension when define a Block?
<details>
<summary>
Open this
</summary>

If you need to access some information on your extension when invoking `scratch` decorators, you can do so by passing a function (instead of an object) as an argument. 

This function will accept two arguments: the first is a reference to your Extension, and the second is a tagged template literal you can use to define your block, just like the previous `scratch` functions. You can then pull values off of the Extension reference (like `defaultValue` below) in the placeholders of the template literal. 

[](./index.ts?export=functionArg)

</details>

### Configuring your Extension's functionality

You can incorporate new functionality into your Extension by enhancing the base class returned by `extension`.

You do this by providing "add ons" as arguments, which come after the first `details` argument. 

[](./index.ts?export=ui)

Your code editor will help you see which "add ons" are available -- simply start to try to type after the first argument of the `extension` function, and suggestions (and documentation) will pop up.

![Gif of extension addOns being suggested](//.assets/addOns.gif)

### Putting it all together

[](./complete.ts)