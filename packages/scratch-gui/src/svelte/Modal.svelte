<script lang="ts" context="module">
  import type _ExtensionManager from 'scratch-vm/src/extension-support/extension-manager';
  import type { Extension } from "scratch-vm/src/typescript-support/Extension";
  import type _VirtualMachine from "scratch-vm/src/virtual-machine";

  type ExtensionID = string;
  type ComponentName = string;

  type Payload = {
    target: HTMLDivElement;
    props: { close: () => void, extension: Extension<any, any> };
  }

  type UIConstructor = (details: Payload) => void; 

  type ExtensionManager = _ExtensionManager & { 
    getAuxiliaryObject: (id: ExtensionID, name: ComponentName) => UIConstructor,
    getExtensionInstance: (id: ExtensionID) => Extension<any, any>
  };
  type VirtualMachine = _VirtualMachine & { extensionManager: ExtensionManager };
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let id: ExtensionID;
  export let component: ComponentName;
  export let name: string;

  export let vm: VirtualMachine;
  export let close: () => void;

  let target: HTMLDivElement;

  onMount(async () => {
    const props = { close, extension: vm.extensionManager.getExtensionInstance(id) };
    const options = { target, props };
    const constructor = vm.extensionManager.getAuxiliaryObject(id, component);
    new constructor(options);
    return;
  })

</script>

<div bind:this={target} />