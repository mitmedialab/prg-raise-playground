<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke,  } from "$common";

  // svelte-ignore unused-export-let
  export let extension: Extension;

  // svelte-ignore unused-export-let
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);

</script>

<style>

</style>

<div>
  {#if extension.toDisplay}
    <img src={extension.toDisplay.url} alt={extension.toDisplay.alt}>
  {:else}
    No source!
  {/if}
</div>