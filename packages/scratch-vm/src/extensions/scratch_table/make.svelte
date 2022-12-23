<script lang="ts">
  import type Extension from ".";
  import { color, reactiveInvoke, ReactiveInvoke, ReactiveSet, reactiveSet } from "../../typescript-support/ui";
  import Cancel from "../../typescript-support/components/Cancel.svelte";
  import Ok from "../../typescript-support/components/Ok.svelte";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);
  const set: ReactiveSet<Extension> = (propertyName, value) => reactiveSet((extension = extension), propertyName, value);

  const container = true;
  const label = true;
  const numberInputContainer = true, numberInput = true, nameInput = true;
  const error = true;

  const min = 1, max = 100;

  let name: string = "";
  let rows: number = 1;
  let columns: number = 1;

  let zeroLength: boolean, alreadyTaken: boolean;

  $: zeroLength = name.length === 0;
  $: alreadyTaken = name in extension.runtime.tables;

  const submit = () => {
    invoke("newTable", {name, rows, columns});
    close();
  }
</script>

<style>
  .container {
    width: 360px;
    background-color: var(--ui-white);
    padding: 30px;
    padding: 1.5rem 2.25rem;
  }

  .label {
    font-weight: 500;
    margin: 0 0 0.75rem;
  }

  .numberInputContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  input {
    border: 1px solid var(--ui-black-transparent);
    border-radius: 5px;
  }

  .numberInput {
    margin-bottom: 1.5rem;
    border: 1px solid var(--ui-black-transparent);
    border-radius: 5px;
    padding: 0 1rem;
    height: 3rem;
    color: var(--text-primary-transparent);
    font-size: .875rem;
    vertical-align: middle;
    margin-top: 20px;
  }

  .nameInput {
    margin-bottom: 1.5rem;
    width: 100%;
    border: 1px solid var(--ui-black-transparent);
    border-radius: 5px;
    padding: 0 1rem;
    height: 3rem;
    color: var(--text-primary-transparent);
    font-size: .875rem;
  }
  .error {
    margin: 0px;
    font-weight: bold;
  }
</style>

<div class:container>
  <div>
    <div class:label>Table Name</div>
    <input class:nameInput autofocus bind:value={name}>
  </div>
  <div class:numberInputContainer>
    <div class:label>Number of Rows</div>
    <input class:numberInput type="number" {min} {max} bind:value={rows}>
  </div>
  <div class:numberInputContainer>
    <div class:label>Number of Columns</div>
    <input class:numberInput type="number" {min} {max} bind:value={columns}>
  </div>
  <div>
    <!-- svelte-ignore missing-declaration -->
    <Ok on:click={submit} disabled={zeroLength || alreadyTaken}/>
    <!-- svelte-ignore missing-declaration -->
    <Cancel on:click={close}/>
  </div>
  <p 
    class:error 
    style:visibility={alreadyTaken ? "visible" : "hidden"}
    style:color={color.error.primary}>
      That table name already exists
  </p>
</div>