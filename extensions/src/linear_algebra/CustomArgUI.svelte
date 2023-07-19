<script lang="ts">
    import { ParameterOf } from "$common";
    import { ArgumentEntrySetter, ArgumentEntry } from "$common";
    import type Extension from ".";
    type Value = ParameterOf<Extension, "exampleReporter", 0>;

    // svelte-ignore unused-export-let
    export let setter: ArgumentEntrySetter<Value>;

    // svelte-ignore unused-export-let
    export let current: ArgumentEntry<Value>;

    // svelte-ignore unused-export-let
    export let extension: Extension;
</script>

{#each current.value as row}
    <div>
        {#each row as cell}
            <input type="number" bind:value={cell} />
        {/each}
    </div>
{/each}
