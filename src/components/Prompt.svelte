<script>
    import { onMount } from "svelte";

    import { prompt } from "../stores";
    import Draggble from "./Draggble.svelte";
    let box;
    function close() {
        $prompt = null;
    }
    onMount(() => {
        const elemHeight = box.getBoundingClientRect().height;
        const topDist =
            window.pageYOffset + window.innerHeight / 2 - elemHeight / 2;
        box.style.top = `${topDist}px`;
    });
</script>

{#if $prompt}
    <!-- <Draggble> -->
        <div bind:this={box} class="modal" on:click:preventDefault={() => null}>
            {@html $prompt}
        </div>
    <!-- </Draggble> -->
    <div class="backdrop" on:click={close} />
{/if}

<style>
    .backdrop {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #3333335c;
        z-index: 1;
    }
    .modal {
        z-index: 2;
        position: absolute;
        background: white;
        min-width: 500px;
        min-height: 450px;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50px;
        padding: 3rem;
        box-shadow: -5px 7px 20px 2px rgb(0 0 0 / 20%);
        display: grid;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: move;
    }
</style>
