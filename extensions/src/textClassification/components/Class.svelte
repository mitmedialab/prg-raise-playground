<script lang="ts">
    export let isActive: boolean;
    export let label: string;
    export let examples: string[];

    export let setActive: () => void;
</script>

{#if isActive}
    <span>{label}</span>
    <span>({examples.length} example{examples.length === 1 ? "s" : ""})</span>
    <button on:click={setActive}>Edit Label</button>
{:else}
    {#each examples as example}
        <div>{example}</div>
    {/each}
{/if}
