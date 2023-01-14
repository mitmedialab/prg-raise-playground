<script lang="ts">
  import { activeClass, px, color } from "$common";
  import { ArgumentEntry, ArgumentEntrySetter } from "$common/customArguments/CustomArgumentManager";
  
  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry;

  const container = activeClass;

  let name = current.text;

  $: setter({ text: name, value: name.length });
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:width={px(360)} style:background-color={color.ui.white} style:color={color.text.primary}>
  <input bind:value={name}>
</div>