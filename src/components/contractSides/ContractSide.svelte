<script>
    export let company;
    export let editable = false;
</script>

{#if company.name}
    <p contenteditable="{editable}">
        {company.name}
        {#if company.type && company.id}
            <span contenteditable="{editable}"
                >{company.type === "חברה בעמ" ? "ח.פ" : "ע.מ"} {company.id}
            </span>
        {/if}
    </p>
{/if}
{#if company.address}
    <p contenteditable="{editable}">מכתובת {company.address}</p>
{/if}
