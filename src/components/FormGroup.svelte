<script>
    export let title;
</script>

<div class="form-group">
    {#if title}
        <h3>{title}</h3>
    {/if}
    <slot />
</div>

<style>
    .form-group {
        display: grid;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        gap: 2rem;
        border-top: 3px solid #ebebeb;
    }
    h3 {
        font-weight: 500;
        font-size: 32px;
    }
</style>
