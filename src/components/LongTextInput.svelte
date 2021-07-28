<script>
    import { formDoc } from "../stores";
    export let header;
</script>

<label for={header}>
    {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
</label>
<div class="input__field">
    <textarea
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
        placeholder={$formDoc.headers[header].placeholder || "---"}
    />
</div>
