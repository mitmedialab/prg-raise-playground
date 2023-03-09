<script lang="ts">
  import Extension from ".";
  import { activeClass,color } from "$common";
  import Snippet from "./Snippet.svelte";

  // svelte-ignore unused-export-let
  export let extension: Extension;
  // svelte-ignore unused-export-let
  export let close: () => void;

  const container = activeClass;
</script>

<style>
.container {
  padding: 30px;
  height: 80vh;
  width: 80vw;
  overflow: scroll;
}
</style>

<div class:container style:background-color={color.ui.white} style:color={color.text.primary}>
  <Snippet code={JSON.stringify(extension.currentInfo ?? "ERROR: No info", null, 4)} />
</div>
