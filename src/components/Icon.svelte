<script>
    export let name;
    export let onClick = () => null;
    export let width = "1.5rem";
    export let height = "1.5rem";
    export let focusable = false;
</script>

<svg on:click={onClick} class={$$props.class} {focusable} {width} {height}>
    <use href={`/icons.svg#${name}`} />
</svg>

<style>
    svg {
        display: flex;
        align-items: center;
        justify-content: center;
        fill: currentColor;
    }
</style>
