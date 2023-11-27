<script lang="ts">
    export let size: number = 12;
    export let fill: string = "#f44";
    export let stroke: string = "#fff";
    export let strokeWidth: number = 1;
    const dimension = size / 2;
    const half = dimension / 2;
    const quarter = dimension / 4;
    const threeQuarters = (dimension * 3) / 4;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style:width="{size}px" style:height="{size}px">
    <svg
        style:top="{-dimension}px"
        style:right="{-dimension}px"
        style:width="{size}px"
        style:height="{size}px"
        viewBox="0 0 {dimension} {dimension}"
        style:fill
        on:click
    >
        <circle cx={half} cy={half} r={half} />
        <line
            style:stroke
            x1={quarter}
            y1={quarter}
            x2={threeQuarters}
            y2={threeQuarters}
            style:stroke-width={strokeWidth}
        />
        <line
            style:stroke
            x1={threeQuarters}
            y1={quarter}
            x2={quarter}
            y2={threeQuarters}
            style:stroke-width={strokeWidth}
        />
    </svg>
</div>

<style>
    div {
        position: relative;
    }
    svg {
        position: absolute;
        cursor: pointer;
        transition: transform 0.3s;
    }

    svg:hover {
        transform: scale(1.2);
    }

    line {
        stroke-linecap: round;
    }
</style>
