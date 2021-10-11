<script>
    import { fade } from "svelte/transition";
    import { isString } from "../utils/data";
    export let loading;
</script>

{#if loading}
    <div class="loader" transition:fade>
        <div class="spinner" />
        {#if isString(loading)}
            <span>{loading}</span>
        {/if}
    </div>
{:else}
    <slot />
{/if}

<style>
    .loader {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        cursor: pointer;
        display: grid;
        justify-content: center;
        align-content: center;
    }

    .spinner {
        border: 16px solid var(--color-primary-light);
        border-top: 16px solid var(--color-primary);
        border-radius: 50%;
        width: 10rem;
        height: 10rem;
        animation: spin 2s linear infinite;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
