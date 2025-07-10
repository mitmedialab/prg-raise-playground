<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color } from "$common";
  import { onDestroy } from "svelte";

  export let extension: Extension;

  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;

  const openBluetooth = () => {
    extension.bluetoothEmitter.emit("bluetooth", window.navigator.bluetooth);
    close();
  };

  onDestroy(() => {
    console.log("Closed");
  });
</script>

<div
  class:container
  style:width="90vw"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  <h1>Doodlebot's bluetooth connection was reset.</h1>
  <h2>
    Please click the button below to open up the bluetooth and reselect your
    device.
  </h2>
  <button on:click={openBluetooth}>Open Bluetooth Menu</button>
</div>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }

  button {
    font-size: 2rem;
  }
</style>
