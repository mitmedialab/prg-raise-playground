<script lang="ts">
  import type Extension from ".";
  import Ok from "$common/components/Ok.svelte";
  import { ReactiveSet, ReactiveInvoke, reactiveInvoke, reactiveSet, activeClass, color} from "$common";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);
  const set: ReactiveSet<Extension> = (propertyName, value) => reactiveSet((extension = extension), propertyName, value);

  const container = activeClass;
  const tableListDropdown = activeClass, tableBox = activeClass, tableValueInput = activeClass;

  const tableNames = Object.keys(extension.tables);
  let selected: string = tableNames.length > 0 ? tableNames[0] : "";

  type InputChangeEvent = Event & { currentTarget: EventTarget & HTMLInputElement};
  const update = (e: InputChangeEvent, row: number, column: number) => 
    invoke("changeTableValue", {name: selected, row, column, value: parseInt(e.currentTarget.value)});
</script>

<style>
  .container {
    width: 480px;
    padding: 1.5rem 2.25rem;
  }

  .tableListDropdown {
    margin-bottom: 1.5rem;
    width: 100%;
    border: 1px solid var(--ui-black-transparent);
    border-radius: 5px;
    padding: 0 1rem;
    height: 3rem;
    color: var(--text-primary-transparent);
    font-size: 1rem;
  }

  .tableBox {
    border: 1px solid var(--ui-black-transparent);
    border-radius: 5px;
    margin-bottom: 1rem;
    padding: 1rem;
    color: var(--text-primary-transparent);
    font-size: 1rem;
    overflow: scroll;
    max-height: 22.5rem;
  }

  .tableValueInput {
    width: 3rem;
    padding: .25rem;
    color: var(--text-primary-transparent);
    font-size: 1rem;
  }
</style>

<div class:container style:width="360px" style:background-color={color.ui.white} style:color={color.text.primary}>
  <div>
    <select bind:value={selected} class:tableListDropdown data-testid="tableSelect">
      {#each Object.keys(extension.tables) as name}
        <option value={name}>
          {name}
        </option>
      {/each}
    </select>
  </div>
  <div class:tableBox>
    <table>
      <thead>
        <tr>
          <th></th>
          {#each extension.columnNames[selected] as columnName, i}
            <th>
              <span
              contenteditable="false"
              class="editableHeader"
              on:click={(e) => e.currentTarget.contentEditable = "true"}
              on:blur={(e) => {
                e.currentTarget.contentEditable = "false";
                invoke("renameColumn", { name: selected, column: i, value: e.currentTarget.innerText });
              }}
            >
              {columnName}
            </span>
            </th>
          {/each}
      </tr>
      </thead>
      <tbody>
        {#each extension.tables[selected] as row, i}
          <tr>
            <th>
              <span
                contenteditable="false"
                class="editableHeader"
                on:click={(e) => e.currentTarget.contentEditable = "true"}
                on:blur={(e) => {
                  e.currentTarget.contentEditable = "false";
                  invoke("renameRow", { name: selected, row: i, value: e.currentTarget.innerText });
                }}
              >
                {extension.rowNames[selected][i]}
              </span>
            </th>
            {#each row as value, j}
              <th>
                <input class:tableValueInput type="number" {value} on:change={(e) => update(e, i, j)} data-testid="tableCell">
              </th>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <center>
    <Ok on:click={close} />
  </center>
</div>

