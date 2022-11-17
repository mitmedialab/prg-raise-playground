<script lang="ts">
  import type Extension from ".";
  import { activeClass, color as uiColors } from "../../typescript-support/ui";

  export let extension: Extension;
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