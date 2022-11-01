<script lang="ts">
  export let disabled: boolean;
</script>

<style>
  button:disabled {
    background: var(--drop-highlight);
    border: var(--drop-highlight);
  }

  button {
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    border: 1px solid var(--ui-black-transparent);
    font-weight: 600;
    font-size: 0.85rem;
    background: var(--motion-primary);
    border: var(--motion-primary);
    color: white;
    transition: background-color 0.25s, border-color 0.25s;
  }
</style>

<button on:click {disabled}>
  OK
</button>