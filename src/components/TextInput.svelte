<script>
    export let header, formDoc;
</script>

<div class="input">
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <input
        class="input__field"
        type="text"
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
    />
</div>
