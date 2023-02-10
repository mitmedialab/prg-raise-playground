<script lang="ts">
  //import type Extension from ".";
  import { activeClass, px, color } from "$common/index";

  // svelte-ignore unused-export-let
  export let extension: any;
  // svelte-ignore unused-export-let
  export let close: () => void;

  const container = activeClass; 
  let value: number = 2;

</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }

  button {
    border-radius: 10px;
    border: 1px solid var(--motion-primary);
    background-color: var(--motion-primary);
    padding: 10px;
    font-size: 20px;
    margin-top: 10px;
  }
  button:hover {
    background-color: var(--motion-tertiary);
  }
</style>

<div class:container style:width={px(360)} style:background-color={color.ui.white} style:color={color.text.primary}>
  <h1>The count is {extension.count}</h1>
  <center>
    <button on:click={() => extension.count++}>Add 1</button>
    <br>
    <button on:click={() => extension.count += value}>Add</button>
    <input style:width={"50px"} style:font-size={"20px"} bind:value type="number">
    <br>
    <button on:click={() => extension.count = 0}>Reset</button>
  </center>
</div>