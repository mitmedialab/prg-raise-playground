<script lang="ts">
  import Extension from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter, ReplaceWithBlockFunctionName, color} from "$common";

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first parameter is a reference to your extension.
   * The second parameter is the name of the block function this argument belongs to.
   * The third parameter is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, ReplaceWithBlockFunctionName, 0>; 
  
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
   * It should be treated as 'readonly', meaning you should only pull information FROM your extension to populate this UI.
   * You should NOT use this UI to modify the extension, as that would both confuse the user and anyone developing the extension.
   * 
   * If you need a UI to control the extension, instead use the Modal-style UI.
   * @see https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#creating-ui-for-extensions
   */
  // svelte-ignore unused-export-let

  const _colors = {
    "off": {x: 0, y:0, z:0},
    "red": {x: 255, y:0, z:0},
    //"orange": {x:255, y:69, z:0},
    "yellow": {x:255, y:69, z:0},
    "green": {x:0, y:167, z:0},
    "cyan": {x:0, y:167, z:48},
    "blue": {x:0, y:0, z:255},
    "magenta": {x:255, y:0, z:163},
    //"pink": {x:255, y:20, z:147},
    "white": {x:255, y:255, z:255},
  }

  export let extension: Extension;

  let value = current.value;

  $: setter({ value, text: value });
</script>

<style>
  .colorButton {
    border-radius: 32px;
    height: 64px;
    width: 64px;
  }
  .color {
    background-color: var(--color);
  }

  /* (A) 3 COLUMNS PER ROW */
  #grid {
    display: grid;
    grid-template-columns: auto auto auto; 
    grid-gap: 10px;
  }
  /* (B) 1 COL ON SMALL SCREENS */
  @media screen and (max-width:768px) {
    #grid { grid-template-columns: auto; }
  }
  /* (C) OPTIONAL FOR THE CELLS */
  /* .head {
    font-weight: bold;
    border: 1px solid;
    border-radius: 2px;
  } */
  .cell {
    border: 1px solid;
    border-radius: 2px;
  }
</style>

<div id="grid">
  {#each Object.keys(_colors) as clr}
    <button 
      class="colorButton color" 
      disabled={value==clr}
      style="--color: {clr}"
      on:click={ () => value = clr }
      >
      {clr}
    </button>
  {/each}
</div>