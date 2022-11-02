<script lang="ts">
  import type Extension from ".";
  import { reactiveInvoke, reactiveSet, activeClass, px, color, ReactiveInvoke, ReactiveSet } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);
  const set: ReactiveSet<Extension> = (propertyName, value) => reactiveSet((extension = extension), propertyName, value);

  const container = activeClass; 
  let value: number = 2;
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }

  button {
    border-radius: 10px;
    border: 1px solid var(--motion-primary);
    background-color: var(--motion-primary);
    padding: 10px;
    font-size: 20px;
    margin-top: 10px;
  }
  button:hover {
    background-color: var(--motion-tertiary);
  }
</style>

<div class:container style:width={px(360)} style:background-color={color.ui.white} style:color={color.text.primary}>
  <h1>The count is {extension.count}</h1>
  <center>
    <button on:click={() => invoke("increment")}>Add 1</button>
    <br>
    <button on:click={() => invoke("incrementBy", value)}>Add</button>
    <input style:width={"50px"} style:font-size={"20px"} bind:value type="number">
    <br>
    <button on:click={() => set("count", 0)}>Reset</button>
  </center>
</div>