<script>
    import { Link, useLocation } from "svelte-navigator";
    export let to="/";
    export let text = "בית";
    export let action = null;
    const location = useLocation();
</script>

{#if action}
    <span class="nav-link" on:click={action}>{text}</span>
{:else if $location.pathname !== to}
    <Link {to}><span class="nav-link">{text}</span></Link>
{/if}

<style>
    .nav-link {
        cursor: pointer;
        padding: 10px;
    }
    .nav-link:hover {
        background-color: #80808059;
    }
</style>
