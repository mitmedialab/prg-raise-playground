<script lang="ts">
  import type Extension from ".";
  import { invokeFromUI, white, type InvokeFromUI } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => {
    extension = extension; // svelte magic to force a re-render: https://svelte.dev/tutorial/updating-arrays-and-objects
    return invokeFromUI(extension, funcName, args);
  }

  const container = true;
</script>

<style>
  .container {
    width: 360px;
    padding: 30px;
    padding: 1.5rem 2.25rem;
  }
</style>

<div class:container style:background-color={white}>
  Hello, World!
</div>