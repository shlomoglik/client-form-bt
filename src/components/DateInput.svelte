<script>
    import { formDoc } from "../stores";
    export let header;
</script>

<div class="input">
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <input
        class="input__field"
        type="date"
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
    />
</div>
