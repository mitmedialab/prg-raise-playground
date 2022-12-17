// /Users/parkermalachowsky/MIT/prg-extension-boilerplate/extensions/src/typescript_framework_simple/Palette.svelte
<script lang="ts">
  import type Extension from ".";
  import { activeClass, color as uiColors } from "$common";

  export let extension: any;
  export let close: () => void;

  const colors: {name: string, color: string}[] = Object.entries(uiColors).map(([key, innerColors]) => {
    return Object.entries(innerColors).map(([innerKey, color]) => ({name: `color.${key}.${innerKey}`, color}));
  }).flat();

  const container = activeClass;
</script>

<style>
  .container {
    text-align: center;
  }
</style>

<div class:container>
  {#each colors as color}
  <div style:background-color={color.color}>
    {color.name}
  </div>
  {/each}
</div>