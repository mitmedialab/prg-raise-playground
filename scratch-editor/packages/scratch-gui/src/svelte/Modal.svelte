<script lang="ts" context="module">
    import type _ExtensionManager from "../../../scratch-vm/src/extension-support/extension-manager";
    import type _VirtualMachine from "../../../scratch-vm/src/virtual-machine";
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
            name: ComponentName,
        ) => UIConstructor;
        getExtensionInstance: (id: ExtensionID) => ExtensionInstance;
    };
    type VirtualMachine = _VirtualMachine & {
        extensionManager: ExtensionManager;
    };

    async function untilDefined<T>(
        getter: () => T,
        delay: number = 100,
    ): Promise<T> {
        let timeout: Parameters<typeof clearTimeout>[0];
        let value = getter();
        while (!value) {
            await new Promise((resolve) => {
                clearTimeout(timeout);
                timeout = setTimeout(resolve, delay);
            });
            value = getter();
        }
        clearTimeout(timeout);
        return value;
    }
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
    let constructed: any;

    onMount(async () => {
        const { extensionManager } = vm;
        const extension = await untilDefined(() =>
            extensionManager.getExtensionInstance(id),
        );
        const props = { close, extension };
        const options = { target, props };
        const constructor = extensionManager.getAuxiliaryObject(id, component);
        constructed = new constructor(options);
        return;
    });

    onDestroy(() => {
        // HACK: This is a hack to ensure a svelte's `onDestroy` callback(s) is called
        const callbacks = constructed?.["$$"]?.["on_destroy"];
        if (!callbacks) return;
        callbacks.forEach((callback: Function) => callback());
    });
</script>

<div bind:this={target} />
