<script lang="ts">
  import Extension, { soundFiles } from ".";
  import {
    ReactiveInvoke,
    reactiveInvoke,
    ParameterOf,
    ArgumentEntry,
    ArgumentEntrySetter,
  } from "$common";
  import { onMount } from "svelte";

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first generic argumen is a reference to your extension.
   * The second generic argumen is the name of the block function this argument belongs to.
   * The third generic argumen is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, "uploadSoundFile", 0>;

  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  // svelte-ignore unused-export-let
  export let extension: Extension;
  let value = current.value;
  $: text = "";
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  $: setter({ value, text });
  onMount(() => {
    document
      .getElementById("fileInput")
      ?.addEventListener("change", async (event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const blobUrl = URL.createObjectURL(file);
          value = file.name + "---name---" + blobUrl;
          text = file.name;
        }
      });
  });
</script>

<input type="file" id="fileInput" />

<style>
</style>
