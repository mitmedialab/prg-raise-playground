<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke } from "$common";
  import Class from "./components/Class.svelte";

  export let extension: Extension;
  export let close: () => void;
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  let activeIndex = 0;
</script>

{#each extension.labels as label, index}
  <Class
    {label}
    setActive={() => (activeIndex = index)}
    isActive={activeIndex === index}
    examples={extension.modelData.get(label)}
  />
{/each}

<button
  on:click={() => invoke("addLabel", `Class ${extension.labels.length + 1}`)}
>
  Add Label</button
>
<button>Clear all</button>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>
