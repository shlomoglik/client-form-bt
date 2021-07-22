<script>
    export let title, shrinkable;
    export let isShrink;
    const handleShrink = () => (isShrink = !isShrink);
</script>

<div class="form-group">
    {#if title}
        <div class="form-group-title" on:click={handleShrink}>
            <h3>{title}</h3>
            {#if shrinkable}
                <span>{isShrink ? "🔽" : "🔼"}</span>
            {/if}
        </div>
    {/if}
    <slot />
</div>

<style>
    .form-group {
        display: grid;
        align-items: center;
        font-size: 18px;
        gap: 2rem;
        border-top: 3px solid #ebebeb;
    }
    .form-group-title {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 5%;
        align-items: center;
    }
    .form-group-title:hover {
        background-color: #eee;
    }
    h3 {
        font-weight: 500;
        font-size: 32px;
    }
</style>
