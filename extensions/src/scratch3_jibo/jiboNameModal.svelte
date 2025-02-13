<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color } from "$common";
  // my imports
  // import { setJiboName } from "./index";

  /**
   * @summary This is a reference to the instance of your extension.
   * @description Use your extension to collect, display, and update information.
   *
   * In this way, the UI acts as 'view' into your extension and its current state.
   *
   * Your UI is also able to manipulate your extension's state through interacting with the public properties and functions of your extension
   * (NOTE: functions should not be invoked directly, but instead called through the `invoke` function below).
   */
  // svelte-ignore unused-export-let

  export let extension: Extension;

  // my variables
  let inputText = localStorage.getItem("prevJiboName") ? localStorage.getItem("prevJiboName") : "";
  let errorVisible = false;

  /**
   * @summary Use this to close the modal / pop-up that contains this UI.
   * @description This is useful for things like if you have a 'cancel' or 'exit' button within this UI.
   * @example
   * ```svelte
   * <button on:click={close}>Cancel</button>
   * ```
   */
  // svelte-ignore unused-export-let
  export let close: () => void;

  function validJiboName(jiboName: string) {
    if (jiboName && jiboName != "") {
      let regExp = /[A-Za-z]+-[A-Za-z]+-[A-Za-z]+-[A-Za-z]+/gm;
      if (jiboName.match(regExp))
        return true;
    }
    // console.log("Invalid jibo name");
    return false;
  }
  async function handleSubmit() {
    if (validJiboName(inputText)) {
      inputText = inputText.toLowerCase();
      inputText = inputText.trim();
      //await setJiboName(inputText);
      // run extensions "connect" function once name is set
      invoke("connect");
      errorVisible = true;
      close();
    } else {
      errorVisible = true;
    }
  }

  /**
   * @summary Use this to invoke functions on your extension.
   * @description Use this function instead of invoking functions on your extension directly,
   * as this ensures your UI will be refreshed after the function is called
   * (in case any of your extension's properties have changed as a consequence of the function call,
   * which should therefore be updated in the UI).
   * @param functionName Name of the function to invoke
   * @param args Arguments of the specified funtion
   * @example
   * ```ts
   * // do this:
   * invoke("someFunction", 4, "argument 2");
   * // instead of this:
   * extension.someFunction(4, "argument 2");
   * ```
   */
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;
</script>

<div
  class:container
  style:width="360px"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  <h5>Please enter Jibo's name below:</h5>
  <input type="text" bind:value={inputText} placeholder="jibo..." />
  {#if errorVisible}
    <p
      class="errorMsg">
        Jibo's name should be four words separated by dashes. For example: robot-explore-circuit-play.
    </p>
  {/if}

  <button on:click={handleSubmit}>Submit</button>
  <!-- <button on:click={(event) => invoke("setText" , inputText)}>Submit</button> -->
</div>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
  .errorMsg {
    color: red;
    font-size: 0.67em;
  }
</style>
