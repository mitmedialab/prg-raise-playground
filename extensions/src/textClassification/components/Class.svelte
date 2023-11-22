<script lang="ts">
    import PrimaryButton from "$common/components/PrimaryButton.svelte";
    import Example from "./Example.svelte";

    export let isActive: boolean;
    export let label: string;
    export let examples: string[];

    export let setActive: () => void;
    export let deactivate: () => void;
    export let deleteSelf: () => void;
    export let rename: (newLabel: string) => void;

    const paddingVertical = "0.3rem";
    const paddingHorizontal = "0.5rem";

    let input: HTMLInputElement;

    const set = () => (label !== input?.value ? rename(input.value) : void 0);

    let candidate: string = "";

    $: valid = candidate !== "" && !examples.includes(candidate);

    const addCandidate = () => {
        examples.push(candidate);
        examples = examples;
        candidate = "";
    };

    const deleteExample = (index: number) => {
        examples.splice(index, 1);
        examples = examples;
    };

    const onEnter =
        (...callbacks: (() => void)[]) =>
        (event: KeyboardEvent) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            callbacks.forEach((callback) => callback());
        };
</script>

<div class="row">
    {#if isActive}
        <div>
            <input
                type="text"
                value={label}
                bind:this={input}
                id="label"
                name="label"
                on:blur={set}
                on:keypress={onEnter(set, deactivate)}
            />
            <span>
                ({examples.length} example{examples.length !== 1 ? "s" : ""})
            </span>

            <PrimaryButton
                {paddingVertical}
                {paddingHorizontal}
                on:click={deactivate}
            >
                Done Editing
            </PrimaryButton>

            <PrimaryButton
                {paddingVertical}
                {paddingHorizontal}
                on:click={deleteSelf}
            >
                Delete Label
            </PrimaryButton>
        </div>
        <div class="examples">
            {#each examples as example, index}
                <Example text={example} xOut={() => deleteExample(index)} />
            {/each}
        </div>
        <center>
            <div style:margin-top="1rem">
                <input
                    bind:value={candidate}
                    on:keypress={onEnter(() =>
                        valid ? addCandidate() : void 0
                    )}
                />
                <PrimaryButton
                    {paddingVertical}
                    {paddingHorizontal}
                    disabled={!valid}
                    on:click={addCandidate}
                >
                    Add Example
                </PrimaryButton>
            </div>
        </center>
    {:else}
        <div>
            <span>{label}</span>
            <span>
                ({examples.length} example{examples.length !== 1 ? "s" : ""})
            </span>
            <PrimaryButton
                {paddingVertical}
                {paddingHorizontal}
                on:click={setActive}
            >
                Edit Label
            </PrimaryButton>
        </div>
        <div class="examples">
            {#each examples as example}
                <Example text={example} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .row {
        margin: 0.5rem 0.5rem;
        border-radius: 0.25rem;
        background-color: white;
        padding: 0.5rem;
    }
    input {
        height: 1.3rem;
        padding: 0 0.75rem;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 0.875rem;
        font-weight: bold;
        color: hsla(225, 15%, 40%, 1);
        border-width: 1px;
        border-style: solid;
        border-color: hsla(0, 0%, 0%, 0.15);
        border-radius: 0.25rem;
        outline: none;
        cursor: text;
        transition: 0.25s ease-out;
        box-shadow: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }

    .examples {
        display: flex;
        width: 90%;
        margin: auto;
        overflow-y: auto;
        flex-wrap: wrap;
    }
</style>
