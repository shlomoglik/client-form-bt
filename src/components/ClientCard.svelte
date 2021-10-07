<script>
    import { Link } from "svelte-navigator";

    export let isDraft, client;
</script>

<div class="client">
    {#if isDraft}
        <span class="tag">טיוטה</span>
        <Link class="client" to={client.id}>
            {client.clientName}
        </Link>
    {/if}
    <div>{client.companyName}</div>
    <div>{client.phone}</div>
    <div>{client.email}</div>
</div>

<style>
    .client {
        padding: 3rem;
        border: 1px solid gray;
        display: grid;
        gap: 5px;
        position: relative;
    }
    .tag {
        position: absolute;
        left: 0;
        top: 0;
        background: gray;
        color: white;
        padding: 5px;
        border-radius: 0 10px 0 0;
    }
</style>
