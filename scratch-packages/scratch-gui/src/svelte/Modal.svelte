<script lang="ts" context="module">
    import type _ExtensionManager from "scratch-vm/src/extension-support/extension-manager";
    import type _VirtualMachine from "scratch-vm/src/virtual-machine";
    import type { ExtensionInstance } from "../../../../extensions/src/common";

    type ExtensionID = string;
    type ComponentName = string;

    type Payload = {
        target: HTMLDivElement;
        props: { close: () => void; extension: ExtensionInstance };
    };

    type UIConstructor = (details: Payload) => void;

    type ExtensionManager = _ExtensionManager & {
        getAuxiliaryObject: (
            id: ExtensionID,
            name: ComponentName
        ) => UIConstructor;
        getExtensionInstance: (id: ExtensionID) => ExtensionInstance;
    };
    type VirtualMachine = _VirtualMachine & {
        extensionManager: ExtensionManager;
    };
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // svelte-ignore unused-export-let
    export let id: ExtensionID;
    // svelte-ignore unused-export-let
    export let component: ComponentName;
    // svelte-ignore unused-export-let
    export let name: string;
    // svelte-ignore unused-export-let
    export let vm: VirtualMachine;
    // svelte-ignore unused-export-let
    export let close: () => void;

    let target: HTMLDivElement;

    onMount(async () => {
        const props = {
            close,
            extension: vm.extensionManager.getExtensionInstance(id),
        };
        const options = { target, props };
        const constructor = vm.extensionManager.getAuxiliaryObject(
            id,
            component
        );
        new constructor(options);
        return;
    });
</script>

<div bind:this={target} />
