<script lang="ts">
  import type Extension from "./index.v2";
  import { activeClass, color as uiColors } from "$common/index";

  // svelte-ignore unused-export-let
  export let extension: any;
  // svelte-ignore unused-export-let
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