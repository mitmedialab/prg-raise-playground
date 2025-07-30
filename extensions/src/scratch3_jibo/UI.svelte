<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, color } from "$common";

  export let extension: Extension;

  export let close: () => void;


  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const jiboKey = "jibo-name";


  let error: string;
  let errorVisible = false;

  const savedIP = localStorage.getItem(jiboKey);
  const nameParts = savedIP ? savedIP.split("-") : ["bubbles", "onion", "sonic", "jean"];

  function validJiboName(jiboName: string) {
    if (jiboName && jiboName != "") {
      let regExp = /[A-Za-z]+-[A-Za-z]+-[A-Za-z]+-[A-Za-z]+/gm;
      if (jiboName.match(regExp))
        return true;
    }
    // console.log("Invalid jibo name");
    return false;
  }


  const setStorage = async () => {
    const nameOverride =
    nameParts.filter(Boolean).length === 4 ? nameParts.join("-") : undefined;
    if (validJiboName(nameOverride)) {
      if (nameOverride) localStorage.setItem(jiboKey, nameOverride);
      invoke("setJiboName", nameOverride);
      close();
    } else {
      errorVisible = true;
    }
      
  }


</script>

<div
  class="container"
  style:width="100%"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
    <div>
      <h3>Enter Jibo's name:</h3>
      <div>
        <div
          style:overflow="hidden"
          style:max-height="fit-content"
        >
          <p>
            Name:
            {#each nameParts as part, i}
            <input
              class="ip"
              bind:value={nameParts[i]}
              type="text"
              placeholder="e.g. word"
            />
            {i < nameParts.length - 1 ? "-" : ""}
          {/each}
          </p>
        </div>
      </div>
    </div>
    <div>
      {#if errorVisible}
        <p
          class="errorMsg">
            Jibo's name should be four words separated by dashes. For example: robot-explore-circuit-play.
        </p>
      {/if}
      <button on:click={setStorage}>
        Submit
      </button>
    </div>
</div>

<style>
  .container {
    text-align: center;
    padding: 30px;
    min-width: 360px;
  }

  .error {
    background-color: red;
    color: white;
    padding: 4px 8px;
    text-align: center;
    border-radius: 5px;
  }

  .collapser {
    background-color: inherit;
    cursor: pointer;
    border: none;
    text-align: left;
    outline: none;
  }

  .errorMsg {
    color: red;
    font-size: 0.67em;
    max-width: 300px;
  }

  .ip {
    width: 3rem;
  }
</style>