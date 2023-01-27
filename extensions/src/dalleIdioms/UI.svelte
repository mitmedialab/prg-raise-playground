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
  div {
    height: 600px;
    overflow: scroll;
  }
</style>

<div>
  {#if extension.toDisplay}
    {#each extension.toDisplay as {url, alt}}
      <img src={url} alt={alt}>
    {/each}
  {:else}
    No source!
  {/if}
</div>