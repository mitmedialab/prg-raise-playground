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

If you're solely interested in adding custom arguments to your extension's blocks, you can skip the following section -- all you need is the above information. 

<details>
<summary>
You can open this section to learn how the code all works together to enable this functionality.  
</summary>

To add custom arguments, we unfortunately need to make modifications to multiple packages involved in the RAISE playground (`packages/scratch-gui` in addition to `extensions`).

> This is _unfortunate_ as we aim to keep the Scratch-based packages as similiar to their original sources as possible. This way we can more easily incorporate changes and improvements released by the Scratch team. Thus, even though we are modifying scratch packages, we try keep our changes as small and surgical as possible.

One aspect that makes implementing this functionality tricky is that the UI of blocks is controlled by [scratch-blocks](https://github.com/scratchfoundation/scratch-blocks), which is a package not included in our repository<sup>1</sup>, so making modifications to it (perhaps at runtime) would be very difficult to maintain. Therefore, we opt for a solution that requires no changes to `scratch-blocks`.

><sup>1</sup> `scratch-blocks` used to be included in this repo and linked using [lerna](https://lerna.js.org/), however we had no local changes to it and thus it made more sense to rely on the [npm package](https://www.npmjs.com/package/scratch-blocks) instead. Re-adding the package to accomplish this functionality was considered, but ultimately deemed undesirable as we want to avoid modifications to Scratch sources (see above) and it appeared very difficult to create argument UI in `scratch-blocks, especially for abitrary data types.

At the heart of this implementation is co-opting the usage of block argument's dynamic menus. When an argument with a menu is clicked on, it will render the list of menu options to a dropdown. When that argument's menu is **_dynamic_**, it will receive the list of options to display by invoking a function. 

> In the extension framework, an argument with a dynamic menu looks like:
>```ts
>arg: {
>  type: "number",
>  options: () => ["option A", "option B"] // for example
>}
>```

This is the perfect setup for our solution, as:
- The dropdown that is opened on a menu click offers a perfect surface for rendering a custom argument UI to
- The invocation of a dynamic menu's function enables us to know when a dropdown is opened, and thus when we should render the custom argument's UI

So at a high-level, this is how our implementation works:
- Custom arguments are implemented "under the hood" as arguments with a dynamic menu
- When a developer specifies a custom argument, they provide a svelte component that will be used as the custom argument's UI
- The extension framework takes care of providing the `options` function for the internal dynamic menu of the argument, which is responsible for rendering the custom argument's UI to the menu's dropdown when it is clicked on by the user

To get a little more into the details...

Block argument menu dropdown's are controlled by Blockly's [FieldDropdown](https://developers.google.com/blockly/reference/js/blockly.fielddropdown_class) class. A specific `FieldDropdown` class, tied to a specific block argument's **_dynamic_** menu, will invoke the menu's `options` function at various points during the _lifecycle_ of the field dropdown (like when it is initialized and when it is opened by the user).

Therefore, we override a few key functions on Blockly's [FieldDropdown](https://developers.google.com/blockly/reference/js/blockly.fielddropdown_class) class (implemented in [packages/scratch-gui/src/lib/prg/customBlockOverrides.js]()) in order to collect the information about the dropdown before the dynamic `options` function is invoked. We can then use this information inside of our `options` function, while all other menus will be unnaffected.

> Overriding this functionality does ahead overhead to every single dropdown menu, but this _cost_ should be negligible. 

From there, the extension framework handles the rest:
- The `"customArguments"` add-on handles setting up the dynamic `options` function that maps custom argument inputs from the user to menu options that Scratch can handle (as well as rendering the custom argument UI when the dropdown is first opened)
- Before arguments are passed to their corresponding block methods, the framework checks to see if the value is a custom argument idenitifier, and if so the appropriate _value_ is retrieved and passed to the method instead
</details>

