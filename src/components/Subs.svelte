<script>
    import Sub from "./Sub.svelte";
    export let subs, formDoc;
</script>

<ol class="subs">
    {#each subs.filter((el) => !el.groupCompany || el.groupCompany === $formDoc.docData.groupCompany) as sub (sub.id)}
        <Sub {formDoc} {subs} {sub} />
    {/each}
</ol>

<style>
    ol.subs {
        display: grid;
        gap: 5px;
        padding: 0 10vw;
    }
    ol :global(.sub) {
        text-align: justify;
    }
</style>
