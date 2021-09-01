<script>
    export let contacts = [];
    export let editable = false
    $: withContactsPrefix = `באמצעות מורש${
        contacts.length > 1 ? "י" : "ה"
    } החתימה מטעמה:`;
</script>

<p contenteditable={editable}>{withContactsPrefix}</p>
{#if contacts && contacts[0]}
    {#each contacts as contact (contact.id)}
        <p contenteditable="{editable}">
            {contact.prefix ? `${contact.prefix} ` : ""}{contact.name||"____"} ת.ז. {contact.id||"____"}
        </p>
    {/each}
{/if}
