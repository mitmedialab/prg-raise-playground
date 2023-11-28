<script lang="ts">
    import { color } from "../ui";
    export let disabled: boolean = false;
    export let dataTestID: string = null;
    export let paddingVertical: string = "0.75rem";
    export let paddingHorizontal: string = "1rem";
    export let borderRadius: string = "0.25rem";

    const text = color.ui.white;
    const solid = color.motion.primary;
</script>

<button
    on:click
    on:mousedown
    on:mouseup
    {disabled}
    style:border-color={solid}
    style:background-color={solid}
    style:color={text}
    data-testid={dataTestID}
    style:padding={`${paddingVertical} ${paddingHorizontal}`}
    style:border-radius={borderRadius}
>
    <slot />
</button>

<style>
    button:disabled {
        background: var(--drop-highlight) !important;
        border: var(--drop-highlight) !important;
    }

    button {
        border-width: 1px;
        border-style: solid;
        font-weight: 600;
        font-size: 0.85rem;
        transition: background-color 0.25s, border-color 0.25s;
    }
</style>
