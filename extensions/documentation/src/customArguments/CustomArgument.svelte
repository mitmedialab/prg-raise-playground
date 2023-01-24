<script lang="ts">
  import Extension from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  /**
   * This type will hold onto the type of our custom argument,
   * and ensure this UI remains in sync with the block function argument it's associated with.
   * To do so, we make use of the 'ParameterOf' utility type.
   * The first parameter is our Extension.
   * The second parameter is the name of the block function this argument belongs to.
   * The third parameter is the index of the argument (since here we want the first argument, we use an index of 0)
   */
  type Value = ParameterOf<Extension, "blockWithCustomArgument", 0>; 
  
  /**
   * This function will be used to set the value of your custom argument.
   * NOTE: The argument won't actually be updated until the user clicks 'Apply' which will appear underneath this UI. 
   * If they close the UI without clicking 'Apply', the changes won't persist.
   * So in order for UI changes to take affect, you must call `setter(...)` and then the user must click apply.
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
  
  /**
   * Create variables to store the different parts of our argument's value
   */
  let {a, b, c} = current.value;
  
  /**
   * Use Svelte's reactivity to call the `setter` function whenever one of our inputs change
  */
  $: setter({ value: {a, b, c}, text: extension.convertArgToText({a, b, c}) });
</script>

<style>
</style>

<div>
  <input bind:value={a} type="number">
  <input bind:value={b} type="text">
  <input bind:checked={c} type="checkbox">
</div>