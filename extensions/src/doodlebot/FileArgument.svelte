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
          // Set the file name to the text input and the full value
          document.getElementById("textInput").value = file.name;
          value = file.name + "---name---" + blobUrl;
          text = file.name;
        }
      });

    // Handle text input change
    document.getElementById("textInput")?.addEventListener("input", (event) => {
      const input = event.target as HTMLInputElement;
      // Update the value with the current text input value and maintain the blob URL
      const blobUrl = document.querySelector("#fileInput").files[0]
        ? URL.createObjectURL(document.querySelector("#fileInput").files[0])
        : "";
      value = input.value + "---name---" + blobUrl;
      text = input.value;
    });
  });
</script>

<div class="container">
  <input type="file" id="fileInput" />
  <input type="text" id="textInput" />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column; /* Arrange children vertically */
    gap: 10px; /* Space between inputs */
    max-width: 300px; /* Set a maximum width if desired */
    margin: 20px; /* Margin around the container */
  }

  input {
    padding: 8px; /* Add padding for better appearance */
    font-size: 16px; /* Increase font size for better readability */
    border: 1px solid #ccc; /* Light border */
    border-radius: 4px; /* Rounded corners */
  }

  input[type="file"] {
    border: 2px dashed #007bff; /* Dashed border for file input */
  }

  input[type="text"] {
    border: 2px solid #007bff; /* Solid border for text input */
  }
</style>
