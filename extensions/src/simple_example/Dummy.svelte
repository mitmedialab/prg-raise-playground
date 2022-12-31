<script lang="ts">
  import type Extension from ".";
  import { activeClass, px, color } from "$common";

  // svelte-ignore unused-export-let
  export let extension: any;
  // svelte-ignore unused-export-let
  export let close: () => void;

  const container = activeClass;
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:width={px(360)} style:background-color={color.ui.white} style:color={color.text.primary}>
  Hello, world!
</div>