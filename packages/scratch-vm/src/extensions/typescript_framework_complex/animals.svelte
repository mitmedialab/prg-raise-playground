<script lang="ts">
  import type Extension from ".";
  import { ReactiveSet, ReactiveInvoke, reactiveInvoke, reactiveSet, color, ReactivityDependency } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);
  const set: ReactiveSet<Extension> = (propertyName, value) => reactiveSet((extension = extension), propertyName, value);

  let animalMap: Map<string, number>;

  const setAnimalMap = (_: ReactivityDependency) => {
    animalMap = new Map();
    for (const animal of invoke("getAnimalCollectionEmojis")) {
      animalMap.set(animal, animalMap.has(animal) ? animalMap.get(animal) + 1 : 1);
    }
  }

  $: setAnimalMap(extension);
  
  const container = true;
</script>

<style>
  .container {
    width: 360px;
    padding: 10px;
  }
  button {
    border-radius: 10px;
    font-size: 40px;
  }
</style>

<div class:container style:background-color={color.ui.white}>
  <ul>
    {#each [...animalMap] as [animal, count]}
      <li>{count} {animal}{count > 1 ? "s" : ""}</li>
    {/each}
  </ul>
  <center>
    {#each extension.animals as animalMenuItem}
      <button on:click={() => invoke("addAnimalToCollection", animalMenuItem["value"])}>
        <span style:font-size={"20px"}>+</span>{animalMenuItem["text"]}
      </button>
    {/each}
  </center>
</div>