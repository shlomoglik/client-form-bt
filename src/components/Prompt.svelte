<script>
    import { onMount } from "svelte";
    import { prompt } from "../stores";
    import { fly } from "svelte/transition";
    import { isObject, isString } from "../utils/data";

    export let closeAction = () => ($prompt = null);

    export let closeWithConfirm = false;
    export let hidden = false;
    export let draggble = true;
    let top = 0;
    let left = 0;
    let moving = false;
    let box;
    let confirmClose = false;

    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e) {
        if (moving && draggble) {
            top += e.movementY;
            left += e.movementX;
        }
    }

    function onMouseUp() {
        moving = false;
    }
    function close() {
        if (closeWithConfirm) confirmClose = true;
        else closeAction();
    }
    function assertClose() {
        closeAction();
    }
    onMount(() => {
        const { height, width } = box.getBoundingClientRect();
        top = window.pageYOffset + window.innerHeight / 2 - height / 2;
        left = window.pageXOffset + window.innerWidth / 2 - width / 2;
    });
</script>

<div
    bind:this={box}
    class="modal"
    on:mousedown={onMouseDown}
    on:click|preventDefault={() => null}
    style="left: {left}px; top: {top}px;"
    class:draggeble={draggble}
    class:hidden
>
    <slot/>

    {#if isString($prompt)}
        {@html $prompt}
    {/if}
    {#if closeWithConfirm && confirmClose}
        <button transition:fly on:click={assertClose}>האם לסגור ?</button>
    {/if}
</div>
<div class="backdrop" on:click={close} class:hidden />

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
    .hidden{
        visibility: hidden;
        opacity: 0;
    }
    .backdrop {
        position: fixed;
        background-color: #3333335c;
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }
    .modal {
        z-index: 2;
        position: absolute;
        background: white;
        min-width: 250px;
        min-height: 350px;
        border-radius: 50px;
        padding: 3rem;
        box-shadow: -5px 7px 20px 2px rgb(0 0 0 / 20%);
        display: grid;
        align-items: center;
        justify-content: center;
        user-select: none;
    }
    .draggeble {
        cursor: move;
    }
</style>
