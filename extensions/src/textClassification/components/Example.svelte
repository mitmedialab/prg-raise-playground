<script lang="ts">
    import { color } from "$common";
    import X from "$common/components/X.svelte";

    export let text: string;
    export let xOut: () => void = null;
</script>

<div class="container" style:background-color={color.motion.lightTansparent}>
    {text}
    {#if xOut}
        <div style:position="absolute" style:right="{0}px" style:top="{0}px">
            <X fill={color.motion.primary} size={16} on:click={xOut} />
        </div>
    {/if}
</div>

<style>
    .container {
        padding: 0.25rem 1rem;
        margin: 0rem 0.25rem;
        margin-top: 1rem;
        border-radius: 0.25rem;
        position: relative;
    }
</style>
