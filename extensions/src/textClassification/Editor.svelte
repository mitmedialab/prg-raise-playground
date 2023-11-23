<script lang="ts">
  import { onDestroy } from "svelte";
  import type Extension from ".";
  import { ReactiveInvoke, color, reactiveInvoke } from "$common";
  import Class from "./components/Class.svelte";
  import PrimaryButton from "$common/components/PrimaryButton.svelte";

  export let extension: Extension;
  export let close: () => void;

  export const onClose = () => {
    console.log("closed!");
  };

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  let activeIndex = 0;

  const getNextLabel = () => {
    let label: string;
    let count = extension.labels.length + 1;
    do {
      label = `Class ${count++}`;
    } while (extension.labels.includes(label));
    return label;
  };

  const add = () => {
    invoke("addLabel", getNextLabel());
    activeIndex = extension.labels.length - 1;
  };

  const drop = () => {
    invoke("deleteLabel", extension.labels[activeIndex], activeIndex);
    activeIndex = -1;
  };

  onDestroy(() => extension.buildCustomDeepModel());
</script>

<div class="container">
  <div class="pane" style:background-color={color.ui.secondary}>
    {#each extension.labels as label, index}
      {@const examples = extension.modelData.get(label)}
      {#if examples}
        <Class
          {label}
          {examples}
          setActive={() => (activeIndex = index)}
          isActive={activeIndex === index}
          deactivate={() => (activeIndex = -1)}
          deleteSelf={drop}
          rename={(newLabel) => invoke("renameLabel", label, newLabel, index)}
        />
      {/if}
    {/each}
  </div>
  <div class="footer">
    <PrimaryButton on:click={add}>Add a Label</PrimaryButton>
    <PrimaryButton on:click={() => invoke("clearLabels")}
      >Clear All
    </PrimaryButton>
    <PrimaryButton on:click={close}>Done</PrimaryButton>
  </div>
</div>

<style>
  .container {
    text-align: center;
    width: 600px;
    background-color: white;
  }

  .pane {
    height: 300px;
    text-align: left;
    overflow-y: scroll;
  }

  .footer {
    padding: 1rem 0;
  }
</style>
