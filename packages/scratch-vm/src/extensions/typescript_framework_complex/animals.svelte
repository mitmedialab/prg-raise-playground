<script lang="ts">
  import type Extension from ".";
  import { invokeFromUI, type InvokeFromUI, type GetFromUI, type SetFromUI, setFromUI, type ReactivityDependency, color } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => invokeFromUI((extension = extension), funcName, args);
  const set: SetFromUI<Extension> = (propertyName, value) => setFromUI((extension = extension), propertyName, value);
  const get: GetFromUI<Extension> = (propertyName) => (extension = extension)[propertyName];
  
  let animalMap: Map<string, number>;

  const setAnimalMap = (dependsOn: ReactivityDependency) => {
    animalMap = new Map();
    for (const animal of invoke("getAnimalCollectionEmojis")) {
      animalMap.set(animal, animalMap.has(animal) ? animalMap.get(animal) + 1 : 1);
    }
  }

  $: setAnimalMap([get("collection"), extension]);
  
  const container = true;
</script>

<style>
  .container {
    width: 360px;
  }
  button {
    border-radius: 10px;
    font-size: 40px;
  }
</style>

<div class:container style:background-color={color.ui.white}>
  <ul>
    {#each [...animalMap] as [animal, count]}
      <li>{animal} {count}</li>
    {/each}
  </ul>
  <center>
    {#each get("animals") as animalMenuItem}
      <button on:click={() => invoke("addAnimalToCollection", animalMenuItem["value"])}>{animalMenuItem["text"]}</button>
    {/each}
  </center>
</div>