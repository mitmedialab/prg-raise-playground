<script lang="ts">
  import { color } from "../ui";
  export let disabled: boolean;

  const text = color.ui.white;
  const solid = color.motion.primary;
</script>

<style>
  button:disabled {
    background: var(--drop-highlight);
    border: var(--drop-highlight);
  }

  button {
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    border-width: 1px;
    border-style: solid;
    font-weight: 600;
    font-size: 0.85rem;
    transition: background-color 0.25s, border-color 0.25s;
  }
</style>

<button on:click {disabled} style:border-color={solid} style:background-color={solid} style:color={text} data-testid="ok">
  OK
</button>