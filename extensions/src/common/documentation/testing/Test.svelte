<script lang="ts">
  import type Extension from ".";

  // svelte-ignore unused-export-let
  export let extension: any;
  // svelte-ignore unused-export-let
  export let close: () => void;
</script>

<button data-testid="mySpecialButton"></button>