<script>
    import Icon from "./Icon.svelte";
    import {fade} from "svelte/transition"

    export let action = () => null;
    export let icon = "";
    export let color = "inherit";
    export let withConfirm = "";

    let state = "init";
    const actionWrrapper = () => {
        if (withConfirm) {
            if (state === "init") state = "confirm";
            else if (state === "confirm") state = "active";
            else state = "init";
        } else {
            if (state === "init") state = "active";
            else state = "init";
        }

        if (state === "active") {
            Promise.resolve(action()).then(() => {
                state = "init";
            });
        }
    };
</script>
{#if state ==="confirm"}
    <div transition:fade on:click={actionWrrapper} style={`color:${color}`}>{withConfirm}</div>
    {:else}
    <div on:click={actionWrrapper} class="action" style={`color:${color}`}>
        <Icon name={icon} />
    </div>
{/if}

<style>
    .action {
        display: grid;
        place-items: center;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }
    .action:hover {
        transform: translateY(-3px);
    }
    .action:active {
        transform: translateY(0.5px);
    }
</style>
