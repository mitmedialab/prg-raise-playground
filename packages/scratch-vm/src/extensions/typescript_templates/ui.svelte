<script lang="ts">
  import type Extension from ".";
  import { invokeFromUI, type InvokeFromUI } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => {
    extension = extension; // svelte magic to force a re-render: https://svelte.dev/tutorial/updating-arrays-and-objects
    return invokeFromUI(extension, funcName, args);
  }
</script>

<style>
</style>

<div>
  Hello world!
</div>