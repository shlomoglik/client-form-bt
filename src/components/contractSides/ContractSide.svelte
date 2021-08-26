<script>
    export let company;
</script>

{#if company.name}
    <p contenteditable>
        {company.name}
        {#if company.type && company.id}
            <span contenteditable
                >{company.type === "חברה בעמ" ? "ח.פ" : "ע.מ"} {company.id}
            </span>
        {/if}
    </p>
{/if}
{#if company.address}
    <p contenteditable>מכתובת {company.address}</p>
{/if}
