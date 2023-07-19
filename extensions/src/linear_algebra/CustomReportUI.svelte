<script lang="ts">
    import { ReturnOf } from "$common";
    import type Extension from ".";

    export let value: ReturnOf<Extension, "exampleReporter">;
    export let extension: Extension;
</script>

{#each value as row}
    {#each row as cell}
        <p>{cell}</p>
    {/each}
{/each}

<h1>yes!</h1>
