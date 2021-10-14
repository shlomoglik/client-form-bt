<script>
    import { onMount } from "svelte";
    import ClientCard from "../components/ClientCard.svelte";
    import { db } from "../services/firestore";
    let draftOnly = true;

    let dataClients = [];

    onMount(() => {
        db.collection("drafts").onSnapshot((snap) => {
            dataClients = snap.docs.map((doc) =>
                Object.assign(
                    { id: `/${doc.ref.path}`, draft: true },
                    doc.data()
                )
            );
        });
    });
</script>

<div class="page">
    <h3>טבלת טפסי לקוח וטיוטות</h3>
    <div class="filters">
        <div class="filter" on:click={() => (draftOnly = !draftOnly)}>
            <span class="text">הצג טיוטה בלבד</span>
            <span class="btn" class:active={draftOnly} />
        </div>
    </div>
    <div class="clients">
        {#each dataClients as client (client.id)}
            {#if client.draft}
                <ClientCard isDraft {client} />
            {:else if !client.draft && !draftOnly}
                <ClientCard {client} />
            {/if}
        {/each}
    </div>
</div>

<style>
    .page {
        height: 100%;
        display: grid;
        align-content: center;
        background-color: #f8f8f8;
    }
    .filters {
        padding: 15px;
    }
    .filter {
        cursor: pointer;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .filter .btn {
        content: "";
        display: block;
        background-color: lightgray;
        width: 50px;
        border-radius: 20px;
        height: 20px;
        position: relative;
    }
    .filter .btn.active {
        background-color: cornflowerblue;
    }
    .filter .btn::after {
        transition: all 0.2s ease-in-out;
        content: "";
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        left: 0;
        background-color: gray;
        transition: all 0.2s ease-out;
    }
    .filter .btn.active::after {
        right: 0;
        background-color: #375283;
    }

    .filter .text {
        color: cornflowerblue;
        transition: all 0.2s ease-in-out;
    }

    .clients {
        display: grid;
        gap: 5px;
    }
</style>
