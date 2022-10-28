<script lang="ts">
  import { Extension } from "../../typescript-support/Extension";
  import Something from "./something.svelte";

  export let currentExtension: Extension<any, any>;
  export let name: string;
</script>

<!-- CODE GEN GUARD -->

{#if name === "something"}
  <Something extension={currentExtension}/>
{/if}

<!-- CODE GEN GUARD -->