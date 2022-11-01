<script lang="ts">
  import type Extension from ".";
  import { invokeFromUI, type InvokeFromUI } from "../../typescript-support/ui";

  import Cancel from "../../typescript-support/components/Cancel.svelte";
  import Ok from "../../typescript-support/components/Ok.svelte";

  export let extension: Extension;
  export let close: () => void;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => {
    extension = extension; // svelte magic to force a re-render
    return invokeFromUI(extension, funcName, args);
  }

  const container = true;
  const label = true;
  const numberInputContainer = true, numberInput = true, nameInput = true;

  const value = 1;
  const min = 1, max = 100;

  let name: string = "";
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
</style>

<div class:container>
  <div>
    <div class:label>Table Name</div>
    <input class:nameInput autofocus bind:value={name}>
  </div>
  <div class:numberInputContainer>
    <div class:label>Number of Rows</div>
    <input class:numberInput type="number" {min} {max} {value}>
  </div>
  <div class:numberInputContainer>
    <div class:label>Number of Columns</div>
    <input class:numberInput type="number" {min} {max} {value}>
  </div>
  <div>
    <Ok on:click={close} disabled={name.length === 0}/>
    <Cancel on:click={close}/>
  </div>
</div>