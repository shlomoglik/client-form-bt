<script>
    import { Link } from "svelte-navigator";
    import { db } from "../services/firestore";
    import { userDoc } from "../stores";
    import IconButton from "./IconButton.svelte";

    export let isDraft, client;

    const handleDeleteDraft = async (ref) => {
        try {
            await db.doc(ref).delete();
        } catch (error) {
            console.error(error);
        }
    };
</script>

<div class="client">
    {#if isDraft}
        <span class="tag">טיוטה</span>
        <Link class="client" to={client.id}>
            {client.clientName}
        </Link>
        {#if $userDoc?.email === "g_shlomo@business-time.co.il"}
            <IconButton
                action={(e) => handleDeleteDraft(client.id)}
                icon="icon-trash"
                color="var(--color-danger)"
                withConfirm="למחוק?"
            />
        {/if}
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
