<script lang="ts">
  import Extension from ".";
  import {
    ParameterOf,
    ArgumentEntry,
    ArgumentEntrySetter,
    ReplaceWithBlockFunctionName,
  } from "$common";

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first generic argumen is a reference to your extension.
   * The second generic argumen is the name of the block function this argument belongs to.
   * The third generic argumen is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, ReplaceWithBlockFunctionName, 0>;

  /**
   * This function can be used to set the value of your custom argument.
   */
  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  /**
   * This is the current value of the custom argument at the time of opening this UI.
   * Changing this value will have no effect -- instead use the `setter` function.
   */
  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  /**
   * This is a reference to your extension.
   * It should be treated as 'readonly', meaning you should only pull information FROM your extension to populate this UI.
   * You should NOT use this UI to modify the extension, as that would both confuse the user and anyone developing the extension.
   *
   * If you need a UI to control the extension, instead use the Modal-style UI.
   * @see https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#creating-ui-for-extensions
   */
  // svelte-ignore unused-export-let
  export let extension: Extension;

  let value = current.value;

  $: setter({
    value,
    text: "This should be a string representation of the value",
  });
</script>

<div>
  <input bind:value />
</div>

<style>
</style>
