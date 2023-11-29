<script lang="ts">
  import Extension, { emojiByAnimal, nameByAnimal } from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  type Value = ParameterOf<Extension, "addAnimalToCollection", 0>;

  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  // svelte-ignore unused-export-let
  export let extension: Extension;

  let value = current.value;
  $: text = nameByAnimal[value];

  $: setter({ value, text });
</script>

<div>
  {#each Object.keys(emojiByAnimal) as animal}
    <button on:click={() => (value = parseInt(animal))}>
      {emojiByAnimal[animal]}
    </button>
  {/each}
</div>

<style>
</style>
