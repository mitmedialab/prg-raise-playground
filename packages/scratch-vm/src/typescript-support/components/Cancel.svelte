<script lang="ts">
  import { color } from "../ui";

  const black = color.ui.blackTransparent;
</script>

<style>
  button {
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    border-width: 1px;
    border-style: solid;
    font-weight: 600;
    font-size: 0.85rem;
  }

</style>

<button on:click style:border-color={black} style:background-color={black} style:color="black">
  Cancel
</button>