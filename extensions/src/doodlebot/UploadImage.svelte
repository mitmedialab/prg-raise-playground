<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color, } from "$common";
    import { onMount } from "svelte";

  /**
   * @summary This is a reference to the instance of your extension. 
   * @description Use your extension to collect, display, and update information.
   * 
   * In this way, the UI acts as 'view' into your extension and its current state.
   * 
   * Your UI is also able to manipulate your extension's state through interacting with the public properties and functions of your extension
   * (NOTE: functions should not be invoked directly, but instead called through the `invoke` function below).
   */
  // svelte-ignore unused-export-let
  export let extension: Extension;

  /**
   * @summary Use this to close the modal / pop-up that contains this UI.
   * @description This is useful for things like if you have a 'cancel' or 'exit' button within this UI.
   * @example 
   * ```svelte
   * <button on:click={close}>Cancel</button>
   * ```
   */
  // svelte-ignore unused-export-let
  export let close: () => void;

  /**
   * @summary Use this to invoke functions on your extension.
   * @description Use this function instead of invoking functions on your extension directly,
   * as this ensures your UI will be refreshed after the function is called 
   * (in case any of your extension's properties have changed as a consequence of the function call,
   * which should therefore be updated in the UI).
   * @param functionName Name of the function to invoke
   * @param args Arguments of the specified funtion
   * @example
   * ```ts
   * // do this:
   * invoke("someFunction", 4, "argument 2");
   * // instead of this:
   * extension.someFunction(4, "argument 2");
   * ```
   */
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;
  let value = "";
  $: text = "";


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
    async function handleSubmit() {
      await extension.uploadFile("image", value);
      close();
    }
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
    width: 360px;
    background-color: var(--bg-color, white);
    color: var(--text-color, black);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: sans-serif;
  }

  h1 {
    margin-bottom: 0.3em;
  }

  h2 {
    margin-bottom: 1.5em;
    font-weight: normal;
    color: #666;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  input[type="file"],
  input[type="text"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  button {
    padding: 10px 16px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    background-color: #4a90e2;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button:hover {
    background-color: #357abd;
  }
</style>

<div
  class="container"
  style="--bg-color: {color.ui.white}; --text-color: {color.text.primary}"
>
  <h2>Upload an Image</h2>

  <div class="input-group">
    <input type="file" id="fileInput" />
    <input type="text" id="textInput" placeholder="File name..." />
  </div>

  <button type="button" on:click={handleSubmit}>Submit</button>
</div>