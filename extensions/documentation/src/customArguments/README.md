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

### (Advanced) Architecture

If you're solely interested in adding custom arguments to your extension's blocks, you can skip the following section -- all you need is the above sections. 

This section documents / diagrams how the code all works together to enable this functionality.  

To add custom arguments, we unfortunately need to make modifications to each package involved in the RAISE playground (i.e. `extensions`, `packages/scratch-vm`, and `packages/scratch-gui`). 

At the heart of this implementation is co-opting the usage of block argument's (dynamic) menus to render a custom UI (instead of the usual list of menu options).

This works (at a high level) by recognizing the following few things:
- Block argument menu dropdown's are controlled by Blockly's [FieldDropdown](https://developers.google.com/blockly/reference/js/blockly.fielddropdown_class) class.
- A specific `FieldDropdown` class, tied to a specific block argument's **_dynamic_** menu, will invoke the method that populates that menu's options at various points during the _lifecycle_ of the field drodpwon
  - NOTE: The method that populates the menu's options are implemented by you in the 
  - By _lifecycle_ I mean the different points of interaction with the dynamic me

We do this by overriding a few key functions on Blockly's [FieldDropdown](https://developers.google.com/blockly/reference/js/blockly.fielddropdown_class) class. 

These changes are implemented in [packages/scratch-gui/src/lib/prg/customBlockOverrides.js]().