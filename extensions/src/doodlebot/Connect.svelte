<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, color } from "$common";
  import Doodlebot from "./Doodlebot";

  export let extension: Extension;

  export let close: () => void;

  const { bluetooth } = window.navigator;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const storageKeys = {
    ssid: "doodlebot-ssid",
    password: "doodlebot-password",
    ip: "doodlebot-ip",
  };

  const ipPrefix = "192.168.0.";

  let error: string;
  let ssid = localStorage.getItem(storageKeys.ssid) ?? "";
  let password = localStorage.getItem(storageKeys.password) ?? "";
  let ip = localStorage.getItem(storageKeys.ip) ?? "";

  const inputs = {
    ssid: null as HTMLInputElement,
    password: null as HTMLInputElement,
  };

  const createConnection = async () => {
    try {
      const doodlebot = await Doodlebot.tryCreate(
        { ssid, password, ipOverride: ip ? ipPrefix + ip : undefined },
        bluetooth,
      );

      invoke("setDoodlebot", doodlebot);
      localStorage.setItem(storageKeys.ssid, ssid);
      localStorage.setItem(storageKeys.password, password);
      localStorage.setItem(storageKeys.ip, ip);
      close();
    } catch (err) {
      invoke("setIndicator", "disconnected");
      console.error(err);
      error =
        err.message === "Bluetooth adapter not available."
          ? "Your device does not support BLE connections."
          : err.message == "User cancelled the requestDevice() chooser."
            ? "You must select a device to connect to. Please try again."
            : err.message !== "User cancelled the requestDevice() chooser."
              ? "There was a problem connecting your device, please try again or request assistance."
              : err.message;
    }
  };

  const updateNetworkCredentials = () =>
    extension.doodlebot.connectToWebsocket({ ssid, password, ipOverride: ip });

  let showAdvanced = false;
</script>

<div
  class="container"
  style:width="100%"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}
  {#if bluetooth}
    {#if !extension.doodlebot}
      <h1>How to connect to doodlebot</h1>
      <div>
        <h3>1. Set network credentials:</h3>
        <p>
          SSID (Network Name):
          <input
            bind:this={inputs.ssid}
            bind:value={ssid}
            type="text"
            placeholder="e.g. my_wifi"
          />
        </p>
        <p>
          Password:
          <input
            bind:this={inputs.password}
            bind:value={password}
            type="password"
            placeholder="e.g. 12345"
          />
        </p>
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
              IP: {ipPrefix}<input
                bind:this={inputs.password}
                bind:value={ip}
                type="text"
                placeholder="e.g. 12345"
              />
            </p>
          </div>
        </div>
      </div>
      <div>
        <h3>2. Select bluetooth device</h3>

        <button disabled={!password || !ssid} on:click={createConnection}>
          Open Bluetooth Menu
        </button>
      </div>
    {:else}
      {@const credentials = extension.doodlebot.getNetworkCredentials()}
      <h1>Connected to doodlebot</h1>
      <div>
        <h3>Update network credentials:</h3>
        SSID (Network Name):
        <input bind:this={inputs.ssid} type="text" value={credentials.ssid} />
        Password:
        <input
          bind:this={inputs.password}
          type="text"
          value={credentials.password}
        />
        <button
          disabled={(credentials.ssid === ssid &&
            credentials.password === password) ||
            !ip}
          on:click={updateNetworkCredentials}
        >
          Update</button
        >
      </div>
      <div>
        <button>Disconnect</button>
      </div>
    {/if}
  {:else}
    Uh oh! Your browser does not support bluetooth. Here's how to fix that...
    TBD
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
</style>
