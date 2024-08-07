<script lang="ts">
    import type Extension from ".";
    import {
        ReactiveInvoke,
        reactiveInvoke,
        activeClass,
        color,
    } from "$common";
    import { onDestroy } from "svelte";

    export let extension: Extension;

    export let close: () => void;

    const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
        reactiveInvoke((extension = extension), functionName, args);

    const container = activeClass;

    onDestroy(() => {
        console.log("Closed");
    });
</script>

<div
    class:container
    style:width="50vw"
    style:background-color={color.ui.white}
    style:color={color.text.primary}
>
    <h1>Cannot load Doodlebot's sound/image server!</h1>
    <h2>Please try reloading the page.</h2>
</div>

<style>
    .container {
        text-align: center;
        padding: 30px;
    }
</style>
