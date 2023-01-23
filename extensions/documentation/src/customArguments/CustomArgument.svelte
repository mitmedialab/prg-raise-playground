<script lang="ts">
  import Extension from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The second parameter is the name of the block function this arguemnt belongs to.
   * The third parameter is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, "blockWithCustomArgument", 0>; 
  
  /**
   * This function can be used to set the value of your custom argument.
   * NOTE: The argument won't actually be updated until the user clicks 'Apply' underneath the UI. 
   * If they close the UI without clicking 'Apply', the changes won't persist.
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
   * It should be treated as 'readonly', meaning you should only pull information FROM your extesnion to populate this UI.
   * You should NOT use this UI to modify by the extension, as that would both confuse the user and anyone developing this extension.
   * 
   * If you need a UI to control the extension, instead use the Modal-style UI.
   * @see https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#creating-ui-for-extensions
   */
  // svelte-ignore unused-export-let
  export let extension: Extension;
  
  /**
   * Create variables to store the different parts of our argument's value
   */
  let {a, b, c} = current.value;
  
  /**
   * Use Svelte's reactivity to call the `setter` function whenever one ouf inputs change
  */
  $: setter({ value: {a, b, c}, text: `[${a}, ${b}, ${c}]` });
</script>

<style>
</style>

<div>
  <input bind:value={a} type="number">
  <input bind:value={b} type="text">
  <input bind:value={c} type="checkbox">
</div>