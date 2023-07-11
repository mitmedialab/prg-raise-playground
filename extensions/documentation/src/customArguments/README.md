## Adding Custom Arguments

The Extension Framework allows us to do a lot of cool stuff that would be tricky or impossible to do if we were using the [default Scratch Extension workflow]().

One of the coolest is the ability to define custom arguments, which means both:
- Introducing an arbitrary new type of argument 
  - It could be an alias for a `number` the same way the built-in `Angle` argument is. Or it could be something new entirely, like an object with some specific keys, or an array of a certain length -- whatever you want!
- Defining the UI the allows a user to set / interact with that argument type
  - Imagine being able to create argument-specifc UI like is done for the built-in `Note`, `Angle`, `Color`, and `Matrix` arguments 

Here's how:

### Create a New UI Component

For a quick breakdown of how we handle UI generally in the Extension Framework, head over to [Creating UI for Extensions](#creating-ui-for-extensions) -- take note of resolving [Svelte]((https://github.com/mitmedialab/prg-extension-boilerplate#svelte-only-if-you-are-developing-ui)) dependencies if you haven't already.

Then run the following command:

```bash
npm run add:arg <extension directory>
# For example: npm run add:arg myExtension
```

This will create a new `.svelte` file for you within your extension's directory pre-configured to handle custom arguments. However, there's still some more you need to do before you can visualize and modify custom arguments.

> NOTE: The generated file will be given a default name. Consider changing it to be more expressive of your custom argument type. For the below explanations, assume we changed the name to `MyArgUI.svelte`.

### Specifying a Custom Argument within a Block's Definition

Assume we have the following extension:

[](./extension.ts?export=x)

When invoking the `@block` decorator function on our method that uses a custom argument, we can define the `arg` field like so:

[](./index.ts?export=x)

### Implementing the UI

Then, we modify the UI (Svelte) component we created earlier to match our block function argument, like so:

[](./CustomArgument.svelte)
