<script lang="ts">
  import Extension, { soundFiles } from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first generic argumen is a reference to your extension.
   * The second generic argumen is the name of the block function this argument belongs to.
   * The third generic argumen is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, "playSoundFile", 0>;

  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  // svelte-ignore unused-export-let
  export let extension: Extension;
  let value = current.value;
  $: text = value;

  $: setter({ value, text });
</script>

<div>
  {#each soundFiles as f}
    {#if value == f}
      <div
        class="goog-menuitem goog-option goog-option-selected"
        role="menuitemcheckbox"
        aria-checked="true"
        id=":b"
        style="user-select: none;"
      >
        <div class="goog-menuitem-content" style="user-select: none;">
          <div class="goog-menuitem-checkbox" style="user-select: none;"></div>
          <button
            on:click={() => {
              value = f;
            }}
          >
            {f}
          </button>
        </div>
      </div>
    {/if}
    {#if value != f}
      <div
        class="goog-menuitem goog-option goog-option-selected"
        role="menuitemcheckbox"
        aria-checked="true"
        id=":b"
        style="user-select: none;"
      >
        <div class="goog-menuitem-content" style="user-select: none;">
          <button
            on:click={() => {
              value = f;
            }}
          >
            {f}
          </button>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  button {
    background-color: rgb(19, 236, 175);
    border-color: rgb(11, 142, 105);
    border: none;
    font:
      normal 13px "Helvetica Neue",
      Helvetica,
      sans-serif;
    color: #000000;
    font-weight: bold;
  }
</style>
