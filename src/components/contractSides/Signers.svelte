<script>
    export let contacts = [];
    let withContactsPrefix = `באמצעות מורש${
        contacts.length > 1 ? "י" : "ה"
    } החתימה מטעמה:`;
</script>

<p contenteditable>{withContactsPrefix}</p>
{#if contacts && contacts[0]}
    {#each contacts as contact (contact.id)}
        <p contenteditable>{contact.prefix} {contact.name} ת.ז. {contact.id}</p>
    {/each}
{/if}
