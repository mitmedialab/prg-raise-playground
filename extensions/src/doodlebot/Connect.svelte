<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, color } from "$common";
  import {
    type BLEDeviceWithUartService,
    getBLEDeviceWithUartService,
  } from "./ble";

  export let extension: Extension;

  export let close: () => void;

  const { bluetooth } = window.navigator;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  let connected = extension.connected;

  if (!connected)
    requestAnimationFrame(() => {
      try {
        extension.setIndicator("disconnected");
      } catch (e) {}
    });

  let error: string | null = null;

  let bleDevice: BLEDeviceWithUartService | null = null;
  let topLevelDomain: string | null = null;
  let topLevelDomainOverride: string =
    new URLSearchParams(window.location.search).get("tld") ?? "";

  const errorOut = (message: string, err?: Error) => {
    invoke("setIndicator", "disconnected");
    if (err) console.error(err);
    error = message;
  };

  const retrieveDevice = async () => {
    try {
      const result = await getBLEDeviceWithUartService(bluetooth);
      if ("error" in result) {
        invoke("setIndicator", "disconnected");
        error = result.error;
      } else {
        bleDevice = result;
        topLevelDomain = result.device.name + ".direct.mitlivinglab.org";
      }
    } catch (err) {
      errorOut(
        err.message === "Bluetooth adapter not available."
          ? "Your device does not support BLE connections."
          : err.message == "User cancelled the requestDevice() chooser."
            ? "You must select a device to connect to. Please try again."
            : err.message !== "User cancelled the requestDevice() chooser."
              ? "There was a problem connecting your device, please try again or request assistance."
              : err.message,
        err
      );
    }
  };

  const setConnection = () => {
    if (!bleDevice || !topLevelDomain)
      return errorOut("You must select a device to connect to.");
    extension.setDoodlebot(topLevelDomainOverride || topLevelDomain, bleDevice);
    extension.connected = true;
    close();
  };

  let showAdvanced = false;
</script>

<div
  class="container"
  style:width="100%"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  {#if connected}
    <h1>You're connected to doodlebot!</h1>
    <div>
      If you'd like to reconnect, or connect to a different device, you must
      reload this page.
    </div>
    <div>
      <button on:click={() => window.location.reload()}> Reload </button>
    </div>
  {:else}
    {#if error}
      <div class="error">
        {error}
      </div>
    {/if}
    {#if bluetooth}
      <h1>Please connect to a doodlebot...</h1>
      <div>
        <h3>...by selecting a bluetooth device</h3>
        <button class="open" on:click={retrieveDevice}>
          Open Bluetooth Menu
        </button>
        {#if bleDevice}
          You've selected 🤖 <strong>{bleDevice.device.name}</strong>.
        {/if}
      </div>
      <div style:margin-top="20px">
        <button
          class="connect"
          disabled={!bleDevice || !topLevelDomain}
          on:click={setConnection}>Connect</button
        >
      </div>
      <div>
        <button
          class="collapser"
          on:click={() => (showAdvanced = !showAdvanced)}
        >
          {showAdvanced ? "▴" : "▾"} Advanced
        </button>
        <div
          style:overflow="hidden"
          style:max-height={showAdvanced ? "fit-content" : "0"}
        >
          <p>
            Use top level domain:
            <input type="text" bind:value={topLevelDomainOverride} />
            {#if topLevelDomain}
              (instead of '{topLevelDomain}')
            {/if}
          </p>
        </div>
      </div>
    {:else}
      Uh oh! Your browser does not support bluetooth. Please contact an
      instructor.
    {/if}
  {/if}
</div>

<style>
  .container {
    text-align: center;
    padding: 30px;
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

  .open {
    background-color: dodgerblue;
    border: 1px solid dodgerblue;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-family:
      "Akzidenz Grotesk BQ Medium",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    font-size: 16px;
    font-weight: 600;
    outline: none;
    outline: 0;
    padding: 5px 15px;
    text-align: center;
    transform: translateY(0);
    transition:
      transform 150ms,
      box-shadow 150ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  /* CSS */
  .connect {
    background-color: #13aa52;
    border: 1px solid #13aa52;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-family:
      "Akzidenz Grotesk BQ Medium",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    font-size: 16px;
    font-weight: 600;
    outline: none;
    outline: 0;
    padding: 10px 25px;
    text-align: center;
    transform: translateY(0);
    transition:
      transform 150ms,
      box-shadow 150ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .connect:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .connect:not(:disabled):hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0 3px 9px 0;
    transform: translateY(-2px);
  }
</style>
