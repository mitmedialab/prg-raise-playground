<script lang="ts">
    import type Extension from ".";
    import PrimaryButton from "$common/components/PrimaryButton.svelte";
    import { color } from "$common";

    export let extension: Extension;
    export let close: () => void;

    let input: HTMLInputElement;
    let file: File = null;

    const _export = () => {
        extension.exportClassifier();
        close();
    };

    const _import = async () => {
        const success = await extension.importClassifier(file);
        if (!success) return alert(`Failed to import ${file.name}`);
        extension.buildCustomDeepModel();
        close();
    };

    const _close = async () => {
        if (file) {
            const success = await extension.importClassifier(file);
            if (!success) close();
            extension.buildCustomDeepModel();
        }
        close();
    }
</script>

<div style:background-color={color.ui.white}>
    <PrimaryButton on:click={_export}>Export Classifier</PrimaryButton>
    <PrimaryButton on:click={_import} disabled={!file}>
        Import Classifier
        <input
            bind:this={input}
            type="file"
            accept=".json"
            on:change={(e) => (file = e.currentTarget.files[0])}
        />
    </PrimaryButton>
    <PrimaryButton on:click={_close}>Done</PrimaryButton>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
    }
</style>
